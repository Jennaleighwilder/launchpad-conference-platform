-- hero_assets: DB-enforced no reuse. One hero per event. provider_asset_id prevents stock reuse.
-- event_blocks: User content beyond hero (text, image, video, gallery, cta).
--
-- Storage: Create bucket "event-media" (Public) in Supabase Dashboard if not exists.

-- hero_assets: 1:1 with events. UNIQUE(event_id). UNIQUE(provider_asset_id) prevents stock reuse.
create table if not exists hero_assets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid unique not null references events(id) on delete cascade,
  image_url text,
  video_url text,
  provider text not null default 'fallback',  -- 'ai' | 'unsplash' | 'pexels' | 'upload' | 'fallback'
  provider_asset_id text,
  created_at timestamptz default now()
);

create unique index if not exists hero_assets_provider_asset_id_unique
  on hero_assets(provider_asset_id)
  where provider_asset_id is not null;

create index if not exists hero_assets_event_id_idx on hero_assets(event_id);

-- event_blocks: User content sections (text, image, video, gallery, cta)
create table if not exists event_blocks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  sort_order int not null default 0,
  type text not null check (type in ('text', 'image', 'video', 'gallery', 'cta')),
  data jsonb not null default '{}',
  created_at timestamptz default now()
);

create index if not exists event_blocks_event_sort_idx on event_blocks(event_id, sort_order);

-- Add hero_asset_id to events. Keep hero_image_url/hero_video_url for backward compat during transition.
alter table events add column if not exists hero_asset_id uuid references hero_assets(id) on delete set null;

-- Migrate existing hero data into hero_assets for events that have hero_image_url or hero_video_url
insert into hero_assets (event_id, image_url, video_url, provider)
select e.id, e.hero_image_url, e.hero_video_url, 'fallback'
from events e
where (e.hero_image_url is not null or e.hero_video_url is not null)
  and not exists (select 1 from hero_assets ha where ha.event_id = e.id);

-- Link events to their hero_assets
update events e
set hero_asset_id = ha.id
from hero_assets ha
where ha.event_id = e.id and e.hero_asset_id is null;

-- RLS for hero_assets and event_blocks (service role bypasses)
alter table hero_assets enable row level security;
alter table event_blocks enable row level security;
create policy "Service role full access hero_assets" on hero_assets for all using (true) with check (true);
create policy "Service role full access event_blocks" on event_blocks for all using (true) with check (true);
