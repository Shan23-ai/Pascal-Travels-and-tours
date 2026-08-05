/**
 * Webhook Handler Routes
 * =======================
 * Provider callbacks for PesaLink (SasaPay/Tingg), Western Union, and Stripe.
 *
 * All webhook endpoints use `express.raw()` to preserve the raw body
 * for signature verification (HMAC is computed over the raw bytes).
 *
 * Event deduplication is handled via the `webhook_events` table using the
 * provider's event ID. Always return 200 quickly and process in the background.
 */

'use strict';

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const pesalinkService = require('../services/pesalinkService');
const westernUnionService = require('../services/westernUnionService');
const config = require('../config');

// Middleware: parse raw body (needed for signature verification)
const rawBody = express.raw({ type: '*/*' });

/* ==============================================
 * POST /api/webhooks/pesalink/sasapay
 * ============================================== */
router.post('/pesalink/sasapay', rawBody, async (req, res) => {
  try {
    const body = rawToJson(req.body);
    const result = await pesalinkService.handlePesalinkWebhook({
      provider: 'sasapay',
      headers: req.headers,
      body
    });
    // Always 200 to acknowledge receipt; prevent provider retries
    res.status(200).json({ received: true, ...result });
  } catch (err) {
    console.error('[webhook:sasapay]', err.message);
    res.status(200).json({ received: true, error: 'processing_error' });
  }
});

/* ==============================================
 * POST /api/webhooks/pesalink/tingg
 * ============================================== */
router.post('/pesalink/tingg', rawBody, async (req, res) => {
  try {
    const body = rawToJson(req.body);
    const result = await pesalinkService.handlePesalinkWebhook({
      provider: 'tingg',
      headers: req.headers,
      body
    });
    res.status(200).json({ received: true, ...result });
  } catch (err) {
    console.error('[webhook:tingg]', err.message);
    res.status(200).json({ received: true, error: 'processing_error' });
  }
});

/* ==============================================
 * POST /api/webhooks/western-union
 * ============================================== */
router.post('/western-union', rawBody, async (req, res) => {
  try {
    const body = rawToJson(req.body);
    const result = await westernUnionService.handleWesternUnionWebhook({
      headers: req.headers,
      body
    });
    res.status(200).json({ received: true, ...result });
  } catch (err) {
    console.error('[webhook:western-union]', err.message);
    res.status(200).json({ received: true, error: 'processing_error' });
  }
});

/* ==============================================
 * POST /api/webhooks/stripe
 * Stripe requires raw body + signature verification of the event.
 * ============================================== */
router.post('/stripe', rawBody, async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const secret = config.stripe.webhookSecret;
    if (!secret || !sig) {
      return res.status(400).json({ error: 'Missing Stripe signature or secret' });
    }

    // Verify signature (Stripe uses a timestamp + v1 HMAC scheme)
    const event = verifyStripeSignature(sig, req.body, secret);

    // Handle the event (payment_intent.succeeded, etc.)
    const { getStore } = require('../store');
    const store = await getStore();
    const eventId = event.id;

    const existing = await store.getWebhookEventByEventId(eventId);
    if (existing && existing.processed) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    const evt = await store.createWebhookEvent({
      provider: 'stripe',
      eventType: event.type,
      eventId,
      payload: event,
      signatureOk: true,
      processed: false
    });

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const payment = await store.getPaymentByProviderRef(pi.id);
      if (payment) {
        await store.updatePayment(payment.id, { status: 'PAID', paidAt: new Date().toISOString() });
        await store.updateBooking(payment.bookingId, { status: 'PAID' });
        await store.addTransaction({
          paymentId: payment.id,
          transactionType: 'charge',
          amount: pi.amount / 100,
          currency: (pi.currency || 'kes').toUpperCase(),
          providerTxnId: pi.id,
          status: 'PAID',
          rawResponse: event,
          actor: 'webhook:stripe'
        });
      }
    }

    await store.markWebhookProcessed(evt.id);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('[webhook:stripe]', err.message);
    res.status(400).json({ error: 'Invalid signature' });
  }
});

/* ==============================================
 * Helpers
 * ============================================== */

/**
 * Convert raw Buffer body to JSON object.
 */
function rawToJson(buf) {
  if (!buf) return {};
  if (typeof buf === 'object' && Buffer.isBuffer(buf)) {
    try { return JSON.parse(buf.toString('utf8')); } catch (e) { return {}; }
  }
  return buf;
}

/**
 * Verify a Stripe webhook signature (only the v1 scheme).
 * Stripe format: t=<timestamp>,v1=<signature>
 */
function verifyStripeSignature(signatureHeader, rawBody, secret) {
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const v1 = parts.find(p => p.startsWith('v1='))?.slice(3);

  if (!timestamp || !v1) throw new Error('Invalid Stripe signature format');

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody.toString('utf8')}`)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Stripe signature mismatch');
  }

  // Reject signatures older than 5 minutes (optional)
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp, 10));
  if (age > 300) throw new Error('Stripe webhook signature too old');

  return JSON.parse(rawBody.toString('utf8'));
}

module.exports = router;
