/**
 * Jobs API Routes
 * ================
 * REST endpoints for the jobs board.
 *
 * Endpoints:
 *   GET  /api/jobs              — list active jobs (optionally filter by ?country=)
 *   GET  /api/jobs/all          — list all jobs incl. inactive (admin)
 *   GET  /api/jobs/countries    — distinct countries for filter
 *   GET  /api/jobs/:id          — get one job
 *   POST /api/jobs              — create a job (admin)
 *   PUT  /api/jobs/:id          — update a job (admin)
 *   DELETE /api/jobs/:id        — delete a job (admin)
 *   POST /api/jobs/:id/apply    — quick-apply to a job
 */

'use strict';

const express = require('express');
const router = express.Router();
const { getStore } = require('../store');

/* ==============================================
 * GET /api/jobs — list active jobs (optionally by country)
 * ============================================== */
router.get('/', async (req, res, next) => {
  try {
    const store = await getStore();
    const { country } = req.query;
    let jobs = await store.listJobs(true);
    if (country) {
      const needle = String(country).trim().toLowerCase();
      jobs = jobs.filter(j => String(j.country || '').toLowerCase().includes(needle));
    }
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/jobs/all — all jobs (admin)
 * ============================================== */
router.get('/all', async (req, res, next) => {
  try {
    const store = await getStore();
    const jobs = await store.listJobs(false);
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/jobs/countries — distinct countries
 * ============================================== */
router.get('/countries', async (req, res, next) => {
  try {
    const store = await getStore();
    const jobs = await store.listJobs(true);
    const countries = [...new Set(jobs.map(j => j.country).filter(Boolean))].sort();
    res.json({ countries });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * GET /api/jobs/:id — get one job
 * ============================================== */
router.get('/:id', async (req, res, next) => {
  try {
    const store = await getStore();
    const job = await store.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/jobs — create a job (admin)
 * ============================================== */
router.post('/', async (req, res, next) => {
  try {
    const { title, country, flag, city, type, salary, description, requirements, applicationLink } = req.body || {};
    if (!title || !country || !description) {
      return res.status(400).json({ error: 'Missing required fields: title, country, description' });
    }
    const store = await getStore();
    const job = await store.createJob({
      title, country, flag: flag || '', city: city || '', type: type || '',
      salary: salary || '', description, requirements: requirements || [],
      applicationLink: applicationLink || ''
    });
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * PUT /api/jobs/:id — update a job (admin)
 * ============================================== */
router.put('/:id', async (req, res, next) => {
  try {
    const store = await getStore();
    const existing = await store.getJob(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Job not found' });
    const patch = {};
    ['title', 'country', 'flag', 'city', 'type', 'salary', 'description', 'requirements', 'applicationLink', 'active']
      .forEach(k => { if (req.body[k] !== undefined) patch[k] = req.body[k]; });
    const job = await store.updateJob(req.params.id, patch);
    res.json({ job });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * DELETE /api/jobs/:id — delete a job (admin)
 * ============================================== */
router.delete('/:id', async (req, res, next) => {
  try {
    const store = await getStore();
    const job = await store.deleteJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    next(err);
  }
});

/* ==============================================
 * POST /api/jobs/:id/apply — quick apply
 * ============================================== */
router.post('/:id/apply', async (req, res, next) => {
  try {
    const store = await getStore();
    const job = await store.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const { name, email, phone, message } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    if (!/^[^\s@.][^\s@]*@[^\s@.][^\s@]*\.[^\s@.]{2,}$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // In a full implementation, save applications to an applications table.
    // For now, store in a lightweight in-memory list via the store.
    const application = {
      id: require('uuid').v4(),
      jobId: job.id,
      jobTitle: job.title,
      country: job.country,
      name,
      email,
      phone: phone || '',
      message: message || '',
      createdAt: new Date().toISOString()
    };
    if (!store._applications) store._applications = [];
    store._applications.push(application);

    res.status(201).json({ message: 'Application received. Our team will contact you shortly.', application });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

