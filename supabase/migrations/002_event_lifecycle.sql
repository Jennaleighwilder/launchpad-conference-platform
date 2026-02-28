-- Event Lifecycle Engine — run in Supabase SQL Editor
-- MAINTENANCE: ADD only. Do not delete or modify existing columns.

-- 1. Add start_date, end_date for lifecycle timing
ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- 1b. Add hero columns (required by 004_hero_assets)
ALTER TABLE events ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS hero_video_url TEXT;

-- 2. Add ai_description, social_announcement_text for planning → announcing
ALTER TABLE events ADD COLUMN IF NOT EXISTS ai_description TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS social_announcement_text TEXT;

-- 3. Speaker invitations (for confirmation tracking)
CREATE TABLE IF NOT EXISTS speaker_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  talk_title TEXT,
  token TEXT UNIQUE NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_speaker_invitations_event ON speaker_invitations(event_id);
CREATE INDEX idx_speaker_invitations_token ON speaker_invitations(token);

-- 4. Add speakers_confirmed_count to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS speakers_confirmed_count INTEGER NOT NULL DEFAULT 0;

-- 5. Update status: lifecycle values (draft, planning, announcing, ticket_sales, live, completed)
-- Drop existing check if present, add new one
DO $$
BEGIN
  ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE events ADD CONSTRAINT events_status_check 
  CHECK (status IN ('draft', 'planning', 'announcing', 'ticket_sales', 'live', 'completed', 'sold_out', 'past'));

ALTER TABLE events ALTER COLUMN status SET DEFAULT 'draft';

-- 6. Lifecycle automation log (for idempotency — don't re-run same action)
CREATE TABLE IF NOT EXISTS lifecycle_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  action_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, action_key)
);

CREATE INDEX idx_lifecycle_log_event ON lifecycle_log(event_id);

-- 7. Update RLS: public can view all events (status shown on page; engine controls transitions)
DROP POLICY IF EXISTS "Public can view live events" ON events;
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
