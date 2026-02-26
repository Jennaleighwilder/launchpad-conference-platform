-- Hero media columns: every event MUST have its own unique hero asset.
-- Run in Supabase SQL Editor after initial schema.
--
-- Also create Storage bucket for uploads:
--   Supabase Dashboard → Storage → New bucket → name: event-media, Public: yes

ALTER TABLE events
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS hero_video_url TEXT,
ADD COLUMN IF NOT EXISTS hero_media_type TEXT DEFAULT 'image';

-- hero_media_type: 'image' | 'video' | 'none'
COMMENT ON COLUMN events.hero_image_url IS 'Unique hero image URL per event. No reuse across events.';
COMMENT ON COLUMN events.hero_video_url IS 'Optional hero video URL (mp4). Takes precedence over hero_image_url when set.';
COMMENT ON COLUMN events.hero_media_type IS 'image | video | none';
