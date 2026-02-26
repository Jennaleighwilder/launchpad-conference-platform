/**
 * Relevant hero pipeline: AI → stock search → Picsum fallback.
 * Stores provider_asset_id to enforce no reuse at DB level.
 */

import { getUniqueHeroForEvent } from './hero-images';

export type HeroResult = {
  image_url: string;
  video_url?: null;
  provider: 'ai' | 'unsplash' | 'pexels' | 'upload' | 'fallback';
  provider_asset_id?: string | null;
};

function buildPrompt(event: { name: string; topic: string; city: string; vibe?: string }): string {
  const vibe = event.vibe || 'professional';
  const tone = vibe === 'festival' ? 'vibrant, energetic, colorful' : vibe === 'builder' ? 'tech, modern, dynamic' : 'cinematic, professional, polished';
  return `Create a cinematic conference hero image for:
Title: ${event.name}
Theme: ${event.topic} conference
Location: ${event.city}
Tone: ${tone}, landscape 16:9, no text in image`;
}

/**
 * Try DALL-E 3. Returns null if no key or fails.
 */
async function tryAIGeneration(
  event: { name: string; topic: string; city: string; vibe?: string }
): Promise<HeroResult | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === 'sk-your-key') return null;

  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: key });
    const prompt = buildPrompt(event);
    const res = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    });
    const url = res.data?.[0]?.url;
    if (!url) return null;
    return { image_url: url, provider: 'ai', provider_asset_id: `dalle-${Date.now()}` };
  } catch {
    return null;
  }
}

/**
 * Try Unsplash search. Returns null if no key, fails, or no results.
 * provider_asset_id = photo id for reuse prevention.
 */
async function tryUnsplashSearch(
  event: { name: string; topic: string; city: string },
  usedIds: Set<string>
): Promise<HeroResult | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  const query = `${event.topic} ${event.city} conference`.replace(/\s+/g, ' ').trim();
  if (!query) return null;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: { id: string; urls?: { regular?: string } }[] };
    const results = data.results || [];
    for (const photo of results) {
      if (usedIds.has(photo.id)) continue;
      const url = photo.urls?.regular;
      if (url) return { image_url: `${url}?w=1920&h=1080&fit=crop`, provider: 'unsplash', provider_asset_id: photo.id };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Picsum fallback. No provider_asset_id (Picsum IDs can rotate).
 */
function getPicsumFallback(topic: string, city: string, slug: string): HeroResult {
  const url = getUniqueHeroForEvent(topic, city, slug);
  return { image_url: url, provider: 'fallback', provider_asset_id: null };
}

/**
 * Generate relevant hero for event. Pipeline: AI → Unsplash → Picsum.
 * usedIds: set of provider_asset_ids already in hero_assets (for Unsplash).
 */
export async function generateRelevantHero(
  event: { name: string; topic: string; city: string; slug: string; vibe?: string },
  usedProviderIds: Set<string> = new Set()
): Promise<HeroResult> {
  const ai = await tryAIGeneration(event);
  if (ai) return ai;

  const stock = await tryUnsplashSearch(event, usedProviderIds);
  if (stock) return stock;

  return getPicsumFallback(event.topic, event.city, event.slug);
}
