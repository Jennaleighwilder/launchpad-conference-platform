/**
 * Hero image pool — topic-aware designs.
 * Picsum = 100% reliable fallback. Unsplash = richer, event-appropriate imagery.
 * Each topic gets images that "make sense with the event" (wellness→nature, AI→tech, etc).
 */

// Topic-keyed Unsplash pools — event-appropriate imagery (no API key for direct URLs)
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
 * Uses Unsplash topic pools when available; Picsum as fallback.
 */
export function getHeroImages(seed?: string, topic?: string): string[] {
  const topicPool = (topic && TOPIC_HERO_POOLS[topicToKey(topic)]) || null;
  if (topicPool?.length) {
    const h = seed ? simpleHash(seed) : 0;
    const mixed = [...topicPool];
    for (let i = 0; i < 4; i++) {
      mixed.push(PICSUM_POOL[(h + i) % PICSUM_POOL.length]);
    }
    return mixed;
  }
  return [...PICSUM_POOL];
}

export const HERO_POOL_FOR_THEMES = PICSUM_POOL;

/**
 * Assign a unique hero image per event. Topic-aware: AI events get tech imagery, etc.
 * Deterministic: same event = same image. Different events get different images.
 */
export function getUniqueHeroForEvent(topic: string, city: string, slug: string): string {
  const topicPool = TOPIC_HERO_POOLS[topicToKey(topic)];
  const pool = topicPool?.length ? topicPool : PICSUM_POOL;
  const seed = `${topic}|${city}|${slug}`;
  const idx = simpleHash(seed) % pool.length;
  return pool[idx];
}
