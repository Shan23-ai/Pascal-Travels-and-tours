/**
 * Centralized configuration loader.
 * Loads all environment variables with sane defaults for development.
 */
'use strict';

require('dotenv').config();

const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5500,http://127.0.0.1:5500')
    .split(',').map(s => s.trim()).filter(Boolean),

  // Database
  database: {
    enabled: configBool('DB_ENABLED', false),      // false → in-memory store (demo)
    url: process.env.DATABASE_URL || 'postgres://localhost:5432/pascal_travels'
  },

  // PesaLink aggregator (SasaPay / Cellulant Tingg)
  pesalink: {
    provider: process.env.PESALINK_PROVIDER || 'none', // 'sasapay' | 'tingg' | 'none'
    apiBase: process.env.PESALINK_API_BASE || 'https://sandbox.sasapay.app/api/v1',
    clientId: process.env.PESALINK_CLIENT_ID || '',
    clientSecret: process.env.PESALINK_CLIENT_SECRET || '',
    merchantCode: process.env.PESALINK_MERCHANT_CODE || '',
    webhookSecret: process.env.PESALINK_WEBHOOK_SECRET || ''
  },

  // Manual DIB bank details (fallback when no aggregator configured)
  dib: {
    bankName: process.env.DIB_BANK_NAME || 'Dubai Islamic Bank (Kenya)',
    accountName: process.env.DIB_ACCOUNT_NAME || 'Pascal Travels & Tour Ltd',
    accountNumber: process.env.DIB_ACCOUNT_NUMBER || '0101234567890',
    branch: process.env.DIB_BRANCH || 'Tom Mboya Street Branch, Nairobi',
    swiftCode: process.env.DIB_SWIFT_CODE || 'DIBKKENA',
    pesalinkMerchantId: process.env.DIB_PESALINK_MERCHANT_ID || '178543'
  },

  // Western Union
  westernUnion: {
    mode: process.env.WU_MODE || 'mock',           // 'mock' | 'live'
    apiBase: process.env.WU_API_BASE || 'https://api.westernunion.com',
    clientId: process.env.WU_CLIENT_ID || '',
    clientSecret: process.env.WU_CLIENT_SECRET || '',
    scope: process.env.WU_SCOPE || 'cts-api-branch-payment',
    grantType: process.env.WU_GRANT_TYPE || 'client_credentials',
    certPath: process.env.WU_CERT_PATH || './certs/wu_client_cert.p12',
    certPassphrase: process.env.WU_CERT_PASSPHRASE || '',
    bankId: process.env.WU_BANK_ID || '1221',
    agentId: process.env.WU_AGENT_ID || '99887766',
    agentBranch: process.env.WU_AGENT_BRANCH || 'NAIROBI-001',
    agentCountry: process.env.WU_AGENT_COUNTRY || 'KE',
    agentTerminal: process.env.WU_AGENT_TERMINAL || 'WEB01',
    accountNumber: process.env.WU_ACCOUNT_NUMBER || 'PascalTravelsDoc',
    webhookSecret: process.env.WU_WEBHOOK_SECRET || ''
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    currency: process.env.STRIPE_CURRENCY || 'kes'
  }
};

function configBool(value, def) {
  if (value === undefined || value === null || value === '') return def;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

module.exports = config;
