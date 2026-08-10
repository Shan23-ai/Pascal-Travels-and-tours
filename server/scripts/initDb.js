/**
 * Database initialization script.
 * Reads server/db/schema.sql and executes it against the configured Postgres.
 *
 * Usage: DB_ENABLED=true DATABASE_URL=postgres://... node scripts/initDb.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('../config');

async function initDb() {
  if (!config.database.enabled) {
    console.log('DB_ENABLED is false — using in-memory store. No DB init needed.');
    return;
  }

  const pool = new Pool({ connectionString: config.database.url });
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('Initializing database schema...');
  try {
    await pool.query(schema);
    console.log('✅ Database schema applied successfully.');
  } catch (err) {
    console.error('❌ Failed to apply schema:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDb();
