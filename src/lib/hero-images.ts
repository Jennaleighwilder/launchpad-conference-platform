/**
 * Hero image pool — powered by Image Governor.
 * Topic-aware designs. Picsum = fallback. Governor = curated pools.
 */

import { getHeroPoolForTopic, getUniqueHeroForEvent as govGetUniqueHero } from "@/image-governor";

// Topic-keyed Unsplash pools — kept for getHeroImages compatibility
const TOPIC_HERO_POOLS: Record<string, string[]> = {
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop',
  ],
  cybersecurity: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop',
  ],
  startup: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
  ],
  keynote: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
  ],
  innovation: [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
  ],
  wellness: [
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&h=1080&fit=crop',
  ],
  music: [
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop',
  ],
  community: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop',
  ],
};

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
const _UNSPLASH_POOL = [
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

/** Map topic string to pool key for topic-aware imagery */
function topicToKey(topic: string): string {
  if (!topic || typeof topic !== 'string') return 'keynote';
  const t = topic.toLowerCase();
  if (t.includes('ai') || t.includes('machine learning') || t.includes('tech')) return 'ai';
  if (t.includes('cyber') || t.includes('security')) return 'cybersecurity';
  if (t.includes('startup') || t.includes('founder') || t.includes('vc')) return 'startup';
  if (t.includes('keynote') || t.includes('speaker')) return 'keynote';
  if (t.includes('innovation') || t.includes('youth') || t.includes('leadership')) return 'innovation';
  if (t.includes('wellness') || t.includes('health') || t.includes('fitness')) return 'wellness';
  if (t.includes('music') || t.includes('festival') || t.includes('concert')) return 'music';
  if (t.includes('community') || t.includes('non-profit') || t.includes('social')) return 'community';
  return 'keynote'; // default: conference/keynote
}

/**
 * Get topic-aware hero images. Guaranteed non-empty.
 * Uses Image Governor's curated topic pools; Picsum as fallback.
 */
export function getHeroImages(seed?: string, topic?: string): string[] {
  if (topic) {
    return getHeroPoolForTopic(topic);
  }
  return [...PICSUM_POOL];
}

export const HERO_POOL_FOR_THEMES = PICSUM_POOL;

/** Curated, topic-and-style-matched images. Deterministic per event. */
const HERO_IMAGE_LIBRARY: Record<string, Record<string, string[]>> = {
  conference: {
    ai: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587825140708-dfaf18c4c3d6?w=1920&h=1080&fit=crop&q=80',
    ],
    web3: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop&q=80',
    ],
    fintech: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop&q=80',
    ],
    general: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&h=1080&fit=crop&q=80',
    ],
  },
  networking: {
    _default: [
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop&q=80',
    ],
  },
  tech: {
    ai: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1920&h=1080&fit=crop&q=80',
    ],
    web3: [
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=1080&fit=crop&q=80',
    ],
    _default: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop&q=80',
    ],
  },
  nature: {
    climate: [
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop&q=80',
    ],
    health: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&h=1080&fit=crop&q=80',
    ],
    _default: [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1920&h=1080&fit=crop&q=80',
    ],
  },
  urban: {
    _default: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&q=80',
    ],
  },
  abstract: {
    _default: [
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&h=1080&fit=crop&q=80',
    ],
  },
  minimal: {
    _default: [
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=1920&h=1080&fit=crop&q=80',
    ],
  },
};

const AUTO_STYLE_MAP: Record<string, string> = {
  ai: 'tech',
  web3: 'tech',
  climate: 'nature',
  health: 'nature',
  fintech: 'urban',
  general: 'conference',
};

/** Pollinations.ai — free AI image generation, no API key */
function getPollinationsUrl(prompt: string, width = 1920, height = 1080): string {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true`;
}

/**
 * Resolve hero image URL. For custom+prompt uses Pollinations; for abstract/minimal returns empty (use CSS).
 * Otherwise uses curated library.
 */
export function resolveHeroImageUrl(
  topicKey: string,
  heroStyle: string,
  slug: string,
  heroPrompt?: string
): { url: string | null; useCss: boolean } {
  if (heroStyle === 'custom' && heroPrompt?.trim()) {
    const prompt = `Professional event banner: ${heroPrompt.trim()}, high quality, cinematic lighting, wide angle`;
    return { url: getPollinationsUrl(prompt), useCss: false };
  }
  if (heroStyle === 'abstract' || heroStyle === 'minimal') {
    return { url: null, useCss: true };
  }
  return { url: selectHeroImage(topicKey, heroStyle, slug), useCss: false };
}

/**
 * Smart hero image selection by topic + style. Deterministic per slug.
 * Use hero_style from form; 'auto' maps topic to best style.
 */
export function selectHeroImage(topicKey: string, heroStyle: string, slug: string): string {
  const style = heroStyle === 'auto' ? (AUTO_STYLE_MAP[topicKey] || 'conference') : heroStyle;
  const stylePool = HERO_IMAGE_LIBRARY[style] || HERO_IMAGE_LIBRARY.conference;
  const images = stylePool[topicKey] || stylePool._default || (stylePool as Record<string, string[]>)[Object.keys(stylePool)[0]];
  if (!images?.length) return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&q=80';
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash) + slug.charCodeAt(i);
  return images[Math.abs(hash) % images.length];
}

/**
 * Assign a unique hero image per event. Topic-aware: AI events get tech imagery, etc.
 * Deterministic: same event = same image. Powered by Image Governor.
 */
export function getUniqueHeroForEvent(topic: string, city: string, slug: string): string {
  return govGetUniqueHero(topic, city, slug);
}
