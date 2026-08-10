/**
 * Agents API Routes
 * ==================
 * REST endpoints for the Agent Registration Portal.
 *
 * Endpoints:
 *   POST /api/agents/register           — register a new agent (PENDING)
 *   POST /api/agents/login              — login agent by email + password
 *   GET  /api/agents/:id                — get agent profile
 *   GET  /api/agents/:id/candidates     — list agent's submitted candidates
 *   POST /api/agents/:id/candidates     — submit a new candidate
 *   GET  /api/agents/:id/commissions    — list agent's commissions
 *   GET  /api/agents                    — list all agents (admin)
 *   PUT  /api/agents/:id/status         — approve/reject agent (admin)
 */

'use strict';

const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { getStore } = require('../store');

/* ==============================================
 * Helper: hash password (demo-grade, salt included)
 * In production, use bcrypt/argon2.
 * ============================================== */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(String(password), salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.pbkdf2Sync(String(password), salt, 1000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
}

/* ==============================================
 * POST /api/agents/register
 * ============================================== */
router.post('/register', async (req, res, next) => {
  try {
    const {
      agencyName, registrationNumber, contactPersonName, contactPersonEmail,
      phone, countryOperation, specializations, monthlyCandidates, password
    } = req.body || {};

    // ---- Server-side validation ----
    const required = ['agencyName', 'registrationNumber', 'contactPersonName', 'contactPersonEmail', 'phone', 'countryOperation', 'password'];
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    if (!/^[^\s@.][^\s@]*@[^\s@.][^\s@]*\.[^\s@.]{2,}$/.test(String(contactPersonEmail))) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const store = await getStore();
    const existing = await store.getAgentByEmail(contactPersonEmail);
    if (existing) {
      return res.status(409).json({ error: 'An agent with this email is already registered' });
    }

    const agent = await store.createAgent({
      agencyName,
      registrationNumber,
      contactPersonName,
      contactPersonEmail,
      phone,
      countryOperation,
      specializations: Array.isArray(specializations) ? specializations : [],
      monthlyCandidates: Number(monthlyCandidates) || 0,
      passwordHash: hashPassword(password)
    });

    res.status(201).json({
      message: 'Registration received. Our team will review and approve your account shortly.',
      agent: publicAgent(agent)
    });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/agents/login
 * ============================================== */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const store = await getStore();
    const agent = await store.getAgentByEmail(email);
    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!verifyPassword(password, agent.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (agent.status === 'PENDING') {
      return res.status(403).json({ error: 'Your account is pending approval. Please check back shortly.' });
    }
    if (agent.status === 'REJECTED') {
      return res.status(403).json({ error: 'Your application was not approved. Contact us for more information.' });
    }
    res.json({ message: 'Login successful', agent: publicAgent(agent) });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/agents/:id — agent profile
 * ============================================== */
router.get('/:id', async (req, res, next) => {
  try {
    const store = await getStore();
    const agent = await store.getAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json({ agent: publicAgent(agent) });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/agents/:id/candidates
 * ============================================== */
router.get('/:id/candidates', async (req, res, next) => {
  try {
    const store = await getStore();
    const agent = await store.getAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    const candidates = await store.listCandidatesByAgent(req.params.id);
    res.json({ candidates });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/agents/:id/candidates — submit candidate
 * ============================================== */
router.post('/:id/candidates', async (req, res, next) => {
  try {
    const {
      candidateName, candidateEmail, candidatePhone,
      countryInterest, visaType, cvFilename, notes
    } = req.body || {};

    if (!candidateName || !candidateEmail || !candidatePhone || !countryInterest || !visaType) {
      return res.status(400).json({ error: 'Missing required fields: candidateName, candidateEmail, candidatePhone, countryInterest, visaType' });
    }
    if (!/^[^\s@.][^\s@]*@[^\s@.][^\s@]*\.[^\s@.]{2,}$/.test(String(candidateEmail))) {
      return res.status(400).json({ error: 'Invalid candidate email address' });
    }

    const store = await getStore();
    const agent = await store.getAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    if (agent.status !== 'APPROVED') {
      return res.status(403).json({ error: 'Only approved agents can submit candidates' });
    }

    const candidate = await store.createCandidate({
      agentId: agent.id,
      candidateName,
      candidateEmail,
      candidatePhone,
      countryInterest,
      visaType,
      cvFilename: cvFilename || '',
      notes: notes || ''
    });

    res.status(201).json({ message: 'Candidate submitted successfully.', candidate });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/agents/:id/commissions
 * ============================================== */
router.get('/:id/commissions', async (req, res, next) => {
  try {
    const store = await getStore();
    const agent = await store.getAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    const commissions = await store.listCommissionsByAgent(req.params.id);
    res.json({ commissions });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/agents — list all (admin)
 * ============================================== */
router.get('/', async (req, res, next) => {
  try {
    const store = await getStore();
    const agents = await store.listAgents();
    res.json({ agents: agents.map(publicAgent) });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * PUT /api/agents/:id/status — approve/reject (admin)
 * ============================================== */
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'status must be APPROVED, REJECTED, or PENDING' });
    }
    const store = await getStore();
    const agent = await store.getAgent(req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    const patch = { status };
    if (status === 'APPROVED') patch.approvedAt = new Date().toISOString();
    const updated = await store.updateAgent(req.params.id, patch);
    res.json({ message: `Agent ${status.toLowerCase()}`, agent: updated });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * Helper: strip sensitive fields before sending
 * ============================================== */
function publicAgent(agent) {
  if (!agent) return null;
  const { passwordHash, ...safe } = agent;
  return safe;
}

module.exports = router;

