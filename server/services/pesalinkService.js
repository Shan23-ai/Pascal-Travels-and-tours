/**
 * PesaLink (DIB Kenya) Payment Service
 * =====================================
 * DIB Kenya is on the PesaLink interbank network — real-time transfers
 * up to KSh 300,000 per transaction, 24/7, including weekends & holidays.
 *
 * DIB has NO public merchant API. Two integration paths:
 *
 *   [A] AGGREGATOR (recommended for full automation)
 *       Use a CBK-licensed PSP that already supports PesaLink:
 *         - SasaPay      (https://sasapay.app  — sandbox: sandbox.sasapay.app)
 *         - Cellulant Tingg (https://developer.tingg.africa)
 *         - iPay Kenya   (https://ipayafrica.com)
 *       Customer is redirected to the aggregator's hosted page (or a
 *       PesaLink payment request is pushed to their bank app) and the
 *       aggregator confirms settlement via a signed webhook.
 *
 *   [B] MANUAL BANK-DETAILS FALLBACK (zero-cost launch mode)
 *       Show the DIB bank account, customer sends money via PesaLink from
 *       their own bank app, submits a notification form, and staff verify
 *       the credit on the DIB statement before confirming the booking.
 *
 * Status flow: PENDING → PROCESSING → AWAITING_CONFIRMATION → PAID → COMPLETED
 *              PENDING → FAILED | CANCELLED | EXPIRED
 */

'use strict';

const crypto = require('crypto');
const axios = require('axios');
const config = require('../config');
const { getStore } = require('../store');

/* ==============================================
 * 1. INITIATE PESALINK PAYMENT
 * ============================================== */

/**
 * Create a PesaLink payment for a booking.
 * - If an aggregator is configured, creates the payment request via the
 *   aggregator API and returns a hosted payment URL.
 * - Otherwise (PESALINK_PROVIDER=none), falls back to manual DIB bank
 *   details + instruction record for the customer to transfer to.
 */
async function initiatePesalinkPayment({ booking, amount, idempotencyKey }) {
  const store = await getStore();

  // PesaLink per-transaction limit
  if (amount > 300000) {
    const err = new Error('PesaLink transactions are limited to KSh 300,000 per transfer. Please split the payment or use another method.');
    err.status = 400;
    throw err;
  }

  const payment = await store.createPayment({
    bookingId: booking.id,
    paymentMethod: 'pesalink',
    provider: config.pesalink.provider || 'manual_dib',
    amount,
    currency: 'KES',
    status: config.pesalink.provider === 'none' ? 'AWAITING_CONFIRMATION' : 'PROCESSING',
    idempotencyKey: idempotencyKey || crypto.randomUUID()
  });

  // ---- AGGREGATOR PATH ----
  if (config.pesalink.provider === 'sasapay') {
    return await initiateSasaPay({ store, payment, booking, amount });
  }
  if (config.pesalink.provider === 'tingg') {
    return await initiateTingg({ store, payment, booking, amount });
  }

  // ---- MANUAL DIB BANK-DETAILS PATH ----
  const instruction = await store.createPesalinkInstruction({
    paymentId: payment.id,
    bankName: config.dib.bankName,
    accountName: config.dib.accountName,
    accountNumber: config.dib.accountNumber,
    branch: config.dib.branch,
    swiftCode: config.dib.swiftCode,
    amountDue: amount,
    status: 'AWAITING_CONFIRMATION'
  });

  await store.addTransaction({
    paymentId: payment.id,
    transactionType: 'charge',
    amount,
    currency: 'KES',
    status: 'AWAITING_CONFIRMATION',
    rawResponse: { mode: 'manual_dib', instructionId: instruction.id },
    actor: 'system'
  });

  return {
    payment,
    mode: 'manual_dib',
    bankDetails: {
      bankName: config.dib.bankName,
      accountName: config.dib.accountName,
      accountNumber: config.dib.accountNumber,
      branch: config.dib.branch,
      swiftCode: config.dib.swiftCode,
      pesalinkMerchantId: config.dib.pesalinkMerchantId
    },
    instructionId: instruction.id,
    amount,
    currency: 'KES',
    note: 'Send the exact amount via PesaLink from your bank app, then submit the transfer notification on the checkout page.',
    status: payment.status
  };
}

/* ---- SasaPay aggregator ---- */
async function initiateSasaPay({ store, payment, booking, amount }) {
  const token = await sasapayToken();
  const url = `${config.pesalink.apiBase}/transactions`;
  const reference = `TT-${booking.bookingRef.split('-')[1]}-${payment.id.slice(0, 8)}`;

  const payload = {
    merchantCode: config.pesalink.merchantCode,
    amount: Number(amount).toFixed(2),
    currency: 'KES',
    description: `Pascal Travels — ${booking.packageTitle}`,
    reference,
    callbackUrl: `${config.appUrl}/api/webhooks/pesalink/sasapay`,
    customer: booking.applicantName
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    const d = resp.data;
    const providerRef = d.transactionId || d.reference || reference;
    const paymentUrl = d.paymentUrl || d.redirectUrl || '';

    await store.updatePayment(payment.id, {
      provider: 'sasapay',
      providerRef,
      paymentUrl,
      status: 'PROCESSING'
    });

    return {
      payment: await store.getPayment(payment.id),
      mode: 'aggregator',
      provider: 'sasapay',
      paymentUrl,
      providerRef,
      status: 'PROCESSING'
    };
  } catch (err) {
    await store.updatePayment(payment.id, { status: 'FAILED', failureReason: err.message });
    throw pesalinkErrorHandler(err);
  }
}

/* ---- Cellulant Tingg aggregator ---- */
async function initiateTingg({ store, payment, booking, amount }) {
  const url = `${config.pesalink.apiBase}/v3/payment-requests`;
  const payload = {
    serviceCode: config.pesalink.merchantCode,
    requestAmount: Number(amount).toFixed(2),
    currencyCode: 'KES',
    requestDescription: `Pascal Travels — ${booking.packageTitle}`,
    msisdn: booking.phone || '',
    channel: 'PESALINK',
    countryCode: 'KE',
    callBackUrl: `${config.appUrl}/api/webhooks/pesalink/tingg`
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-ApiKey': config.pesalink.clientSecret,
        'X-Target': 'inline'
      }
    });

    const d = resp.data;
    const providerRef = d.transactionId || d.reference || '';
    const paymentUrl = d.checkoutUrl || d.redirectUrl || '';

    await store.updatePayment(payment.id, {
      provider: 'tingg',
      providerRef,
      paymentUrl,
      status: 'PROCESSING'
    });

    return {
      payment: await store.getPayment(payment.id),
      mode: 'aggregator',
      provider: 'tingg',
      paymentUrl,
      providerRef,
      status: 'PROCESSING'
    };
  } catch (err) {
    await store.updatePayment(payment.id, { status: 'FAILED', failureReason: err.message });
    throw pesalinkErrorHandler(err);
  }
}

/* ==============================================
 * 2. MANUAL TRANSFER NOTIFICATION (customer)
 * ============================================== */

/**
 * Customer has sent money via PesaLink to the DIB account.
 * Records their details; staff verify credit on the DIB statement.
 */
async function notifyManualTransfer({ instructionId, senderName, senderBank, senderPhone, transactionRef, transferredAt }) {
  const store = await getStore();
  const instruction = await store.getPesalinkInstruction(instructionId);
  if (!instruction) {
    const err = new Error('PesaLink instruction not found');
    err.status = 404;
    throw err;
  }
  if (instruction.status !== 'AWAITING_CONFIRMATION') {
    const err = new Error(`Instruction already ${instruction.status.toLowerCase()} — nothing to update.`);
    err.status = 409;
    throw err;
  }

  const updated = await store.updatePesalinkInstruction(instructionId, {
    senderName,
    senderBank: senderBank || '',
    senderPhone: senderPhone || '',
    transactionRef: transactionRef || '',
    transferredAt: transferredAt || new Date().toISOString(),
    status: 'VERIFIED'   // pending staff final confirmation
  });

  // Payment remains AWAITING_CONFIRMATION; staff confirm step flips to PAID.
  return { ...instruction, ...updated };
}

/* ==============================================
 * 3. STAFF CONFIRMATION (credit verified on DIB statement)
 * ============================================== */

/**
 * STAFF-ONLY. Confirms the money actually appeared on the DIB statement.
 * In production, wrap this endpoint with admin auth (MFA) + audit log.
 */
async function staffConfirmPesalink({ instructionId, staffName }) {
  const store = await getStore();
  const instruction = await store.getPesalinkInstruction(instructionId);
  if (!instruction) {
    const err = new Error('PesaLink instruction not found');
    err.status = 404;
    throw err;
  }

  await store.updatePesalinkInstruction(instructionId, {
    staffConfirmedBy: staffName,
    staffConfirmedAt: new Date().toISOString(),
    status: 'PAID'
  });

  const payment = await store.getPayment(instruction.paymentId);
  if (payment) {
    await store.updatePayment(payment.id, { status: 'PAID', paidAt: new Date().toISOString() });
    await store.updateBooking(payment.bookingId, { status: 'PAID' });
    await store.addTransaction({
      paymentId: payment.id,
      transactionType: 'charge',
      amount: payment.amount,
      currency: payment.currency,
      providerTxnId: instruction.transactionRef || '',
      status: 'PAID',
      rawResponse: { confirmedBy: staffName, instructionId: instruction.id },
      actor: `staff:${staffName}`
    });
  }

  return await store.getPayment(instruction.paymentId);
}

/* ==============================================
 * 4. STATUS CHECK (polling fallback)
 * ============================================== */

/**
 * Query the current status of a PesaLink payment.
 * With an aggregator, calls the provider's status endpoint;
 * with manual mode, returns the stored instruction + payment state.
 */
async function checkPesalinkStatus(paymentId) {
  const store = await getStore();
  const payment = await store.getPayment(paymentId);
  if (!payment || payment.paymentMethod !== 'pesalink') {
    const err = new Error('PesaLink payment not found');
    err.status = 404;
    throw err;
  }

  if (payment.provider === 'sasapay') {
    const token = await sasapayToken();
    const resp = await axios.get(
      `${config.pesalink.apiBase}/transactions/${payment.providerRef}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const d = resp.data;
    const mapped = mapAggregatorStatus(d.status);
    if (mapped !== payment.status) {
      await store.updatePayment(payment.id, { status: mapped });
      if (mapped === 'PAID') {
        await store.updateBooking(payment.bookingId, { status: 'PAID' });
        await store.updatePayment(payment.id, { paidAt: new Date().toISOString() });
      }
    }
    return { payment: await store.getPayment(payment.id), providerStatus: d };
  }

  if (payment.provider === 'tingg') {
    const resp = await axios.get(
      `${config.pesalink.apiBase}/v3/payment-requests/${payment.providerRef}`,
      { headers: { 'X-ApiKey': config.pesalink.clientSecret } }
    );
    const d = resp.data;
    const mapped = mapAggregatorStatus(d.status || d.statusCode);
    if (mapped !== payment.status) {
      await store.updatePayment(payment.id, { status: mapped });
      if (mapped === 'PAID') {
        await store.updateBooking(payment.bookingId, { status: 'PAID' });
        await store.updatePayment(payment.id, { paidAt: new Date().toISOString() });
      }
    }
    return { payment: await store.getPayment(payment.id), providerStatus: d };
  }

  // Manual mode
  const instruction = await store.getPesalinkInstructionByPayment(payment.id);
  return {
    payment: { ...payment },
    instruction: { ...instruction },
    status: payment.status
  };
}

/* ==============================================
 * 5. WEBHOOK HANDLER
 * ============================================== */

/**
 * Process an incoming aggregator webhook (SasaPay / Tingg).
 * Verifies the signature, dedupes by event id, and updates payment state.
 */
async function handlePesalinkWebhook({ provider, headers, body }) {
  const store = await getStore();

  const signatureValid = verifyPesalinkSignature({ provider, headers, body });
  const eventId = String(body.id || body.eventId || body.event_id || body.reference || crypto.randomUUID());

  const existing = await store.getWebhookEventByEventId(eventId);
  if (existing && existing.processed) {
    return { processed: false, duplicate: true, eventId };
  }

  const event = await store.createWebhookEvent({
    provider,
    eventType: body.type || body.eventType || 'payment_update',
    eventId,
    payload: body,
    signatureOk: signatureValid
  });

  if (!signatureValid) {
    // Still record but don't process
    return { processed: false, signatureInvalid: true, eventId };
  }

  const providerRef =
    body.transactionId || body.reference || body.transactionReference || body.checkoutRequestId || '';

  const payment = providerRef
    ? await store.getPaymentByProviderRef(providerRef) || await store.getPaymentByProviderRef(String(providerRef))
    : null;

  if (!payment) {
    return { processed: false, paymentNotFound: true, eventId, providerRef };
  }

  const rawStatus = String(body.status || body.statusCode || body.txnStatus || '').toUpperCase();
  let mapped = payment.status;
  if (['PAID', 'SUCCESSFUL', 'COMPLETED', 'SUCCESS', 'UTILITY_CONFIRMED'].includes(rawStatus)) {
    mapped = 'PAID';
  } else if (['FAILED', 'REJECTED', 'CANCELLED', 'CANCELED', 'EXPIRED', 'FAIL'].includes(rawStatus)) {
    mapped = 'FAILED';
  } else if (['PROCESSING', 'PENDING', 'IN_PROGRESS', 'INITIATED'].includes(rawStatus)) {
    mapped = 'PROCESSING';
  }

  if (mapped !== payment.status) {
    const updates = { status: mapped };
    if (mapped === 'PAID') updates.paidAt = new Date().toISOString();
    if (mapped === 'FAILED') updates.failureReason = body.reason || body.message || 'Provider reported failure';
    await store.updatePayment(payment.id, updates);

    await store.addTransaction({
      paymentId: payment.id,
      transactionType: 'status_change',
      amount: body.amount || payment.amount,
      currency: body.currency || payment.currency,
      providerTxnId: String(providerRef || eventId),
      status: mapped,
      rawResponse: body,
      actor: `webhook:${provider}`
    });

    if (mapped === 'PAID') {
      await store.updateBooking(payment.bookingId, { status: 'PAID' });
    }
  }

  await store.markWebhookProcessed(event.id);
  return { processed: true, paymentId: payment.id, status: mapped, eventId };
}

/**
 * Verify a PesaLink aggregator webhook signature.
 * - SasaPay: HMAC-SHA256 of raw body using the webhook secret (X-SASAPAY-SIGNATURE)
 * - Tingg:   HMAC-SHA256 (usually via digest in header)
 * Header names vary by provider; adapt to your provider's docs.
 */
function verifyPesalinkSignature({ provider, headers, body }) {
  const secret = config.pesalink.webhookSecret;
  if (!secret) return true; // dev mode

  const sigKey = provider === 'sasapay'
    ? 'x-sasapay-signature'
    : provider === 'tingg'
      ? 'x-tingg-signature'
      : 'x-signature';

  const signature = headers['x-pesalink-signature'] || headers[sigKey] || headers['x-signature'];
  if (!signature) return false;

  const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
  const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  // Accept either raw hex or "sha256=..." prefixed signatures
  const provided = signature.startsWith('sha256=') ? signature.slice(7) : signature;
  const a = Buffer.from(hmac, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ==============================================
 * INTERNAL HELPERS
 * ============================================== */

async function sasapayToken() {
  const url = `${config.pesalink.apiBase}/oauth/token`;
  const resp = await axios.post(url, {
    client_id: config.pesalink.clientId,
    client_secret: config.pesalink.clientSecret,
    grant_type: 'client_credentials'
  });
  return resp.data.access_token || resp.data.token;
}

function mapAggregatorStatus(s) {
  const u = String(s || '').toUpperCase();
  if (['PAID', 'SUCCESSFUL', 'COMPLETED', 'SUCCESS', 'UTILITY_CONFIRMED'].includes(u)) return 'PAID';
  if (['FAILED', 'REJECTED', 'CANCELLED', 'CANCELED', 'EXPIRED', 'FAIL'].includes(u)) return 'FAILED';
  if (['PROCESSING', 'PENDING', 'IN_PROGRESS', 'INITIATED'].includes(u)) return 'PROCESSING';
  return 'PENDING';
}

/**
 * Normalize aggregator API/webhook errors into friendly messages.
 */
function pesalinkErrorHandler(err) {
  if (err.response) {
    return new Error(
      `PesaLink aggregator error ${err.response.status}: ${err.response.data?.message || err.response.data?.error || 'Unknown'}`
    );
  }
  return new Error(`PesaLink request failed: ${err.message}`);
}

/* ==============================================
 * SAMPLE PAYLOADS (docs / dev testing)
 * ============================================== */

const SAMPLE_PAYLOADS = {
  initiateRequest: {
    bookingId: '00000000-0000-0000-0000-000000000001',
    amount: 150000,
    idempotencyKey: '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
  },
  initiateResponseManual: {
    mode: 'manual_dib',
    bankDetails: {
      bankName: 'Dubai Islamic Bank (Kenya)',
      accountName: 'Pascal Travels & Tour Ltd',
      accountNumber: '0101234567890',
      branch: 'Tom Mboya Street Branch, Nairobi',
      swiftCode: 'DIBKKENA'
    },
    instructionId: '00000000-0000-0000-0000-000000000002',
    amount: 150000,
    currency: 'KES',
    status: 'AWAITING_CONFIRMATION'
  },
  sasapayWebhook: {
    id: 'evt_00001',
    transactionId: 'TX-20260115-0001',
    reference: 'TT-482915-ABC12345',
    type: 'transaction.paid',
    status: 'PAID',
    amount: '150000.00',
    currency: 'KES',
    msisdn: '254700000000',
    paid_at: '2026-01-15T10:30:00Z'
  },
  tinggWebhook: {
    id: 'evt_00002',
    checkoutRequestId: 'ws_CO_01012026103017142959',
    status: 'PROCESSED',
    amount: '150000.00',
    currencyCode: 'KES'
  }
};

module.exports = {
  initiatePesalinkPayment,
  notifyManualTransfer,
  staffConfirmPesalink,
  checkPesalinkStatus,
  handlePesalinkWebhook,
  verifyPesalinkSignature,
  pesalinkErrorHandler,
  SAMPLE_PAYLOADS
};

