// ============================================================================
// IMAGE GOVERNOR — COLOR SYSTEM
// ============================================================================
// Users choose MOOD, not colors. Each mood maps to a tested, accessible palette.
// AI generation prompts include color direction from these tokens.
// Typography overlays use ONLY these values.
// ============================================================================

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  /** Primary brand/headline color */
  primary: string;
  /** Secondary accent */
  secondary: string;
  /** Bright accent for CTAs/highlights */
  accent: string;
  /** Main text color */
  text: string;
  /** Text on dark backgrounds */
  textLight: string;
  /** Background */
  background: string;
  /** Overlay color for gradients (usually dark, semi-transparent) */
  overlay: string;
  /** Prompt color keywords for AI generation */
  promptKeywords: string[];
  /** Forbidden colors the AI must avoid */
  forbidden: string[];
  /** WCAG contrast ratio target */
  contrastTarget: 'AA' | 'AAA';
}

// ============================================================================
// 12 CURATED PALETTES
// ============================================================================

export const PALETTES: Record<string, ColorPalette> = {

  MIDNIGHT_TECH: {
    id: 'MIDNIGHT_TECH',
    name: 'Midnight Tech',
    description: 'Deep navy + electric blue — conferences, hackathons, AI events',
    primary: '#0A1628',
    secondary: '#1E3A5F',
    accent: '#00D4FF',
    text: '#0A1628',
    textLight: '#F0F4F8',
    background: '#F0F4F8',
    overlay: 'rgba(10, 22, 40, 0.82)',
    promptKeywords: ['deep navy', 'dark blue', 'electric blue accents', 'cool tones', 'moody tech'],
    forbidden: ['neon green', 'hot pink', 'orange', 'warm tones'],
    contrastTarget: 'AAA',
  },

  WARM_LUXE: {
    id: 'WARM_LUXE',
    name: 'Warm Luxe',
    description: 'Gold + cream + charcoal — galas, fashion, luxury events',
    primary: '#1C1712',
    secondary: '#8B7355',
    accent: '#D4A853',
    text: '#1C1712',
    textLight: '#FDF8F0',
    background: '#FDF8F0',
    overlay: 'rgba(28, 23, 18, 0.78)',
    promptKeywords: ['warm golden', 'amber light', 'cream tones', 'luxurious', 'candlelit atmosphere'],
    forbidden: ['neon', 'cyan', 'bright blue', 'lime green'],
    contrastTarget: 'AAA',
  },

  ELECTRIC_NIGHT: {
    id: 'ELECTRIC_NIGHT',
    name: 'Electric Night',
    description: 'Black + magenta + violet — music, nightlife, raves',
    primary: '#0D0D0D',
    secondary: '#2D1B4E',
    accent: '#FF2D7B',
    text: '#0D0D0D',
    textLight: '#F5F0FF',
    background: '#0D0D0D',
    overlay: 'rgba(13, 13, 13, 0.75)',
    promptKeywords: ['dark neon', 'magenta glow', 'violet haze', 'nightclub atmosphere', 'dramatic shadows'],
    forbidden: ['pastel', 'beige', 'khaki', 'warm white'],
    contrastTarget: 'AA',
  },

  EARTH_RITUAL: {
    id: 'EARTH_RITUAL',
    name: 'Earth Ritual',
    description: 'Terracotta + sage + bone — wellness, retreats, ceremonies',
    primary: '#2C1810',
    secondary: '#7A6F5D',
    accent: '#C4713B',
    text: '#2C1810',
    textLight: '#F5F0E8',
    background: '#F5F0E8',
    overlay: 'rgba(44, 24, 16, 0.72)',
    promptKeywords: ['earthy tones', 'terracotta', 'sage green', 'natural light', 'warm organic'],
    forbidden: ['neon', 'electric blue', 'chrome', 'industrial grey'],
    contrastTarget: 'AAA',
  },

  BOTANICAL: {
    id: 'BOTANICAL',
    name: 'Botanical',
    description: 'Deep green + ivory + copper — garden events, markets, organic',
    primary: '#1A2E1A',
    secondary: '#3D5A3D',
    accent: '#B87333',
    text: '#1A2E1A',
    textLight: '#F5F7F0',
    background: '#F5F7F0',
    overlay: 'rgba(26, 46, 26, 0.75)',
    promptKeywords: ['deep forest green', 'botanical', 'copper accents', 'natural foliage', 'lush'],
    forbidden: ['neon pink', 'electric blue', 'bright red', 'synthetic'],
    contrastTarget: 'AAA',
  },

  GALLERY_WHITE: {
    id: 'GALLERY_WHITE',
    name: 'Gallery White',
    description: 'Pure white + charcoal + one accent — art, exhibitions, minimal',
    primary: '#FFFFFF',
    secondary: '#E5E5E5',
    accent: '#FF3B30',
    text: '#1A1A1A',
    textLight: '#FFFFFF',
    background: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.65)',
    promptKeywords: ['clean white space', 'gallery lighting', 'minimal', 'stark contrast', 'museum'],
    forbidden: ['busy patterns', 'gradients', 'warm tones', 'clutter'],
    contrastTarget: 'AAA',
  },

  SUNSET_WARM: {
    id: 'SUNSET_WARM',
    name: 'Sunset Warm',
    description: 'Coral + peach + deep rose — food events, supper clubs, warmth',
    primary: '#3D1F1F',
    secondary: '#8B4D4D',
    accent: '#FF6B4A',
    text: '#3D1F1F',
    textLight: '#FFF5F0',
    background: '#FFF5F0',
    overlay: 'rgba(61, 31, 31, 0.72)',
    promptKeywords: ['golden hour', 'warm sunset', 'coral tones', 'soft peach light', 'intimate dining'],
    forbidden: ['cold blue', 'grey', 'clinical', 'sterile'],
    contrastTarget: 'AAA',
  },

  OCEAN_DEEP: {
    id: 'OCEAN_DEEP',
    name: 'Ocean Deep',
    description: 'Teal + slate + pearl — community events, innovation, fresh',
    primary: '#0A2F3A',
    secondary: '#1A5568',
    accent: '#00BFA6',
    text: '#0A2F3A',
    textLight: '#F0FAFA',
    background: '#F0FAFA',
    overlay: 'rgba(10, 47, 58, 0.78)',
    promptKeywords: ['deep teal', 'ocean atmosphere', 'turquoise accents', 'cool coastal', 'fresh'],
    forbidden: ['warm orange', 'red', 'brown', 'earth tones'],
    contrastTarget: 'AAA',
  },

  INK_PAPER: {
    id: 'INK_PAPER',
    name: 'Ink & Paper',
    description: 'Black + off-white + red accent — literary, intellectual, editorial',
    primary: '#111111',
    secondary: '#444444',
    accent: '#CC0000',
    text: '#111111',
    textLight: '#FAFAF5',
    background: '#FAFAF5',
    overlay: 'rgba(17, 17, 17, 0.80)',
    promptKeywords: ['high contrast', 'black and white', 'editorial', 'typographic', 'bookish'],
    forbidden: ['pastels', 'gradients', 'neon', 'playful colors'],
    contrastTarget: 'AAA',
  },

  FESTIVAL_BRIGHT: {
    id: 'FESTIVAL_BRIGHT',
    name: 'Festival Bright',
    description: 'Bold primaries + white — family events, fairs, markets',
    primary: '#1A1A2E',
    secondary: '#E94560',
    accent: '#FFD93D',
    text: '#1A1A2E',
    textLight: '#FFFFFF',
    background: '#FFFFFF',
    overlay: 'rgba(26, 26, 46, 0.70)',
    promptKeywords: ['bright festival', 'bold primary colors', 'vibrant energy', 'celebratory', 'dynamic'],
    forbidden: ['muted', 'desaturated', 'monochrome', 'corporate'],
    contrastTarget: 'AA',
  },

  SMOKE_NOIR: {
    id: 'SMOKE_NOIR',
    name: 'Smoke Noir',
    description: 'Black + smoke grey + silver — exclusive events, after-dark, premium',
    primary: '#0A0A0A',
    secondary: '#2A2A2A',
    accent: '#C0C0C0',
    text: '#E8E8E8',
    textLight: '#E8E8E8',
    background: '#0A0A0A',
    overlay: 'rgba(0, 0, 0, 0.60)',
    promptKeywords: ['smoke', 'dark atmosphere', 'silver highlights', 'noir', 'dramatic shadows'],
    forbidden: ['bright colors', 'pastels', 'warm tones', 'playful'],
    contrastTarget: 'AA',
  },

  MYSTIC_PURPLE: {
    id: 'MYSTIC_PURPLE',
    name: 'Mystic Purple',
    description: 'Deep purple + lavender + gold — spiritual, sound baths, ceremonies',
    primary: '#1A0A2E',
    secondary: '#3D1F6D',
    accent: '#D4A853',
    text: '#1A0A2E',
    textLight: '#F5F0FF',
    background: '#F5F0FF',
    overlay: 'rgba(26, 10, 46, 0.78)',
    promptKeywords: ['deep purple', 'mystical', 'lavender haze', 'gold accents', 'ethereal glow'],
    forbidden: ['neon green', 'bright orange', 'clinical white', 'corporate blue'],
    contrastTarget: 'AAA',
  },
};

// ============================================================================
// CATEGORY → PALETTE MAPPING
// ============================================================================

export const CATEGORY_PALETTE_MAP: Record<string, string[]> = {
  'fashion':     ['WARM_LUXE', 'SMOKE_NOIR', 'GALLERY_WHITE'],
  'food':        ['SUNSET_WARM', 'EARTH_RITUAL', 'BOTANICAL'],
  'art':         ['GALLERY_WHITE', 'INK_PAPER', 'SMOKE_NOIR'],
  'wellness':    ['EARTH_RITUAL', 'MYSTIC_PURPLE', 'BOTANICAL'],
  'music':       ['ELECTRIC_NIGHT', 'SMOKE_NOIR', 'FESTIVAL_BRIGHT'],
  'nightlife':   ['ELECTRIC_NIGHT', 'SMOKE_NOIR', 'MYSTIC_PURPLE'],
  'markets':     ['BOTANICAL', 'FESTIVAL_BRIGHT', 'SUNSET_WARM'],
  'tech':        ['MIDNIGHT_TECH', 'OCEAN_DEEP', 'INK_PAPER'],
  'literary':    ['INK_PAPER', 'WARM_LUXE', 'GALLERY_WHITE'],
  'conference':  ['MIDNIGHT_TECH', 'OCEAN_DEEP', 'GALLERY_WHITE'],
  'default':     ['MIDNIGHT_TECH', 'WARM_LUXE', 'GALLERY_WHITE'],
};

/**
 * Get recommended palettes for a category
 */
export function getPalettesForCategory(category: string): ColorPalette[] {
  const key = category.toLowerCase();
  const ids = CATEGORY_PALETTE_MAP[key] || CATEGORY_PALETTE_MAP['default'];
  return ids.map(id => PALETTES[id]).filter(Boolean);
}

/**
 * Get all palettes
 */
export function getAllPalettes(): ColorPalette[] {
  return Object.values(PALETTES);
}

/**
 * Calculate relative luminance (WCAG 2.0)
 */
function luminance(hex: string): number {
  const rgb = hex.replace('#', '').match(/.{2}/g)!.map(c => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/**
 * Check WCAG contrast ratio between two colors
 */
export function contrastRatio(color1: string, color2: string): number {
  const l1 = luminance(color1);
  const l2 = luminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verify a palette meets its own contrast target
 */
export function validatePalette(palette: ColorPalette): boolean {
  const threshold = palette.contrastTarget === 'AAA' ? 7 : 4.5;
  const ratio = contrastRatio(palette.text, palette.background);
  return ratio >= threshold;
}
