-- 003_attendees_and_checkin.sql
-- Additive only. No drops. No destructive changes.

create table if not exists attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  email text not null,
  name text,
  ticket_type text not null default 'regular',
  stripe_session_id text,
  stripe_payment_intent_id text,
  payment_status text not null default 'pending', -- pending|paid|refunded|failed
  checkin_status text not null default 'not_checked_in', -- not_checked_in|checked_in
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists attendees_event_id_idx on attendees(event_id);
create index if not exists attendees_email_idx on attendees(email);

-- Prevent duplicate paid attendee records per event per email (adjust if you allow multi-ticket per email)
create unique index if not exists attendees_unique_event_email on attendees(event_id, email);
