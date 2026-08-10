/**
 * Pascal Travels & Tour — Payment Server
 * ======================================
 * Express server that:
 *  - Serves the static frontend (../www)
 *  - Exposes the payment API (/api/payments)
 *  - Receives provider webhooks (/api/webhooks)
 *
 * Run:  npm install && npm start
 * Demo: PESALINK_PROVIDER=none WU_MODE=mock (defaults) — manual DIB + mock WU.
 */

'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { initStore } = require('./store');

const app = express();

/* ---- Security middleware ---- */
app.use(helmet({
  contentSecurityPolicy: false, // static site uses inline scripts/styles
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

/* ---- CORS (allow the static site origin) ---- */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && config.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Idempotency-Key');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---- Logging ---- */
if (config.nodeEnv !== 'test') app.use(morgan('dev'));

/* ---- JSON body parsing (for API routes) ---- */
app.use(express.json({ limit: '1mb' }));

/* ---- Health check ---- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* ---- Payment API routes ---- */
app.use('/api/webhooks', require('./routes/webhooks'));
app.use('/api/payments', require('./routes/payments'));

/* ---- Jobs & Agents API routes ---- */
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/agents', require('./routes/agents'));

/* ---- Static frontend (if files exist) ---- */
// The frontend (index.html, app.js, style.css) lives in the parent of /server.
const staticDir = path.join(__dirname, '..');
app.use(express.static(staticDir));

/* ---- API 404 ---- */
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/* ---- Central error handler ---- */
app.use((err, req, res, next) => {
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message
  });
});

/* ---- Start ---- */
async function start() {
  try {
    await initStore();
    app.listen(config.port, () => {
      console.log(`\n🚀 Pascal Travels payment server running on http://localhost:${config.port}`);
      console.log(`   PesaLink provider: ${config.pesalink.provider} (or 'none' = manual DIB details)`);
      console.log(`   Western Union mode: ${config.westernUnion.mode}`);
      console.log(`   Static frontend: ${staticDir}`);
      console.log(`   Health: http://localhost:${config.port}/api/health\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

/* Graceful shutdown */
process.on('SIGINT', async () => {
  const { closeStore } = require('./store');
  await closeStore();
  process.exit(0);
});

if (require.main === module) {
  start();
}

module.exports = app;
