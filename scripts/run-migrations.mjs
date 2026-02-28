#!/usr/bin/env node
/**
 * Run Supabase migrations via direct Postgres connection.
 * Requires: DATABASE_URL in env, or we construct from SUPABASE_URL + DB_PASSWORD.
 * 
 * Usage: node scripts/run-migrations.mjs
 * Or: DATABASE_URL="postgresql://..." node scripts/run-migrations.mjs
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '../supabase/migrations');

const REGIONS = ['us-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-1'];

async function getConnection() {
  const url = process.env.DATABASE_URL;
  if (url) {
    return new pg.Client({ connectionString: url });
  }

  const ref = process.env.SUPABASE_PROJECT_REF || 'zqtnmznyyzjstmtqcscv';
  const password = process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD;
  if (!password) {
    throw new Error('Set DATABASE_URL or SUPABASE_DB_PASSWORD');
  }

  for (const region of REGIONS) {
    for (const port of [5432, 6543]) {
      const connStr = `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:${port}/postgres`;
      const client = new pg.Client({ connectionString: connStr, connectionTimeoutMillis: 5000 });
      try {
        await client.connect();
        console.log(`Connected via aws-0-${region}.pooler.supabase.com:${port}`);
        return client;
      } catch (e) {
        if (e.message?.includes('Tenant or user not found')) continue;
        if (e.message?.includes('connect') || e.code === 'ECONNREFUSED' || e.code === 'ETIMEDOUT') continue;
        continue;
      }
    }
  }
  throw new Error('Could not connect to any Supabase pooler region');
}

async function run() {
  const client = await getConnection();
  const files = [
    '001_events_and_affiliates.sql',
    '002_event_lifecycle.sql',
    '003_attendees_and_checkin.sql',
    '004_hero_assets_and_event_blocks.sql',
    '005_backfill_missing_heroes.sql',
    '006_add_user_id_to_events.sql',
  ];

  for (const f of files) {
    const path = join(migrationsDir, f);
    const sql = readFileSync(path, 'utf8');
    console.log(`Running ${f}...`);
    try {
      await client.query(sql);
      console.log(`  ✓ ${f}`);
    } catch (e) {
      console.error(`  ✗ ${f}:`, e.message);
      throw e;
    }
  }

  await client.end();
  console.log('\nAll migrations completed.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
