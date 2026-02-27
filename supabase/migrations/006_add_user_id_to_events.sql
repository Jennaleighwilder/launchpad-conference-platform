-- Add user_id to events for ownership (nullable for existing events)
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
