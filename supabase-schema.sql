-- Run this in Supabase SQL Editor to create all tables

-- Events table
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
  tracks TEXT[] NOT NULL DEFAULT '{}',
  speakers JSONB[] NOT NULL DEFAULT '{}',
  schedule JSONB[] NOT NULL DEFAULT '{}',
  pricing JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  tagline TEXT,
  topic_key TEXT,
  organizer_email TEXT,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('draft', 'live', 'sold_out', 'past')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for slug lookups (public event pages)
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read live events
CREATE POLICY "Public can view live events" ON events
  FOR SELECT USING (status = 'live');

-- Service role can do everything (API routes use service key)
CREATE POLICY "Service role full access" ON events
  FOR ALL USING (true) WITH CHECK (true);

-- Tickets table (for future Stripe integration)
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('early_bird', 'regular', 'vip')),
  stripe_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tickets_event ON tickets(event_id);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access tickets" ON tickets
  FOR ALL USING (true) WITH CHECK (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Affiliates table (influencer distribution)
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC to record affiliate conversions (creates affiliate on first conversion)
CREATE OR REPLACE FUNCTION increment_conversion(refcode TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO affiliates (id, code, clicks, conversions)
  VALUES (gen_random_uuid(), refcode, 0, 1)
  ON CONFLICT (code) DO UPDATE SET conversions = affiliates.conversions + 1;
END;
$$;
