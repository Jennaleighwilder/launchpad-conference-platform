/**
 * Hero image pool — investor-demo reliable.
 * Multiple sources, no API keys required. Picsum.photos is primary fallback (100% reliable).
 */

// Picsum.photos — NO API KEY, always works. Use for investor demos.
const PICSUM_POOL = [
  'https://picsum.photos/seed/conference1/1920/1080',
  'https://picsum.photos/seed/conference2/1920/1080',
  'https://picsum.photos/seed/event3/1920/1080',
  'https://picsum.photos/seed/meeting4/1920/1080',
  'https://picsum.photos/seed/summit5/1920/1080',
  'https://picsum.photos/seed/tech6/1920/1080',
  'https://picsum.photos/seed/ai7/1920/1080',
  'https://picsum.photos/seed/startup8/1920/1080',
  'https://picsum.photos/seed/innovation9/1920/1080',
  'https://picsum.photos/seed/future10/1920/1080',
  'https://picsum.photos/seed/demo11/1920/1080',
  'https://picsum.photos/seed/launch12/1920/1080',
  'https://picsum.photos/seed/network13/1920/1080',
  'https://picsum.photos/seed/collab14/1920/1080',
  'https://picsum.photos/seed/connect15/1920/1080',
  'https://picsum.photos/seed/growth16/1920/1080',
  'https://picsum.photos/seed/scale17/1920/1080',
  'https://picsum.photos/seed/build18/1920/1080',
  'https://picsum.photos/seed/create19/1920/1080',
  'https://picsum.photos/seed/design20/1920/1080',
  'https://picsum.photos/id/237/1920/1080',
  'https://picsum.photos/id/238/1920/1080',
  'https://picsum.photos/id/239/1920/1080',
  'https://picsum.photos/id/240/1920/1080',
  'https://picsum.photos/id/241/1920/1080',
  'https://picsum.photos/id/242/1920/1080',
  'https://picsum.photos/id/243/1920/1080',
  'https://picsum.photos/id/244/1920/1080',
  'https://picsum.photos/id/245/1920/1080',
  'https://picsum.photos/id/246/1920/1080',
  'https://picsum.photos/id/247/1920/1080',
  'https://picsum.photos/id/248/1920/1080',
  'https://picsum.photos/id/249/1920/1080',
  'https://picsum.photos/id/250/1920/1080',
  'https://picsum.photos/id/251/1920/1080',
  'https://picsum.photos/id/252/1920/1080',
  'https://picsum.photos/id/253/1920/1080',
  'https://picsum.photos/id/254/1920/1080',
  'https://picsum.photos/id/255/1920/1080',
  'https://picsum.photos/id/256/1920/1080',
  'https://picsum.photos/id/257/1920/1080',
  'https://picsum.photos/id/258/1920/1080',
  'https://picsum.photos/id/259/1920/1080',
  'https://picsum.photos/id/260/1920/1080',
  'https://picsum.photos/id/261/1920/1080',
  'https://picsum.photos/id/262/1920/1080',
  'https://picsum.photos/id/263/1920/1080',
  'https://picsum.photos/id/264/1920/1080',
  'https://picsum.photos/id/265/1920/1080',
  'https://picsum.photos/id/266/1920/1080',
  'https://picsum.photos/id/267/1920/1080',
  'https://picsum.photos/id/268/1920/1080',
  'https://picsum.photos/id/269/1920/1080',
  'https://picsum.photos/id/270/1920/1080',
  'https://picsum.photos/id/271/1920/1080',
  'https://picsum.photos/id/272/1920/1080',
  'https://picsum.photos/id/273/1920/1080',
  'https://picsum.photos/id/274/1920/1080',
  'https://picsum.photos/id/275/1920/1080',
  'https://picsum.photos/id/276/1920/1080',
  'https://picsum.photos/id/277/1920/1080',
  'https://picsum.photos/id/278/1920/1080',
  'https://picsum.photos/id/279/1920/1080',
  'https://picsum.photos/id/280/1920/1080',
  'https://picsum.photos/id/281/1920/1080',
  'https://picsum.photos/id/282/1920/1080',
  'https://picsum.photos/id/283/1920/1080',
  'https://picsum.photos/id/284/1920/1080',
  'https://picsum.photos/id/285/1920/1080',
  'https://picsum.photos/id/286/1920/1080',
  'https://picsum.photos/id/287/1920/1080',
  'https://picsum.photos/id/288/1920/1080',
  'https://picsum.photos/id/289/1920/1080',
  'https://picsum.photos/id/290/1920/1080',
  'https://picsum.photos/id/291/1920/1080',
  'https://picsum.photos/id/292/1920/1080',
  'https://picsum.photos/id/293/1920/1080',
  'https://picsum.photos/id/294/1920/1080',
  'https://picsum.photos/id/295/1920/1080',
  'https://picsum.photos/id/296/1920/1080',
  'https://picsum.photos/id/297/1920/1080',
  'https://picsum.photos/id/298/1920/1080',
  'https://picsum.photos/id/299/1920/1080',
  'https://picsum.photos/id/300/1920/1080',
];

// Unsplash — no API key for direct URLs, but can rate-limit
const UNSPLASH_POOL = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop',
];

export const FALLBACK_HERO_POOL = [...PICSUM_POOL];

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Get hero images for an event. Guaranteed to return non-empty array.
 * Default: Picsum-first (no API key, 100% reliable for investor demos).
 * Set NEXT_PUBLIC_USE_UNSPLASH=true to prefer Unsplash (can rate-limit).
 */
export function getHeroImages(seed?: string): string[] {
  const useUnsplash = process.env.NEXT_PUBLIC_USE_UNSPLASH === 'true';

  if (useUnsplash) {
    const h = seed ? simpleHash(seed) : 0;
    const mixed = [...UNSPLASH_POOL];
    for (let i = 0; i < 6; i++) {
      mixed.push(PICSUM_POOL[(h + i) % PICSUM_POOL.length]);
    }
    return mixed;
  }

  return [...PICSUM_POOL];
}

export const HERO_POOL_FOR_THEMES = PICSUM_POOL;
