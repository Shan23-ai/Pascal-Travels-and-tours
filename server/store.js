/**
 * Data store abstraction.
 * - In-memory store (default, zero-config demo mode)
 * - PostgreSQL store (when DB_ENABLED=true)
 *
 * All methods are async and return plain JSON objects.
 */
'use strict';

const { v4: uuidv4 } = require('uuid');
const config = require('./config');

/* ==============================================
 * IN-MEMORY STORE
 * ============================================== */
class MemoryStore {
constructor() {
    this.bookings = [];
    this.payments = [];
    this.transactions = [];
    this.pesalinkInstructions = [];
    this.wuVerifications = [];
    this.webhookEvents = [];
    this.jobs = [];
    this.agents = [];
    this.candidates = [];
    this.commissions = [];
  }

  /* ---- jobs ---- */
  async createJob(data) {
    const job = {
      id: uuidv4(),
      title: data.title,
      country: data.country,
      flag: data.flag || '',
      city: data.city || '',
      type: data.type || '',
      salary: data.salary || '',
      description: data.description,
      requirements: data.requirements || [],
      applicationLink: data.applicationLink || '',
      active: data.active !== undefined ? data.active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.jobs.push(job);
    return job;
  }

  async listJobs(activeOnly = true) {
    return this.jobs.filter(j => !activeOnly || j.active);
  }

  async getJob(id) {
    return this.jobs.find(j => j.id === id) || null;
  }

  async updateJob(id, patch) {
    const job = this.jobs.find(j => j.id === id);
    if (!job) return null;
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    return job;
  }

  async deleteJob(id) {
    const idx = this.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    return this.jobs.splice(idx, 1)[0];
  }

  /* ---- agents ---- */
  async createAgent(data) {
    const agent = {
      id: uuidv4(),
      agencyName: data.agencyName,
      registrationNumber: data.registrationNumber,
      contactPersonName: data.contactPersonName,
      contactPersonEmail: data.contactPersonEmail,
      phone: data.phone,
      countryOperation: data.countryOperation,
      specializations: data.specializations || [],
      monthlyCandidates: data.monthlyCandidates || 0,
      passwordHash: data.passwordHash,
      status: 'PENDING',
      approvedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.agents.push(agent);
    return agent;
  }

  async getAgent(id) {
    return this.agents.find(a => a.id === id) || null;
  }

  async getAgentByEmail(email) {
    return this.agents.find(a => a.contactPersonEmail.toLowerCase() === String(email).toLowerCase()) || null;
  }

  async listAgents() {
    return this.agents;
  }

  async updateAgent(id, patch) {
    const agent = this.agents.find(a => a.id === id);
    if (!agent) return null;
    Object.assign(agent, patch, { updatedAt: new Date().toISOString() });
    return agent;
  }

  /* ---- candidates ---- */
  async createCandidate(data) {
    const candidate = {
      id: uuidv4(),
      agentId: data.agentId,
      candidateName: data.candidateName,
      candidateEmail: data.candidateEmail,
      candidatePhone: data.candidatePhone,
      countryInterest: data.countryInterest,
      visaType: data.visaType,
      cvFilename: data.cvFilename || '',
      notes: data.notes || '',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.candidates.push(candidate);
    return candidate;
  }

  async getCandidate(id) {
    return this.candidates.find(c => c.id === id) || null;
  }

  async listCandidatesByAgent(agentId) {
    return this.candidates.filter(c => c.agentId === agentId);
  }

  async listAllCandidates() {
    return this.candidates;
  }

  async updateCandidate(id, patch) {
    const candidate = this.candidates.find(c => c.id === id);
    if (!candidate) return null;
    Object.assign(candidate, patch, { updatedAt: new Date().toISOString() });
    return candidate;
  }

  /* ---- commissions ---- */
  async createCommission(data) {
    const commission = {
      id: uuidv4(),
      agentId: data.agentId,
      candidateId: data.candidateId || null,
      amount: data.amount || 0,
      currency: data.currency || 'USD',
      status: 'PENDING',
      paidAt: null,
      createdAt: new Date().toISOString()
    };
    this.commissions.push(commission);
    return commission;
  }

  async listCommissionsByAgent(agentId) {
    return this.commissions.filter(c => c.agentId === agentId);
  }


  /* ---- bookings ---- */
  async createBooking(data) {
    const booking = {
      id: uuidv4(),
      bookingRef: data.bookingRef,
      packageId: data.packageId,
      packageTitle: data.packageTitle,
      applicantName: data.applicantName,
      email: data.email,
      phone: data.phone,
      passport: data.passport || '',
      amountCurrency: data.amountCurrency || 'KES',
      amountTotal: data.amountTotal,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.bookings.push(booking);
    return booking;
  }

  async getBooking(id) {
    return this.bookings.find(b => b.id === id) || null;
  }

  async getBookingByRef(ref) {
    return this.bookings.find(b => b.bookingRef === ref) || null;
  }

  async updateBooking(id, patch) {
    const b = this.bookings.find(x => x.id === id);
    if (!b) return null;
    Object.assign(b, patch, { updatedAt: new Date().toISOString() });
    return b;
  }

  /* ---- payments ---- */
  async createPayment(data) {
    const payment = {
      id: uuidv4(),
      bookingId: data.bookingId,
      paymentMethod: data.paymentMethod,
      provider: data.provider || '',
      amount: data.amount,
      currency: data.currency || 'KES',
      status: data.status || 'PENDING',
      providerRef: data.providerRef || '',
      paymentUrl: data.paymentUrl || '',
      idempotencyKey: data.idempotencyKey || uuidv4(),
      failureReason: '',
      paidAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.payments.push(payment);
    return payment;
  }

  async getPayment(id) {
    return this.payments.find(p => p.id === id) || null;
  }

  async getPaymentByProviderRef(ref) {
    return this.payments.find(p => p.providerRef === ref) || null;
  }

  async listPaymentsByBooking(bookingId) {
    return this.payments.filter(p => p.bookingId === bookingId);
  }

  async updatePayment(id, patch) {
    const p = this.payments.find(x => x.id === id);
    if (!p) return null;
    Object.assign(p, patch, { updatedAt: new Date().toISOString() });
    return p;
  }

  /* ---- transactions (audit) ---- */
  async addTransaction(data) {
    const tx = {
      id: uuidv4(),
      paymentId: data.paymentId,
      transactionType: data.transactionType || 'status_change',
      amount: data.amount || 0,
      currency: data.currency || 'KES',
      providerTxnId: data.providerTxnId || '',
      status: data.status,
      rawResponse: data.rawResponse || null,
      actor: data.actor || 'system',
      createdAt: new Date().toISOString()
    };
    this.transactions.push(tx);
    return tx;
  }

  async listTransactionsByPayment(paymentId) {
    return this.transactions.filter(t => t.paymentId === paymentId);
  }

  /* ---- PesaLink instructions ---- */
  async createPesalinkInstruction(data) {
    const item = {
      id: uuidv4(),
      paymentId: data.paymentId,
      bankName: data.bankName,
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      branch: data.branch || '',
      swiftCode: data.swiftCode || '',
      amountDue: data.amountDue,
      senderName: data.senderName || '',
      senderBank: data.senderBank || '',
      senderPhone: data.senderPhone || '',
      transferredAt: null,
      transactionRef: data.transactionRef || '',
      staffConfirmedBy: '',
      staffConfirmedAt: null,
      status: data.status || 'AWAITING_CONFIRMATION',
      createdAt: new Date().toISOString()
    };
    this.pesalinkInstructions.push(item);
    return item;
  }

  async getPesalinkInstruction(id) {
    return this.pesalinkInstructions.find(i => i.id === id) || null;
  }

  async getPesalinkInstructionByPayment(paymentId) {
    return this.pesalinkInstructions.find(i => i.paymentId === paymentId) || null;
  }

  async updatePesalinkInstruction(id, patch) {
    const item = this.pesalinkInstructions.find(x => x.id === id);
    if (!item) return null;
    Object.assign(item, patch);
    return item;
  }

  /* ---- Western Union verifications ---- */
  async createWuVerification(data) {
    const item = {
      id: uuidv4(),
      paymentId: data.paymentId,
      mtcn: data.mtcn,
      senderName: data.senderName,
      senderCountry: data.senderCountry || '',
      sendAmount: data.sendAmount || 0,
      sendCurrency: data.sendCurrency || 'USD',
      payoutCurrency: data.payoutCurrency || 'KES',
      payoutAmount: data.payoutAmount || 0,
      verificationStatus: 'PENDING',
      wuApiTxnId: '',
      verifiedAt: null,
      rejectedReason: '',
      createdAt: new Date().toISOString()
    };
    this.wuVerifications.push(item);
    return item;
  }

  async getWuVerification(id) {
    return this.wuVerifications.find(v => v.id === id) || null;
  }

  async getWuVerificationByMTCN(mtcn) {
    return this.wuVerifications.find(v => v.mtcn === mtcn) || null;
  }

  async updateWuVerification(id, patch) {
    const item = this.wuVerifications.find(x => x.id === id);
    if (!item) return null;
    Object.assign(item, patch);
    return item;
  }

  /* ---- webhook audit ---- */
  async createWebhookEvent(data) {
    const evt = {
      id: uuidv4(),
      provider: data.provider,
      eventType: data.eventType,
      eventId: data.eventId,
      payload: data.payload,
      signatureOk: data.signatureOk !== undefined ? data.signatureOk : null,
      processed: !!data.processed,
      receivedAt: new Date().toISOString()
    };
    this.webhookEvents.push(evt);
    return evt;
  }

  async getWebhookEventByEventId(eventId) {
    return this.webhookEvents.find(e => e.eventId === eventId) || null;
  }

  async markWebhookProcessed(id) {
    const evt = this.webhookEvents.find(x => x.id === id);
    if (evt) evt.processed = true;
    return evt;
  }
}

/* ==============================================
 * POSTGRESQL STORE (when DB_ENABLED=true)
 * ============================================== */
class PostgresStore {
  constructor(pool) {
    this.pool = pool;
  }

  async _query(text, params) {
    const { rows } = await this.pool.query(text, params);
    return rows;
  }

  async createBooking(data) {
    const rows = await this._query(`
      INSERT INTO bookings (booking_ref, package_id, package_title, applicant_name,
                            email, phone, passport, amount_currency, amount_total, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'PENDING')
      RETURNING id, booking_ref AS "bookingRef", package_id AS "packageId",
                package_title AS "packageTitle", applicant_name AS "applicantName",
                email, phone, passport, amount_currency AS "amountCurrency",
                amount_total AS "amountTotal", status,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `, [data.bookingRef, data.packageId, data.packageTitle, data.applicantName,
        data.email, data.phone, data.passport || '', data.amountCurrency || 'KES', data.amountTotal]);
    return rows[0];
  }

  async getBooking(id) {
    const rows = await this._query(`
      SELECT id, booking_ref AS "bookingRef", package_id AS "packageId",
             package_title AS "packageTitle", applicant_name AS "applicantName",
             email, phone, passport, amount_currency AS "amountCurrency",
             amount_total AS "amountTotal", status,
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM bookings WHERE id = $1
    `, [id]);
    return rows[0] || null;
  }

  async getBookingByRef(ref) {
    const rows = await this._query(
      `SELECT id, booking_ref AS "bookingRef", package_id AS "packageId",
              package_title AS "packageTitle", applicant_name AS "applicantName",
              email, phone, passport, amount_currency AS "amountCurrency",
              amount_total AS "amountTotal", status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM bookings WHERE booking_ref = $1`, [ref]);
    return rows[0] || null;
  }

  async updateBooking(id, patch) {
    const allowed = ['status'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(patch[key]);
      }
    });
    setClauses.push(`updated_at = now()`);
    params.push(id);
    const rows = await this._query(
      `UPDATE bookings SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING id, status, updated_at AS "updatedAt"`, params);
    return rows[0] || null;
  }

  async createPayment(data) {
    const rows = await this._query(`
      INSERT INTO payments (booking_id, payment_method, provider, amount, currency,
                            status, provider_ref, payment_url, idempotency_key)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, booking_id AS "bookingId", payment_method AS "paymentMethod",
                provider, amount, currency, status, provider_ref AS "providerRef",
                payment_url AS "paymentUrl", idempotency_key AS "idempotencyKey",
                failure_reason AS "failureReason", paid_at AS "paidAt",
                created_at AS "createdAt", updated_at AS "updatedAt"
    `, [data.bookingId, data.paymentMethod, data.provider || '', data.amount,
        data.currency || 'KES', data.status || 'PENDING', data.providerRef || '',
        data.paymentUrl || '', data.idempotencyKey || uuidv4()]);
    return rows[0];
  }

  async getPayment(id) {
    const rows = await this._query(`
      SELECT id, booking_id AS "bookingId", payment_method AS "paymentMethod",
             provider, amount, currency, status, provider_ref AS "providerRef",
             payment_url AS "paymentUrl", idempotency_key AS "idempotencyKey",
             failure_reason AS "failureReason", paid_at AS "paidAt",
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM payments WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async getPaymentByProviderRef(ref) {
    const rows = await this._query(
      `SELECT id, booking_id AS "bookingId", payment_method AS "paymentMethod",
              provider, amount, currency, status, provider_ref AS "providerRef",
              payment_url AS "paymentUrl", idempotency_key AS "idempotencyKey",
              failure_reason AS "failureReason", paid_at AS "paidAt",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM payments WHERE provider_ref = $1`, [ref]);
    return rows[0] || null;
  }

  async listPaymentsByBooking(bookingId) {
    return this._query(
      `SELECT id, booking_id AS "bookingId", payment_method AS "paymentMethod",
              provider, amount, currency, status, provider_ref AS "providerRef",
              payment_url AS "paymentUrl", idempotency_key AS "idempotencyKey",
              failure_reason AS "failureReason", paid_at AS "paidAt",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM payments WHERE booking_id = $1 ORDER BY created_at`, [bookingId]);
  }

  async updatePayment(id, patch) {
    const allowed = ['status', 'providerRef', 'paymentUrl', 'failureReason', 'paidAt'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(patch[key]);
      }
    });
    if (setClauses.length === 0) return this.getPayment(id);
    setClauses.push(`updated_at = now()`);
    params.push(id);
    const rows = await this._query(
      `UPDATE payments SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING id, status, provider_ref AS "providerRef", payment_url AS "paymentUrl",
                 failure_reason AS "failureReason", paid_at AS "paidAt",
                 updated_at AS "updatedAt"`, params);
    return rows[0] || null;
  }

  async addTransaction(data) {
    const rows = await this._query(`
      INSERT INTO payment_transactions (payment_id, transaction_type, amount, currency,
                                        provider_txn_id, status, raw_response, actor)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [data.paymentId, data.transactionType || 'status_change', data.amount || 0,
        data.currency || 'KES', data.providerTxnId || '', data.status,
        data.rawResponse ? JSON.stringify(data.rawResponse) : null, data.actor || 'system']);
    return rows[0];
  }

  async listTransactionsByPayment(paymentId) {
    return this._query(
      `SELECT * FROM payment_transactions WHERE payment_id = $1 ORDER BY created_at`, [paymentId]);
  }

  async createPesalinkInstruction(data) {
    const rows = await this._query(`
      INSERT INTO pesalink_instructions (payment_id, bank_name, account_name, account_number,
                                         branch, swift_code, amount_due, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [data.paymentId, data.bankName, data.accountName, data.accountNumber,
        data.branch || '', data.swiftCode || '', data.amountDue, data.status || 'AWAITING_CONFIRMATION']);
    return rows[0];
  }

  async getPesalinkInstruction(id) {
    const rows = await this._query(`SELECT * FROM pesalink_instructions WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async getPesalinkInstructionByPayment(paymentId) {
    const rows = await this._query(`SELECT * FROM pesalink_instructions WHERE payment_id = $1`, [paymentId]);
    return rows[0] || null;
  }

  async updatePesalinkInstruction(id, patch) {
    const allowed = ['senderName', 'senderBank', 'senderPhone', 'transferredAt', 'transactionRef', 'status'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(patch[key]);
      }
    });
    if (setClauses.length === 0) return this.getPesalinkInstruction(id);
    params.push(id);
    const rows = await this._query(
      `UPDATE pesalink_instructions SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING *`, params);
    return rows[0] || null;
  }

  async createWuVerification(data) {
    const rows = await this._query(`
      INSERT INTO western_union_verifications (payment_id, mtcn, sender_name, sender_country,
                                               send_amount, send_currency, payout_currency, payout_amount)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [data.paymentId, data.mtcn, data.senderName, data.senderCountry || '',
        data.sendAmount || 0, data.sendCurrency || 'USD', data.payoutCurrency || 'KES', data.payoutAmount || 0]);
    return rows[0];
  }

  async getWuVerification(id) {
    const rows = await this._query(`SELECT * FROM western_union_verifications WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async getWuVerificationByMTCN(mtcn) {
    const rows = await this._query(`SELECT * FROM western_union_verifications WHERE mtcn = $1`, [mtcn]);
    return rows[0] || null;
  }

  async updateWuVerification(id, patch) {
    const allowed = ['verificationStatus', 'wuApiTxnId', 'verifiedAt', 'rejectedReason'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(patch[key]);
      }
    });
    if (setClauses.length === 0) return this.getWuVerification(id);
    params.push(id);
    const rows = await this._query(
      `UPDATE western_union_verifications SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING *`, params);
    return rows[0] || null;
  }

  async createWebhookEvent(data) {
    const rows = await this._query(`
      INSERT INTO webhook_events (provider, event_type, event_id, payload, signature_ok, processed)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *
    `, [data.provider, data.eventType, data.eventId, JSON.stringify(data.payload),
        data.signatureOk !== undefined ? data.signatureOk : null, !!data.processed]);
    return rows[0];
  }

  async getWebhookEventByEventId(eventId) {
    const rows = await this._query(`SELECT * FROM webhook_events WHERE event_id = $1`, [eventId]);
    return rows[0] || null;
  }

  async markWebhookProcessed(id) {
    const rows = await this._query(`UPDATE webhook_events SET processed = TRUE WHERE id = $1 RETURNING *`, [id]);
    return rows[0] || null;
  }

  /* ---- jobs (postgres) ---- */
  async createJob(data) {
    const rows = await this._query(`
      INSERT INTO jobs (title, country, flag, city, type, salary, description, requirements, application_link, active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, title, country, flag, city, type, salary, description,
                requirements, application_link AS "applicationLink", active,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `, [data.title, data.country, data.flag || '', data.city || '', data.type || '',
        data.salary || '', data.description, JSON.stringify(data.requirements || []),
        data.applicationLink || '', data.active !== undefined ? data.active : true]);
    return rows[0];
  }

  async listJobs(activeOnly = true) {
    return this._query(
      `SELECT id, title, country, flag, city, type, salary, description,
              requirements, application_link AS "applicationLink", active,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM jobs ${activeOnly ? 'WHERE active = TRUE' : ''} ORDER BY created_at DESC`);
  }

  async getJob(id) {
    const rows = await this._query(
      `SELECT id, title, country, flag, city, type, salary, description,
              requirements, application_link AS "applicationLink", active,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM jobs WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async updateJob(id, patch) {
    const allowed = ['title', 'country', 'flag', 'city', 'type', 'salary', 'description', 'requirements', 'applicationLink', 'active'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(key === 'requirements' ? JSON.stringify(patch[key]) : patch[key]);
      }
    });
    if (setClauses.length === 0) return this.getJob(id);
    setClauses.push(`updated_at = now()`);
    params.push(id);
    const rows = await this._query(
      `UPDATE jobs SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING id, title, country, flag, city, type, salary, description,
                 requirements, application_link AS "applicationLink", active,
                 updated_at AS "updatedAt"`, params);
    return rows[0] || null;
  }

  async deleteJob(id) {
    const rows = await this._query(`DELETE FROM jobs WHERE id = $1 RETURNING id`, [id]);
    return rows[0] || null;
  }

  /* ---- agents (postgres) ---- */
  async createAgent(data) {
    const rows = await this._query(`
      INSERT INTO agents (agency_name, registration_number, contact_person_name, contact_person_email,
                          phone, country_operation, specializations, monthly_candidates, password_hash, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'PENDING')
      RETURNING id, agency_name AS "agencyName", registration_number AS "registrationNumber",
                contact_person_name AS "contactPersonName", contact_person_email AS "contactPersonEmail",
                phone, country_operation AS "countryOperation", specializations,
                monthly_candidates AS "monthlyCandidates", status,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `, [data.agencyName, data.registrationNumber, data.contactPersonName, data.contactPersonEmail,
        data.phone, data.countryOperation, JSON.stringify(data.specializations || []),
        data.monthlyCandidates || 0, data.passwordHash]);
    return rows[0];
  }

  async getAgent(id) {
    const rows = await this._query(
      `SELECT id, agency_name AS "agencyName", registration_number AS "registrationNumber",
              contact_person_name AS "contactPersonName", contact_person_email AS "contactPersonEmail",
              phone, country_operation AS "countryOperation", specializations,
              monthly_candidates AS "monthlyCandidates", status, approved_at AS "approvedAt",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM agents WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async getAgentByEmail(email) {
    const rows = await this._query(
      `SELECT id, agency_name AS "agencyName", registration_number AS "registrationNumber",
              contact_person_name AS "contactPersonName", contact_person_email AS "contactPersonEmail",
              phone, country_operation AS "countryOperation", specializations,
              monthly_candidates AS "monthlyCandidates", status, approved_at AS "approvedAt",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM agents WHERE lower(contact_person_email) = lower($1)`, [email]);
    return rows[0] || null;
  }

  async listAgents() {
    return this._query(
      `SELECT id, agency_name AS "agencyName", registration_number AS "registrationNumber",
              contact_person_name AS "contactPersonName", contact_person_email AS "contactPersonEmail",
              phone, country_operation AS "countryOperation", specializations,
              monthly_candidates AS "monthlyCandidates", status, approved_at AS "approvedAt",
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM agents ORDER BY created_at DESC`);
  }

  async updateAgent(id, patch) {
    const allowed = ['status', 'approvedAt'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(patch[key]);
      }
    });
    if (setClauses.length === 0) return this.getAgent(id);
    setClauses.push(`updated_at = now()`);
    params.push(id);
    const rows = await this._query(
      `UPDATE agents SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING id, status, approved_at AS "approvedAt", updated_at AS "updatedAt"`, params);
    return rows[0] || null;
  }

  /* ---- candidates (postgres) ---- */
  async createCandidate(data) {
    const rows = await this._query(`
      INSERT INTO candidates (agent_id, candidate_name, candidate_email, candidate_phone,
                              country_interest, visa_type, cv_filename, notes, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'SUBMITTED')
      RETURNING id, agent_id AS "agentId", candidate_name AS "candidateName",
                candidate_email AS "candidateEmail", candidate_phone AS "candidatePhone",
                country_interest AS "countryInterest", visa_type AS "visaType",
                cv_filename AS "cvFilename", notes, status,
                created_at AS "createdAt", updated_at AS "updatedAt"
    `, [data.agentId, data.candidateName, data.candidateEmail, data.candidatePhone,
        data.countryInterest, data.visaType, data.cvFilename || '', data.notes || '']);
    return rows[0];
  }

  async getCandidate(id) {
    const rows = await this._query(
      `SELECT id, agent_id AS "agentId", candidate_name AS "candidateName",
              candidate_email AS "candidateEmail", candidate_phone AS "candidatePhone",
              country_interest AS "countryInterest", visa_type AS "visaType",
              cv_filename AS "cvFilename", notes, status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM candidates WHERE id = $1`, [id]);
    return rows[0] || null;
  }

  async listCandidatesByAgent(agentId) {
    return this._query(
      `SELECT id, agent_id AS "agentId", candidate_name AS "candidateName",
              candidate_email AS "candidateEmail", candidate_phone AS "candidatePhone",
              country_interest AS "countryInterest", visa_type AS "visaType",
              cv_filename AS "cvFilename", notes, status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM candidates WHERE agent_id = $1 ORDER BY created_at DESC`, [agentId]);
  }

  async listAllCandidates() {
    return this._query(
      `SELECT id, agent_id AS "agentId", candidate_name AS "candidateName",
              candidate_email AS "candidateEmail", candidate_phone AS "candidatePhone",
              country_interest AS "countryInterest", visa_type AS "visaType",
              cv_filename AS "cvFilename", notes, status,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM candidates ORDER BY created_at DESC`);
  }

  async updateCandidate(id, patch) {
    const allowed = ['status', 'cvFilename'];
    const setClauses = [];
    const params = [];
    allowed.forEach((key, idx) => {
      if (patch[key] !== undefined) {
        setClauses.push(`${this._snake(key)} = $${params.length + 1}`);
        params.push(patch[key]);
      }
    });
    if (setClauses.length === 0) return this.getCandidate(id);
    setClauses.push(`updated_at = now()`);
    params.push(id);
    const rows = await this._query(
      `UPDATE candidates SET ${setClauses.join(', ')} WHERE id = $${params.length}
       RETURNING id, status, cv_filename AS "cvFilename", updated_at AS "updatedAt"`, params);
    return rows[0] || null;
  }

  /* ---- commissions (postgres) ---- */
  async createCommission(data) {
    const rows = await this._query(`
      INSERT INTO agent_commissions (agent_id, candidate_id, amount, currency, status)
      VALUES ($1,$2,$3,$4,'PENDING')
      RETURNING id, agent_id AS "agentId", candidate_id AS "candidateId",
                amount, currency, status, paid_at AS "paidAt", created_at AS "createdAt"
    `, [data.agentId, data.candidateId || null, data.amount || 0, data.currency || 'USD']);
    return rows[0];
  }

  async listCommissionsByAgent(agentId) {
    return this._query(
      `SELECT id, agent_id AS "agentId", candidate_id AS "candidateId",
              amount, currency, status, paid_at AS "paidAt", created_at AS "createdAt"
       FROM agent_commissions WHERE agent_id = $1 ORDER BY created_at DESC`, [agentId]);
  }

  _snake(camel) {
    return camel.replace(/([A-Z])/g, '_$1').toLowerCase();
  }
}

/* ==============================================
 * STORE FACTORY
 * ============================================== */
let _pool = null;
let _store = null;

async function initStore() {
  if (_store) return _store;

  if (config.database.enabled) {
    const { Pool } = require('pg');
    _pool = new Pool({ connectionString: config.database.url });
    _store = new PostgresStore(_pool);
  } else {
    _store = new MemoryStore();
  }
  return _store;
}

async function getStore() {
  if (!_store) await initStore();
  return _store;
}

async function closeStore() {
  if (_pool) await _pool.end();
  _pool = null;
  _store = null;
}

module.exports = { initStore, getStore, closeStore, MemoryStore, PostgresStore };
