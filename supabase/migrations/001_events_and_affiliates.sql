-- Events table (matches existing EventData structure)
-- Run in Supabase SQL Editor if your project doesn't have these yet
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
