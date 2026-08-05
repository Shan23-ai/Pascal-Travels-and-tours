# Pascal Travels & Tour — Payment Server

Backend for processing payments on the Pascal Travels & Tour travel website via three methods:

- 💳 **Card / Stripe** (existing)
- 🏦 **DIB Bank / PesaLink** (real-time interbank, up to KSh 300,000/txn)
- 🌍 **Western Union** (MTCN verification + Mass Payments)

> **Note:** The base site is a static HTML/CSS/JS site. This server adds the backend needed
> for real payment integrations (both PesaLink and Western Union require a server).

---

## Quick Start (Demo Mode — no real credentials needed)

```bash
cd server
cp .env.example .env        # defaults work without modification
npm install
npm start
```

DEMO defaults:
- `PESALINK_PROVIDER=none` → shows **manual DIB bank details** for the customer to transfer via PesaLink.
- `WU_MODE=mock` → accepts any valid-format MTCN (10–16 digits) and marks payment PAID.

Then open `http://localhost:3000` to load the site (served by the server).

---

## Configuration

Copy `.env.example` to `.env` and fill in as you onboard providers.

| Env var | Purpose |
|---|---|
| `PESALINK_PROVIDER` | `sasapay` \| `tingg` \| `none` (manual DIB) |
| `PESALINK_API_BASE` | SasaPay/Tingg sandbox or live URL |
| `PESALINK_CLIENT_ID/SECRET` | Aggregator credentials |
| `PESALINK_WEBHOOK_SECRET` | HMAC secret for webhook signature verification |
| `DIB_*` | Manual DIB bank-account details shown to customer |
| `WU_MODE` | `mock` (dev) or `live` (real API) |
| `WU_CLIENT_ID/SECRET` | WU OAuth2 credentials |
| `WU_CERT_PATH` | Path to the `.p12` client certificate (mTLS) |
| `WU_CERT_PASSPHRASE` | Certificate passphrase |
| `WU_WEBHOOK_SECRET` | Webhook HMAC secret |
| `STRIPE_SECRET_KEY/WEBHOOK_SECRET` | Stripe credentials |
| `DB_ENABLED` | `false` = in-memory store (demo), `true` = PostgreSQL |

---

## API Endpoints

### Create a booking
```
POST /api/payments/bookings
Body: { "packageId": "uae-tv", "packageTitle": "UAE Visit Visa",
        "applicantName": "Jane Wanjiru Kamau", "email": "jane@example.com",
        "phone": "+254700000000", "amount": 150000, "currency": "KES" }
```

### PesaLink — initiate
```
POST /api/payments/pesalink/initiate
Body: { "bookingId": "<id>", "amount": 150000 }
```
- **Aggregator mode:** returns `paymentUrl` to redirect the customer.
- **Manual mode (`none`):** returns DIB bank `instructions` to display.

### PesaLink — customer notifies manual transfer
```
POST /api/payments/pesalink/notify
Body: { "instructionId": "<id>", "senderName": "Jane Kamau",
        "senderBank": "KCB", "senderPhone": "+254700000000",
        "transactionRef": "PESALINK-123456" }
```

### PesaLink — staff confirms credit (admin)
```
POST /api/payments/pesalink/confirm
Body: { "instructionId": "<id>", "staffName": "admin" }
```

### PesaLink — poll status
```
GET /api/payments/pesalink/:paymentId/status
```

### Western Union — initiate
```
POST /api/payments/wu/initiate
Body: { "bookingId": "<id>", "amount": 150000, "currency": "KES" }
```

### Western Union — verify MTCN
```
POST /api/payments/wu/verify
Body: { "paymentId": "<id>", "mtcn": "1284947565123",
        "senderName": "Jane Wanjiru Kamau", "senderCountry": "KE",
        "sendAmount": 1500, "sendCurrency": "USD" }
```

### Western Union — poll status
```
GET /api/payments/wu/:paymentId/status
```

### Booking status summary
```
GET /api/payments/:bookingRef/status
```

---

## Webhooks

| Provider | Endpoint |
|---|---|
| SasaPay (PesaLink) | `POST /api/webhooks/pesalink/sasapay` |
| Cellulant Tingg (PesaLink) | `POST /api/webhooks/pesalink/tingg` |
| Western Union | `POST /api/webhooks/western-union` |
| Stripe | `POST /api/webhooks/stripe` |

All webhooks verify HMAC signatures (when secret configured), deduplicate events by
provider event ID, and return `200` immediately. Use a tunneling tool (e.g. `ngrok`)
to expose your local server while testing with providers.

---

## Merchant / Provider Onboarding (Kenya)

### PesaLink (via CBK-licensed aggregator)
1. Incorporate a business (KCRO/Company Registry) and open a **DIB Kenya business account**.
2. Register with a **CBK-licensed PSP** that supports PesaLink:
   - **SasaPay** — https://sasapay.app (CBK-licensed, native PesaLink)
   - **Cellulant Tingg** — https://cellulant.com
   - **iPay Kenya** — https://ipayafrica.com
3. Complete KYC (business docs, bank account, director IDs).
4. Obtain sandbox credentials → test → move to live keys.
5. Configure webhook URLs + HMAC secret.

### Western Union
1. Partner with **Western Union Business Solutions** (sales team).
2. Obtain a **client certificate (.p12)** + OAuth2 `client_id`/`client_secret`.
3. Enable the **MTCN lookup** (inbound verification) and/or **Mass Payments** (outbound refunds).
4. Store the certificate in a secrets manager, never in the repo.
5. Set `WU_MODE=live` and configure `WU_*` env vars.

---

## Security Notes (Kenya)

- **Data Protection Act 2019:** encrypt PII and MTCN at rest; minimize data collected.
- **POCAMLA:** keep audit trails; flag/KYC transactions > KSh 1,000,000.
- **PCI-DSS:** with Stripe, never let card data touch your servers — use Stripe Elements/Checkout.
- **mTLS:** WU `.p12` cert stored outside the repo, passphrase-protected, rotated annually.
- **Webhooks:** always verify HMAC signatures; deduplicate by event ID.
- **Idempotency:** every charge uses an `idempotency_key` to prevent double-charges.
- **Admin:** `/pesalink/confirm` requires staff auth (MFA) in production — protect with middleware.

---

## Database

Schema lives in `db/schema.sql` (PostgreSQL). By default the server uses an **in-memory
store** (`DB_ENABLED=false`) so it runs with zero setup. To enable Postgres:

```bash
DB_ENABLED=true DATABASE_URL=postgres://user:pass@localhost:5432/pascal_travels \
  node scripts/initDb.js
```

Tables: `bookings`, `payments`, `payment_transactions`, `pesalink_instructions`,
`western_union_verifications`, `webhook_events`, `admins`.
