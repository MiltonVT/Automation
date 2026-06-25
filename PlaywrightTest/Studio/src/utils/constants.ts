/**
 * Environment-driven constants for the test suite.
 *
 * All sensitive values are loaded from environment variables (.env).
 * Fallback defaults are ONLY for non-sensitive config.
 * Credentials MUST be set via .env — missing values throw at import time.
 */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ── Helpers ──────────────────────────────────────────────────────────
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. Set it in your .env file.`);
  }
  return value;
}

// ── URLs ─────────────────────────────────────────────────────────────
export const URLS = {
  STUDIO_ALFA: process.env.STUDIO_URL || 'https://studio.alfa.envs.veritran.com/',
} as const;

// ── Credentials (required from .env) ─────────────────────────────────
export const CREDENTIALS = {
  USERNAME: requireEnv('STUDIO_USERNAME'),
  PASSWORD: requireEnv('STUDIO_PASSWORD'),
} as const;

// ── Application config ───────────────────────────────────────────────
export const APPLICATION = {
  NAME: process.env.APP_NAME || 'ALPHA_EASY_VT_SERVICESS',
  BRANCH: process.env.BRANCH || 'main',
} as const;

// ── Timeouts (ms) ────────────────────────────────────────────────────
export const TIMEOUTS = {
  NAVIGATION: 180_000,
  ELEMENT_WAIT: 60_000,
  APP_LOAD: 120_000,
  MEDIUM_WAIT: 15_000,
  LONG_WAIT: 30_000,
  SHORT_WAIT: 5_000,
  MICRO_WAIT: 1_000
} as const;

// ── Static test data ─────────────────────────────────────────────────
export const TEST_DATA = {
  EXPECTED_TITLE: 'Studio',
} as const;
