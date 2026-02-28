# Supabase Migrations — Run in SQL Editor

Run these in order in **Supabase Dashboard → SQL Editor**.  
Project: https://zqtnmznyyzjstmtqcscv.supabase.co

---

## Migration 1: Events and Affiliates

```sql
-- Events table (matches existing EventData structure)
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text,
  topic text,
  city text,
  date text,
  capacity int default 500,
  budget text,
  vibe text,
  venue jsonb,
  tracks jsonb default '[]',
  speakers jsonb default '[]',
  schedule jsonb default '[]',
  pricing jsonb,
  description text,
  tagline text,
  topic_key text,
  status text default 'live',
  created_at timestamp default now()
);

-- Affiliates table for influencer distribution
create table if not exists affiliates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  clicks int default 0,
  conversions int default 0,
  created_at timestamp default now()
);

-- RPC to record conversions (creates affiliate if first conversion)
create or replace function increment_conversion(refcode text)
returns void
language plpgsql
as $$
begin
  insert into affiliates (id, code, clicks, conversions)
  values (gen_random_uuid(), refcode, 0, 1)
  on conflict (code) do update set conversions = affiliates.conversions + 1;
end;
$$;
```

---

## Migration 2: Event Lifecycle

```sql
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

-- 5. Update status: lifecycle values
DO $$
BEGIN
  ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE events ADD CONSTRAINT events_status_check 
  CHECK (status IN ('draft', 'planning', 'announcing', 'ticket_sales', 'live', 'completed', 'sold_out', 'past'));

ALTER TABLE events ALTER COLUMN status SET DEFAULT 'draft';

-- 6. Lifecycle automation log
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

-- 7. Update RLS
DROP POLICY IF EXISTS "Public can view live events" ON events;
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
```

---

## Migration 3: Attendees and Check-in

```sql
create table if not exists attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  email text not null,
  name text,
  ticket_type text not null default 'regular',
  stripe_session_id text,
  stripe_payment_intent_id text,
  payment_status text not null default 'pending',
  checkin_status text not null default 'not_checked_in',
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists attendees_event_id_idx on attendees(event_id);
create index if not exists attendees_email_idx on attendees(email);
create unique index if not exists attendees_unique_event_email on attendees(event_id, email);
```

---

## Migration 4: Hero Assets and Event Blocks

```sql
create table if not exists hero_assets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid unique not null references events(id) on delete cascade,
  image_url text,
  video_url text,
  provider text not null default 'fallback',
  provider_asset_id text,
  created_at timestamptz default now()
);

create unique index if not exists hero_assets_provider_asset_id_unique
  on hero_assets(provider_asset_id)
  where provider_asset_id is not null;

create index if not exists hero_assets_event_id_idx on hero_assets(event_id);

create table if not exists event_blocks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  sort_order int not null default 0,
  type text not null check (type in ('text', 'image', 'video', 'gallery', 'cta')),
  data jsonb not null default '{}',
  created_at timestamptz default now()
);

create index if not exists event_blocks_event_sort_idx on event_blocks(event_id, sort_order);

alter table events add column if not exists hero_asset_id uuid references hero_assets(id) on delete set null;

insert into hero_assets (event_id, image_url, video_url, provider)
select e.id, e.hero_image_url, e.hero_video_url, 'fallback'
from events e
where (e.hero_image_url is not null or e.hero_video_url is not null)
  and not exists (select 1 from hero_assets ha where ha.event_id = e.id);

update events e
set hero_asset_id = ha.id
from hero_assets ha
where ha.event_id = e.id and e.hero_asset_id is null;

alter table hero_assets enable row level security;
alter table event_blocks enable row level security;
create policy "Service role full access hero_assets" on hero_assets for all using (true) with check (true);
create policy "Service role full access event_blocks" on event_blocks for all using (true) with check (true);
```

---

## Migration 5: Backfill Missing Heroes

```sql
insert into hero_assets (event_id, image_url, provider)
select e.id,
  'https://picsum.photos/seed/' || replace(e.slug, '-', '') || '/1920/1080',
  'fallback'
from events e
where e.id not in (select event_id from hero_assets);

update events e
set hero_asset_id = ha.id
from hero_assets ha
where ha.event_id = e.id and e.hero_asset_id is null;
```

---

## Migration 6: User ID for Events (Auth)

```sql
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
```

---

## Storage (manual)

Create bucket **event-media** (Public) in Supabase Dashboard → Storage if needed.
