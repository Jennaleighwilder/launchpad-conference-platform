-- Backfill hero_assets for events that have no hero_assets row.
-- Run this if events created before migration show blank hero sections.
-- Uses Picsum with slug-based seed for unique URLs (no API key).

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
