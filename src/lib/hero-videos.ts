/**
 * Hero & promo video pool — AI-generated videos for event pages.
 * Used when event has no custom hero video. Deterministic per-event selection.
 */

/** All AI-generated videos available for hero backgrounds and promo sections */
export const HERO_VIDEO_POOL = [
  '/videos/9b68ed1f-ef9b-437c-b0bc-642f911e47a3_hd.mp4',
  '/videos/ef69cf27-d084-4bc4-8195-6ec8b55c45c5_hd.mp4',
  '/videos/e756e892-446a-4f46-84d4-33e97a1623cc_hd.mp4',
  '/videos/5968b943-8be8-40bd-89d8-c31111bdc2f7_hd.mp4',
  '/videos/7f764773-107a-460c-ba23-213e0b70decb_hd.mp4',
  '/videos/20146aae-bf4b-4f20-8a0c-a3e88b462414_hd.mp4',
  '/videos/9a915c71-cae9-448d-8dd2-e36da4643b26_hd.mp4',
  '/videos/b1a1baf4-167c-4c23-903b-184954cc4736_hd.mp4',
  '/videos/66d0350c-e46d-4da3-b01a-20a19c60ee47.mp4',
  '/videos/985aff0f-4024-4094-91be-ecb3080bfa8a.mp4',
  '/videos/grok-video-5d066782-0585-48a7-b912-9b81472b0654.mp4',
  '/videos/grok-video-3765cb9e-4e18-4d72-a52a-60777a6af5cf.mp4',
  '/videos/8d0ea574-bdda-47c4-8ce8-e9318d70e7b8_hd.mp4',
  '/videos/19a52e15-e11c-41a2-89ae-6a7949390ff3_hd.mp4',
  '/videos/38bf5980-84f6-41a7-b7a0-843826866b12_hd.mp4',
  '/videos/Bayou_Scene_Video_Generation.mp4',
];

/** Promo videos for hero-sized player or carousel — subset of pool for variety */
export const PROMO_VIDEO_POOL = [...HERO_VIDEO_POOL];

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Get a unique hero video for an event. Deterministic: same event = same video.
 */
export function getUniqueHeroVideoForEvent(topic: string, city: string, slug: string): string {
  const seed = `${topic}|${city}|${slug}`;
  const idx = simpleHash(seed) % HERO_VIDEO_POOL.length;
  return HERO_VIDEO_POOL[idx];
}

/**
 * Get N promo videos for an event (e.g. for carousel or grid). Deterministic per event.
 */
export function getPromoVideosForEvent(topic: string, city: string, slug: string, count = 4): string[] {
  const seed = `${topic}|${city}|${slug}`;
  const h = simpleHash(seed);
  const result: string[] = [];
  const pool = HERO_VIDEO_POOL;
  for (let i = 0; i < count; i++) {
    result.push(pool[(h + i) % pool.length]);
  }
  return result;
}
