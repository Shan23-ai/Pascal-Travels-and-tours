# Payment Integration TODO — Pascal Travels & Tour

Goal: Add DIB/PesaLink and Western Union payment methods to the static travel site
(vanilla HTML/CSS/JS at `vs.code/www/`), with a Node.js/Express backend.

## Steps

- [x] 1. Analyze existing frontend (`index.html` Step 4 payment stepper, `app.js` payment flow)
- [x] 2. Create backend project structure (`server/package.json`, `.env.example`, `config.js`)
- [x] 3. Create database schema (`server/db/schema.sql`) — bookings, payments, transactions, PesaLink instructions, WU verifications, webhook audit
- [x] 4. Implement PesaLink service (`server/services/pesalinkService.js`) — aggregator API (SasaPay/Cellulant Tingg) + manual DIB bank-instructions fallback
- [x] 5. Implement Western Union service (`server/services/westernUnionService.js`) — mTLS agent, OAuth2, MTCN verification, Mass Payments, webhook signature verification
- [x] 6. Implement in-memory/Postgres store (`server/store.js`)
- [x] 7. Implement payment API routes (`server/routes/payments.js`) — create booking, initiate PesaLink, notify manual transfer, initiate/verify WU, status polling
- [x] 8. Implement webhook handlers (`server/routes/webhooks.js`) — PesaLink, Western Union, Stripe
- [x] 9. Implement Express server (`server/server.js`) — static hosting + API
- [x] 10. Update `index.html` — unified payment method selector (Card | PesaLink | Western Union) in Step 4 + new CSS
- [x] 11. Update `app.js` — method panels, PesaLink notify flow, WU MTCN verify flow, backend API calls with demo fallback
- [x] 12. Create server README with API docs, webhook payload formats, merchant onboarding process
- [x] 13. Install dependencies, run server, verify endpoints + frontend

## Verification (all passed)

- [x] Server boots cleanly on port 3000, `/api/health` returns ok
- [x] `POST /api/payments/bookings` creates booking (201)
- [x] `POST /api/payments/pesalink/initiate` returns DIB bank details (manual mode)
- [x] `GET /api/payments/pesalink/:paymentId/status` polls status
- [x] `POST /api/payments/pesalink/notify` records customer transfer notification
- [x] `POST /api/payments/pesalink/confirm` staff confirms → booking PAID
- [x] PesaLink > KSh 300,000 limit correctly rejected (400)
- [x] `POST /api/payments/wu/initiate` returns WU receipt instructions
- [x] `POST /api/payments/wu/verify` verifies MTCN → VERIFIED
- [x] `GET /api/payments/wu/:paymentId/status` polls status
- [x] Duplicate MTCN correctly rejected (409)
- [x] `GET /api/payments/:bookingRef/status` returns booking + payment summary
