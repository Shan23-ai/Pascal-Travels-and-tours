/**
 * Payment API Routes
 * ===================
 * REST endpoints for creating bookings and initiating payments
 * across all three methods: Card (Stripe), PesaLink (DIB), Western Union.
 *
 * Endpoints:
 *   POST /api/payments/bookings           — create a booking + return ref
 *   POST /api/payments/pesalink/initiate  — initiate PesaLink payment
 *   POST /api/payments/pesalink/notify    — customer notifies manual transfer
 *   POST /api/payments/pesalink/confirm   — staff confirms credit (admin)
 *   GET  /api/payments/pesalink/:id/status— poll PesaLink status
 *   POST /api/payments/wu/initiate        — initiate WU payment
 *   POST /api/payments/wu/verify          — verify MTCN
 *   GET  /api/payments/wu/:id/status      — poll WU status
 *   GET  /api/payments/:bookingRef/status — booking + payment summary
 */

'use strict';

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { getStore } = require('../store');
const pesalinkService = require('../services/pesalinkService');
const westernUnionService = require('../services/westernUnionService');
const config = require('../config');

/* ==============================================
 * Helper: generate booking reference
 * ============================================== */
function generateBookingRef() {
  return 'TT-' + Math.floor(100000 + Math.random() * 900000);
}

/* ==============================================
 * POST /api/payments/bookings
 * Create a booking and return its reference.
 * ============================================== */
router.post('/bookings', async (req, res, next) => {
  try {
    const { packageId, packageTitle, applicantName, email, phone, passport, amount, currency } = req.body || {};

    // ---- Server-side validation ----
    if (!packageId || !applicantName || !email || !phone || !amount) {
      return res.status(400).json({ error: 'Missing required fields: packageId, applicantName, email, phone, amount' });
    }
    if (!/^[^\s@.][^\s@]*@[^\s@.][^\s@]*\.[^\s@.]{2,}$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const store = await getStore();
    const booking = await store.createBooking({
      bookingRef: generateBookingRef(),
      packageId,
      packageTitle: packageTitle || '',
      applicantName,
      email,
      phone,
      passport: passport || '',
      amountCurrency: currency || 'KES',
      amountTotal: Number(amount)
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/payments/pesalink/initiate
 * ============================================== */
router.post('/pesalink/initiate', async (req, res, next) => {
  try {
    const { bookingId, amount, idempotencyKey } = req.body || {};
    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'bookingId and amount are required' });
    }

    const store = await getStore();
    const booking = await store.getBooking(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const result = await pesalinkService.initiatePesalinkPayment({
      booking,
      amount: Number(amount),
      idempotencyKey: idempotencyKey || crypto.randomUUID()
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/payments/pesalink/notify
 * Customer has sent the money via PesaLink to the DIB account.
 * ============================================== */
router.post('/pesalink/notify', async (req, res, next) => {
  try {
    const { instructionId, senderName, senderBank, senderPhone, transactionRef, transferredAt } = req.body || {};
    if (!instructionId || !senderName) {
      return res.status(400).json({ error: 'instructionId and senderName are required' });
    }

    const result = await pesalinkService.notifyManualTransfer({
      instructionId,
      senderName,
      senderBank: senderBank || '',
      senderPhone: senderPhone || '',
      transactionRef: transactionRef || '',
      transferredAt
    });

    res.json({
      message: 'Transfer notification received. Our team will verify the credit on our DIB account and confirm your booking within 2 business hours.',
      instruction: result
    });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/payments/pesalink/confirm
 * STAFF ONLY: confirm credit appeared on DIB statement.
 * In production, protect this with auth middleware (MFA).
 * ============================================== */
router.post('/pesalink/confirm', async (req, res, next) => {
  try {
    const { instructionId, staffName } = req.body || {};
    if (!instructionId) return res.status(400).json({ error: 'instructionId is required' });

    const payment = await pesalinkService.staffConfirmPesalink({
      instructionId,
      staffName: staffName || 'staff'
    });

    res.json({ message: 'Payment confirmed. Booking marked as PAID.', payment });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/payments/pesalink/:id/status
 * Polling fallback when webhooks are unavailable.
 * ============================================== */
router.get('/pesalink/:id/status', async (req, res, next) => {
  try {
    const result = await pesalinkService.checkPesalinkStatus(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/payments/wu/initiate
 * ============================================== */
router.post('/wu/initiate', async (req, res, next) => {
  try {
    const { bookingId, amount, currency } = req.body || {};
    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'bookingId and amount are required' });
    }

    const store = await getStore();
    const booking = await store.getBooking(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const result = await westernUnionService.initiateWesternUnionPayment({
      booking,
      amount: Number(amount),
      currency: currency || 'KES'
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/payments/wu/verify
 * Customer submits MTCN to confirm their WU payment.
 * ============================================== */
router.post('/wu/verify', async (req, res, next) => {
  try {
    const { paymentId, mtcn, senderName, senderCountry, sendAmount, sendCurrency } = req.body || {};
    if (!paymentId || !mtcn || !senderName) {
      return res.status(400).json({ error: 'paymentId, mtcn, and senderName are required' });
    }

    const result = await westernUnionService.verifyMTCN({
      paymentId,
      mtcn,
      senderName,
      senderCountry: senderCountry || '',
      sendAmount: sendAmount || 0,
      sendCurrency: sendCurrency || 'USD'
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/payments/wu/:id/status
 * ============================================== */
router.get('/wu/:id/status', async (req, res, next) => {
  try {
    const result = await westernUnionService.checkWuStatus(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/payments/:bookingRef/status
 * Full booking + payments summary (used by success view).
 * ============================================== */
router.get('/:bookingRef/status', async (req, res, next) => {
  try {
    const store = await getStore();
    const booking = await store.getBookingByRef(req.params.bookingRef);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const payments = await store.listPaymentsByBooking(booking.id);
    res.json({ booking, payments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

