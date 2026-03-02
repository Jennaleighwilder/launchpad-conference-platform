// ============================================================================
// IMAGE GOVERNOR — LAUNCHPAD TOPIC HERO POOLS
// ============================================================================
// Topic-aware hero images for conference platform.
// Maps Launchpad topics (ai, cybersecurity, startup, etc.) to curated pools.
// ============================================================================

const TOPIC_POOLS: Record<string, string[]> = {
  ai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop",
  ],
  cybersecurity: [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop",
  ],
  startup: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop",
  ],
  keynote: [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop",
  ],
  innovation: [
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=1080&fit=crop",
  ],
  music: [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=1080&fit=crop",
  ],
  community: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop",
  ],
};

const PICSUM_FALLBACK = [
  "https://picsum.photos/seed/conference1/1920/1080",
  "https://picsum.photos/seed/conference2/1920/1080",
  "https://picsum.photos/seed/tech6/1920/1080",
  "https://picsum.photos/seed/ai7/1920/1080",
];

function topicToKey(topic: string): string {
  if (!topic || typeof topic !== "string") return "keynote";
  const t = topic.toLowerCase();
  if (t.includes("ai") || t.includes("machine learning") || t.includes("tech")) return "ai";
  if (t.includes("cyber") || t.includes("security")) return "cybersecurity";
  if (t.includes("startup") || t.includes("founder") || t.includes("vc")) return "startup";
  if (t.includes("keynote") || t.includes("speaker")) return "keynote";
  if (t.includes("innovation") || t.includes("youth") || t.includes("leadership")) return "innovation";
  if (t.includes("wellness") || t.includes("health") || t.includes("fitness")) return "wellness";
  if (t.includes("music") || t.includes("festival") || t.includes("concert")) return "music";
  if (t.includes("community") || t.includes("non-profit") || t.includes("social")) return "community";
  return "keynote";
}

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getHeroPoolForTopic(topic: string): string[] {
  const key = topicToKey(topic);
  const pool = TOPIC_POOLS[key] ?? TOPIC_POOLS.keynote;
  return [...pool, ...PICSUM_FALLBACK];
}

export function getUniqueHeroForEvent(topic: string, city: string, slug: string): string {
  const pool = getHeroPoolForTopic(topic);
  const seed = `${topic}|${city}|${slug}`;
  const idx = simpleHash(seed) % pool.length;
  return pool[idx];
}
