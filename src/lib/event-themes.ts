/**
 * Event design theme system — 12 unique visual identities.
 * Theme is selected by topic × vibe × slug hash so each event gets a distinct look.
 * Hero images from hero-images.ts (Picsum fallback, no API key).
 */

import { HERO_POOL_FOR_THEMES } from './hero-images';

export interface EventTheme {
  id: string;
  name: string;
  fontDisplay: string;
  fontMono: string;
  bg: string;
  bgGradient?: string;
  accent: string;
  accentSecondary?: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  buttonRadius: string;
  heroOverlay: string;
  heroImages: string[];
}

export const EVENT_THEMES: EventTheme[] = [
  {
    id: 'supernova',
    name: 'SuperNova',
    fontDisplay: "'Instrument Serif', Georgia, serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#050505',
    accent: '#4FFFDF',
    text: '#f5f5f5',
    textMuted: '#888888',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.06)',
    buttonRadius: '0.5rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#0C0A09',
    accent: '#D4A574',
    accentSecondary: '#8B7355',
    text: '#FAFAF9',
    textMuted: '#A8A29E',
    cardBg: 'rgba(212,165,116,0.06)',
    cardBorder: 'rgba(212,165,116,0.2)',
    buttonRadius: '0.25rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'neon-brutalist',
    name: 'Neon Brutalist',
    fontDisplay: "'Archivo Black', sans-serif",
    fontMono: "'Share Tech Mono', monospace",
    bg: '#0a0a0a',
    accent: '#FF006E',
    accentSecondary: '#FFBE0B',
    text: '#ffffff',
    textMuted: '#a1a1aa',
    cardBg: 'rgba(255,0,110,0.08)',
    cardBorder: 'rgba(255,0,110,0.4)',
    buttonRadius: '0',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'luminous',
    name: 'Luminous',
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#FAFAF8',
    accent: '#2D5A27',
    accentSecondary: '#7CB068',
    text: '#1C1917',
    textMuted: '#57534E',
    cardBg: 'rgba(45,90,39,0.06)',
    cardBorder: 'rgba(45,90,39,0.15)',
    buttonRadius: '9999px',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.7) 60%, rgba(250,250,248,0.95) 85%, #FAFAF8 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'electric',
    name: 'Electric',
    fontDisplay: "'Sora', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#08061C',
    accent: '#A78BFA',
    accentSecondary: '#C4B5FD',
    text: '#E9D5FF',
    textMuted: '#A78BFA',
    bgGradient: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.15) 0%, transparent 50%)',
    cardBg: 'rgba(139,92,246,0.08)',
    cardBorder: 'rgba(139,92,246,0.25)',
    buttonRadius: '0.5rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'festival',
    name: 'Festival',
    fontDisplay: "'Bebas Neue', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#1a0a00',
    accent: '#F97316',
    accentSecondary: '#FBBF24',
    text: '#FFFBEB',
    textMuted: '#FCD34D',
    cardBg: 'rgba(249,115,22,0.1)',
    cardBorder: 'rgba(249,115,22,0.3)',
    buttonRadius: '9999px',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    fontDisplay: "'Fraunces', Georgia, serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#FFFFFF',
    accent: '#0F766E',
    accentSecondary: '#14B8A6',
    text: '#0F172A',
    textMuted: '#64748B',
    cardBg: 'rgba(15,118,110,0.04)',
    cardBorder: 'rgba(15,118,110,0.15)',
    buttonRadius: '0.5rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0.7) 60%, rgba(255,255,255,0.98) 85%, #FFFFFF 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'cyber',
    name: 'Cyber',
    fontDisplay: "'Orbitron', sans-serif",
    fontMono: "'Share Tech Mono', monospace",
    bg: '#0f172a',
    accent: '#22C55E',
    accentSecondary: '#4ADE80',
    text: '#E2E8F0',
    textMuted: '#94A3B8',
    cardBg: 'rgba(34,197,94,0.06)',
    cardBorder: 'rgba(34,197,94,0.3)',
    buttonRadius: '0.25rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    fontDisplay: "'Libre Baskerville', Georgia, serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#1A1612',
    accent: '#D97706',
    accentSecondary: '#F59E0B',
    text: '#FEF3C7',
    textMuted: '#D4A574',
    cardBg: 'rgba(217,119,6,0.08)',
    cardBorder: 'rgba(217,119,6,0.2)',
    buttonRadius: '9999px',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    fontDisplay: "'Newsreader', Georgia, serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#111111',
    accent: '#ffffff',
    accentSecondary: '#a3a3a3',
    text: '#fafafa',
    textMuted: '#737373',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.1)',
    buttonRadius: '0',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'startup',
    name: 'Startup',
    fontDisplay: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#09090B',
    accent: '#6366F1',
    accentSecondary: '#818CF8',
    text: '#fafafa',
    textMuted: '#a1a1aa',
    cardBg: 'rgba(99,102,241,0.06)',
    cardBorder: 'rgba(99,102,241,0.2)',
    buttonRadius: '0.75rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    fontDisplay: "'Poiret One', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    bg: '#0c1929',
    accent: '#D4AF37',
    accentSecondary: '#F4E4BC',
    text: '#F5F5DC',
    textMuted: '#C9B896',
    cardBg: 'rgba(212,175,55,0.06)',
    cardBorder: 'rgba(212,175,55,0.25)',
    buttonRadius: '0.25rem',
    heroOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
    heroImages: HERO_POOL_FOR_THEMES,
  },
];

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Select a theme based on topic, vibe, and slug.
 * Deterministic: same inputs always produce same theme.
 */
export function getEventTheme(topic: string, vibe: string, slug: string): EventTheme {
  const seed = `${topic.toLowerCase()}|${vibe.toLowerCase()}|${slug}`;
  const idx = simpleHash(seed) % EVENT_THEMES.length;
  return EVENT_THEMES[idx];
}
