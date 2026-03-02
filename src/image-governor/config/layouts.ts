// ============================================================================
// IMAGE GOVERNOR — LAYOUT SYSTEM
// ============================================================================
// These are LOCKED layout templates. The AI never decides composition.
// Code decides composition. AI only fills texture/atmosphere slots.
// ============================================================================

export interface LayoutZone {
  x: number;      // percentage from left
  y: number;      // percentage from top
  width: number;  // percentage width
  height: number; // percentage height
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  /** Where the AI image is allowed to have visual detail */
  imageActiveZone: LayoutZone;
  /** Where text will be overlaid — AI must keep this calm/dark/simple */
  textSafeZones: LayoutZone[];
  /** Text alignment within safe zones */
  textAlign: 'left' | 'center' | 'right';
  /** Whether a gradient overlay is mandatory */
  requiresGradient: boolean;
  /** Gradient direction if required */
  gradientDirection?: string;
  /** Aspect ratio for the generated image */
  aspectRatio: '16:9' | '4:3' | '1:1' | '9:16' | '3:4';
  /** Best use cases */
  bestFor: string[];
}

// ============================================================================
// THE 8 LOCKED LAYOUTS
// ============================================================================

export const LAYOUTS: Record<string, LayoutTemplate> = {

  // --- 1. HERO TOP: Image fills top, text block sits at bottom ---
  HERO_TOP: {
    id: 'HERO_TOP',
    name: 'Hero Top',
    description: 'Full-bleed image on top, text panel on the lower third',
    imageActiveZone: { x: 0, y: 0, width: 100, height: 65 },
    textSafeZones: [
      { x: 5, y: 68, width: 90, height: 28 },
    ],
    textAlign: 'left',
    requiresGradient: true,
    gradientDirection: 'to bottom',
    aspectRatio: '16:9',
    bestFor: ['conferences', 'keynotes', 'concerts'],
  },

  // --- 2. HERO LEFT: Split screen — image left, text right ---
  HERO_LEFT: {
    id: 'HERO_LEFT',
    name: 'Hero Left',
    description: 'Image on left half, text and details on the right',
    imageActiveZone: { x: 0, y: 0, width: 50, height: 100 },
    textSafeZones: [
      { x: 55, y: 10, width: 40, height: 80 },
    ],
    textAlign: 'left',
    requiresGradient: false,
    aspectRatio: '16:9',
    bestFor: ['workshops', 'retreats', 'tastings'],
  },

  // --- 3. CENTER CARD: Image everywhere, centered floating card ---
  CENTER_CARD: {
    id: 'CENTER_CARD',
    name: 'Center Card',
    description: 'Full-bleed background with centered translucent card overlay',
    imageActiveZone: { x: 0, y: 0, width: 100, height: 100 },
    textSafeZones: [
      { x: 15, y: 20, width: 70, height: 60 },
    ],
    textAlign: 'center',
    requiresGradient: true,
    gradientDirection: 'radial',
    aspectRatio: '16:9',
    bestFor: ['galas', 'fashion', 'art exhibitions'],
  },

  // --- 4. FULL BLEED OVERLAY: Image fills, dark gradient bottom ---
  FULL_BLEED_OVERLAY: {
    id: 'FULL_BLEED_OVERLAY',
    name: 'Full Bleed + Overlay',
    description: 'Image fills entire canvas with dark gradient overlay for text',
    imageActiveZone: { x: 0, y: 0, width: 100, height: 60 },
    textSafeZones: [
      { x: 5, y: 55, width: 60, height: 40 },
    ],
    textAlign: 'left',
    requiresGradient: true,
    gradientDirection: 'to top',
    aspectRatio: '16:9',
    bestFor: ['music', 'nightlife', 'festivals'],
  },

  // --- 5. TICKET FLYER: Vertical poster format ---
  TICKET_FLYER: {
    id: 'TICKET_FLYER',
    name: 'Ticket Flyer',
    description: 'Vertical poster — image top third, bold type middle, details bottom',
    imageActiveZone: { x: 0, y: 0, width: 100, height: 40 },
    textSafeZones: [
      { x: 8, y: 42, width: 84, height: 25 },  // headline zone
      { x: 8, y: 70, width: 84, height: 25 },  // details zone
    ],
    textAlign: 'center',
    requiresGradient: true,
    gradientDirection: 'to bottom',
    aspectRatio: '9:16',
    bestFor: ['pop-ups', 'markets', 'maker fairs'],
  },

  // --- 6. MINIMAL EDITORIAL: Lots of whitespace, image is small accent ---
  MINIMAL_EDITORIAL: {
    id: 'MINIMAL_EDITORIAL',
    name: 'Minimal Editorial',
    description: 'Clean layout — small image accent, dominant typography',
    imageActiveZone: { x: 60, y: 10, width: 35, height: 50 },
    textSafeZones: [
      { x: 5, y: 15, width: 50, height: 70 },
    ],
    textAlign: 'left',
    requiresGradient: false,
    aspectRatio: '16:9',
    bestFor: ['tech', 'intellectual', 'literary'],
  },

  // --- 7. CINEMA WIDE: Ultra-wide cinematic crop ---
  CINEMA_WIDE: {
    id: 'CINEMA_WIDE',
    name: 'Cinema Wide',
    description: 'Cinematic widescreen with text in letterbox bars',
    imageActiveZone: { x: 0, y: 15, width: 100, height: 70 },
    textSafeZones: [
      { x: 5, y: 0, width: 90, height: 14 },   // top bar
      { x: 5, y: 86, width: 90, height: 14 },   // bottom bar
    ],
    textAlign: 'center',
    requiresGradient: false,
    aspectRatio: '16:9',
    bestFor: ['film', 'immersive', 'experiential'],
  },

  // --- 8. ASYMMETRIC EDGE: Image bleeds from one edge, text opposite ---
  ASYMMETRIC_EDGE: {
    id: 'ASYMMETRIC_EDGE',
    name: 'Asymmetric Edge',
    description: 'Image anchored to right edge with text floating left',
    imageActiveZone: { x: 45, y: 0, width: 55, height: 100 },
    textSafeZones: [
      { x: 5, y: 15, width: 38, height: 70 },
    ],
    textAlign: 'left',
    requiresGradient: false,
    aspectRatio: '16:9',
    bestFor: ['wellness', 'food', 'luxury'],
  },
};

// ============================================================================
// LAYOUT AUTO-SELECTOR
// Maps event categories to recommended layouts
// ============================================================================

export const CATEGORY_LAYOUT_MAP: Record<string, string[]> = {
  'fashion':     ['CENTER_CARD', 'ASYMMETRIC_EDGE', 'FULL_BLEED_OVERLAY'],
  'food':        ['HERO_LEFT', 'ASYMMETRIC_EDGE', 'MINIMAL_EDITORIAL'],
  'art':         ['CENTER_CARD', 'CINEMA_WIDE', 'FULL_BLEED_OVERLAY'],
  'wellness':    ['HERO_LEFT', 'ASYMMETRIC_EDGE', 'MINIMAL_EDITORIAL'],
  'music':       ['FULL_BLEED_OVERLAY', 'TICKET_FLYER', 'CINEMA_WIDE'],
  'nightlife':   ['FULL_BLEED_OVERLAY', 'TICKET_FLYER', 'CENTER_CARD'],
  'markets':     ['TICKET_FLYER', 'HERO_TOP', 'HERO_LEFT'],
  'tech':        ['MINIMAL_EDITORIAL', 'HERO_TOP', 'CINEMA_WIDE'],
  'literary':    ['MINIMAL_EDITORIAL', 'HERO_LEFT', 'ASYMMETRIC_EDGE'],
  'conference':  ['HERO_TOP', 'MINIMAL_EDITORIAL', 'CINEMA_WIDE'],
  'default':     ['HERO_TOP', 'CENTER_CARD', 'FULL_BLEED_OVERLAY'],
};

/**
 * Get recommended layouts for a category
 */
export function getLayoutsForCategory(category: string): LayoutTemplate[] {
  const key = category.toLowerCase();
  const ids = CATEGORY_LAYOUT_MAP[key] || CATEGORY_LAYOUT_MAP['default'];
  return ids.map(id => LAYOUTS[id]).filter(Boolean);
}

/**
 * Get all layouts as array
 */
export function getAllLayouts(): LayoutTemplate[] {
  return Object.values(LAYOUTS);
}
