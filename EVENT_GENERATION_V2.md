# Launchpad Event Generation V2

## "Make every generated event feel like it had a $50K design team"

---

## Visual Reference — Target Quality

Generated events should produce **pictures and video** that look like these examples:

### 1. Creative / Surreal (e.g. festivals, experiential events)
- **Reference:** Woman on pink bicycle riding through outer space on a rainbow ring
- **Style:** Dreamlike, fantastical, retro-futuristic, artistic
- **Vibe:** Unique, memorable, not generic stock
- **Use for:** Creative events, festivals, experiential gatherings

### 2. Tech / Futuristic (e.g. AI, conferences, product launches)
- **Reference:** Futuristic outdoor exhibition with data viz screens, glowing displays, sleek metallic surfaces
- **Style:** Clean, modern, high-tech, polished
- **Vibe:** Sophisticated, premium, professional
- **Use for:** Tech events, AI summits, product launches, corporate conferences

**Key principle:** Generated imagery must be **specific** and **impressive** — not generic Unsplash or stock-feeling. Each event should look like it had a creative agency behind it.

---

## Video Pool (Implemented)

All AI-generated videos are now in `src/lib/hero-videos.ts`:

- **HERO_VIDEO_POOL** — 16 videos for hero backgrounds
- **PROMO_VIDEO_POOL** — Same pool for promo sections
- **getUniqueHeroVideoForEvent(topic, city, slug)** — Deterministic selection per event
- **getPromoVideosForEvent(topic, city, slug, count)** — For carousels/grids

Videos are stored in `public/videos/`. New videos: copy to `public/videos/` and add to `HERO_VIDEO_POOL` in `hero-videos.ts`.

---

## Image Generation (Future)

Target styles by event type:

| Event Type | Image Style |
|------------|-------------|
| Tech / AI | Digital art, circuit patterns, futuristic cityscapes, data viz |
| Food | Warm photography, ingredients, table settings |
| Music | Stage lighting, crowd shots, vibrant colors |
| Corporate | Clean architecture, office spaces, professional |
| Academic | Libraries, lecture halls, research imagery |
| Creative / Festival | Surreal, dreamlike, artistic, unique compositions |

---

## Architecture

- **Hero:** Video preferred when available (from pool or custom). Falls back to Ken Burns slideshow.
- **Promo section:** Uses `PROMO_VIDEO_POOL` — all videos playable via `<video>` tags.
- **Event generation:** Assigns `hero_video_url` from pool for every new event.
- **resolveHeroVideo:** Uses pool fallback when event has no custom video.

---

## Reference Assets

- `assets/8a233be4-3857-4d30-a52c-0dba3dc89355-96eb4470-ba97-43b7-a650-e7f3e5b9b248.png` — Surreal space bicycle
- `assets/1a127c02-29e3-411d-951d-859856227d7e-e0a21e01-e54b-4f8c-b36d-a7fec747fd11.png` — Futuristic tech exhibition

---

*Launchpad Conference Platform — Event Generation V2*
*February 2026*
