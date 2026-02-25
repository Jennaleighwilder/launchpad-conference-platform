-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kzfdxrncortatzrfoxbd/sql/new
-- Copy all, paste, click Run.

-- Drop and recreate for clean setup (removes any existing events)
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS events CASCADE;

CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  topic TEXT NOT NULL,
  city TEXT NOT NULL,
  date TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 500,
  budget TEXT NOT NULL DEFAULT 'growth',
  vibe TEXT NOT NULL DEFAULT 'professional',
  venue JSONB NOT NULL DEFAULT '{}',
  tracks JSONB NOT NULL DEFAULT '[]',
  speakers JSONB NOT NULL DEFAULT '[]',
  schedule JSONB NOT NULL DEFAULT '[]',
  pricing JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  tagline TEXT,
  topic_key TEXT,
  organizer_email TEXT,
  status TEXT NOT NULL DEFAULT 'live',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view live events" ON events FOR SELECT USING (status = 'live');
CREATE POLICY "Service role full access" ON events FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  stripe_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION increment_conversion(refcode TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO affiliates (id, code, clicks, conversions)
  VALUES (gen_random_uuid(), refcode, 0, 1)
  ON CONFLICT (code) DO UPDATE SET conversions = affiliates.conversions + 1;
END;
$$;
