-- Minimal: create only lifecycle_log (the engine's memory).
-- Run in Supabase: SQL Editor → + → New query → paste → Run

CREATE TABLE IF NOT EXISTS lifecycle_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL,
  action_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS lifecycle_unique_action
ON lifecycle_log(event_id, action_key, to_status);
