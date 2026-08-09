-- =====================================================
-- Pascal Travels & Tour — Payment Database Schema
-- PostgreSQL schema for DIB/PesaLink + Western Union + Stripe
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------
-- 1. BOOKINGS — one row per package application/booking
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref      VARCHAR(20) UNIQUE NOT NULL,          -- e.g. TT-482915
  package_id       VARCHAR(50)  NOT NULL,
  package_title    VARCHAR(200) NOT NULL,
  applicant_name   VARCHAR(150) NOT NULL,
  email            VARCHAR(150) NOT NULL,
  phone            VARCHAR(30)  NOT NULL,
  passport         VARCHAR(50),
  amount_currency  CHAR(3) NOT NULL DEFAULT 'KES',
  amount_total     NUMERIC(14,2) NOT NULL,
  status           VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  -- PENDING → PAID → COMPLETED | CANCELLED
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------
-- 2. PAYMENTS — one or more rows per booking
-- payment_method: 'card' | 'pesalink' | 'western_union' | 'mpesa'
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id         UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_method     VARCHAR(20) NOT NULL,
  provider           VARCHAR(50),           -- 'stripe' | 'sasapay' | 'tingg' | 'western_union'
  amount             NUMERIC(14,2) NOT NULL,
  currency           CHAR(3) NOT NULL DEFAULT 'KES',
  status             VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  -- PENDING → PROCESSING → AWAITING_CONFIRMATION → PAID → COMPLETED
  -- PENDING → FAILED | CANCELLED | EXPIRED
  provider_ref       VARCHAR(100),           -- Stripe PI / SasaPay txn / WU MTCN
  payment_url        TEXT,                   -- hosted redirect URL (aggregator)
  idempotency_key    VARCHAR(100) UNIQUE,    -- prevents double-charge
  failure_reason     TEXT,
  paid_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking   ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status    ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method    ON payments(payment_method);

-- -----------------------------------------------------
-- 3. PAYMENT_TRANSACTIONS — audit trail for every event
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id       UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL,    -- 'charge' | 'refund' | 'payout' | 'status_change'
  amount           NUMERIC(14,2) NOT NULL,
  currency         CHAR(3) NOT NULL DEFAULT 'KES',
  provider_txn_id  VARCHAR(100),
  status           VARCHAR(30) NOT NULL,
  raw_response     JSONB,                   -- full provider webhook/payload
  actor            VARCHAR(100) DEFAULT 'system',  -- 'system' | 'webhook' | 'staff:name'
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tx_payment ON payment_transactions(payment_id);

-- -----------------------------------------------------
-- 4. PESALINK_INSTRUCTIONS — manual DIB bank-details flow
--    (or auto PesaLink via aggregator when provider configured)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pesalink_instructions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id         UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  bank_name          VARCHAR(100) NOT NULL DEFAULT 'Dubai Islamic Bank (Kenya)',
  account_name       VARCHAR(150) NOT NULL,
  account_number     VARCHAR(50)  NOT NULL,
  branch             VARCHAR(100),
  swift_code         VARCHAR(20),
  amount_due         NUMERIC(14,2) NOT NULL,
  sender_name        VARCHAR(150),
  sender_bank        VARCHAR(100),          -- bank customer used for PesaLink
  sender_phone       VARCHAR(30),
  transferred_at     TIMESTAMPTZ,
  transaction_ref    VARCHAR(100),          -- customer's PesaLink reference
  staff_confirmed_by VARCHAR(100),          -- staff who verified credit
  staff_confirmed_at TIMESTAMPTZ,
  status             VARCHAR(30) NOT NULL DEFAULT 'AWAITING_CONFIRMATION',
  -- AWAITING_CONFIRMATION → VERIFIED → PAID | REJECTED
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------
-- 5. WESTERN_UNION_VERIFICATIONS — MTCN verification records
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS western_union_verifications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id          UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  mtcn                VARCHAR(30) UNIQUE NOT NULL,
  sender_name         VARCHAR(150) NOT NULL,
  sender_country      VARCHAR(100),
  send_amount         NUMERIC(14,2),
  send_currency       CHAR(3),
  payout_currency     CHAR(3) DEFAULT 'KES',
  payout_amount       NUMERIC(14,2),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  -- PENDING → VERIFIED → PAID | REJECTED
  wu_api_txn_id       VARCHAR(100),
  verified_at         TIMESTAMPTZ,
  rejected_reason     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wu_payment ON western_union_verifications(payment_id);

-- -----------------------------------------------------
-- 6. WEBHOOK_EVENTS — audit log for all provider callbacks
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS webhook_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider      VARCHAR(50) NOT NULL,       -- 'sasapay' | 'tingg' | 'western_union' | 'stripe'
  event_type    VARCHAR(100) NOT NULL,
  event_id      VARCHAR(100) UNIQUE NOT NULL,  -- provider event id (dedupe)
  payload       JSONB NOT NULL,
  signature_ok  BOOLEAN,
  processed     BOOLEAN NOT NULL DEFAULT FALSE,
  received_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------
-- 7. USERS / ADMINS — staff dashboard authentication
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(150) NOT NULL,
  role          VARCHAR(30) NOT NULL DEFAULT 'staff',  -- 'admin' | 'staff'
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------
-- 8. JOBS — job board listings
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS jobs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            VARCHAR(200) NOT NULL,
  country          VARCHAR(120) NOT NULL,
  flag             VARCHAR(20),
  city             VARCHAR(120),
  type             VARCHAR(50),
  salary           VARCHAR(120),
  description       TEXT NOT NULL,
  requirements      JSONB DEFAULT '[]',
  application_link VARCHAR(300),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_country ON jobs(country);

-- -----------------------------------------------------
-- 9. AGENTS — external recruitment agents
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS agents (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name          VARCHAR(200) NOT NULL,
  registration_number  VARCHAR(150) NOT NULL,
  contact_person_name  VARCHAR(150) NOT NULL,
  contact_person_email VARCHAR(150) UNIQUE NOT NULL,
  phone                VARCHAR(50) NOT NULL,
  country_operation    VARCHAR(120) NOT NULL,
  specializations      JSONB DEFAULT '[]',
  monthly_candidates   INTEGER DEFAULT 0,
  password_hash        VARCHAR(255) NOT NULL,
  status               VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  -- PENDING → APPROVED | REJECTED
  approved_at          TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- -----------------------------------------------------
-- 10. CANDIDATES — submitted by agents
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS candidates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id          UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  candidate_name    VARCHAR(150) NOT NULL,
  candidate_email   VARCHAR(150) NOT NULL,
  candidate_phone   VARCHAR(50) NOT NULL,
  country_interest  VARCHAR(120) NOT NULL,
  visa_type         VARCHAR(120) NOT NULL,
  cv_filename       VARCHAR(255),
  notes             TEXT,
  status            VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
  -- SUBMITTED → UNDER_REVIEW → ACCEPTED | REJECTED
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidates_agent ON candidates(agent_id);

-- -----------------------------------------------------
-- 11. AGENT_COMMISSIONS — payouts to agents
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS agent_commissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id      UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  candidate_id  UUID REFERENCES candidates(id) ON DELETE SET NULL,
  amount        NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency      CHAR(3) NOT NULL DEFAULT 'USD',
  status        VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  -- PENDING → PAID
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_agent ON agent_commissions(agent_id);
