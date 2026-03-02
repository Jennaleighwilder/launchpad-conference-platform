// ============================================================================
// IMAGE GOVERNOR — PROMPT BUILDER
// ============================================================================
// The AI NEVER generates "posters" or "flyers".
// It generates BACKPLATES — atmospheric backgrounds designed to host text.
// This module constructs constrained prompts from layout + palette + category.
// ============================================================================

import { type LayoutTemplate } from '../config/layouts';
import { type ColorPalette } from '../config/palettes';

export interface PromptConfig {
  /** Event category */
  category: string;
  /** Selected layout */
  layout: LayoutTemplate;
  /** Selected palette */
  palette: ColorPalette;
  /** User's event description (optional — used for atmosphere only) */
  eventDescription?: string;
  /** User's visual intensity preference */
  intensity: 'calm' | 'balanced' | 'bold' | 'maximal';
  /** Whether faces are allowed */
  allowFaces: boolean;
  /** Seed for reproducibility (optional) */
  seed?: number;
}

// ============================================================================
// CATEGORY ATMOSPHERE KEYWORDS
// These define the "feel" — not the subject
// ============================================================================

const CATEGORY_ATMOSPHERE: Record<string, string[]> = {
  'fashion':     ['runway lighting', 'fabric textures', 'editorial fashion photography backdrop', 'dramatic shadows on fabric'],
  'food':        ['warm dining ambiance', 'golden hour table setting', 'steam rising', 'artisan ingredients'],
  'art':         ['gallery wall', 'paint textures', 'abstract brushstrokes', 'museum lighting'],
  'wellness':    ['natural light through curtains', 'morning mist', 'soft focus botanical', 'serene water surface'],
  'music':       ['stage lighting beams', 'concert smoke', 'vinyl grooves macro', 'speaker vibration'],
  'nightlife':   ['club fog machines', 'laser beams in dark', 'neon reflections on wet pavement', 'dark dance floor'],
  'markets':     ['wooden market stall', 'morning farmers market light', 'handmade textiles', 'artisan workshop'],
  'tech':        ['circuit board macro', 'data visualization ambient', 'server room blue glow', 'holographic interface'],
  'literary':    ['old book pages', 'reading lamp glow', 'library shelves bokeh', 'fountain pen on paper'],
  'conference':  ['empty auditorium', 'podium spotlight', 'aerial view of seats', 'presentation screen glow'],
};

// ============================================================================
// LAYOUT-SPECIFIC COMPOSITION DIRECTIVES
// Tell the AI WHERE to put visual interest (and where NOT to)
// ============================================================================

function getCompositionDirective(layout: LayoutTemplate): string {
  const zone = layout.imageActiveZone;
  const directives: string[] = [];

  // Where to put detail
  if (zone.y === 0 && zone.height < 70) {
    directives.push('concentrate visual interest in the upper portion of the frame');
    directives.push('keep the lower third calm and simple');
  }
  if (zone.x > 40) {
    directives.push('place visual weight on the right side of the frame');
    directives.push('keep the left side minimal with negative space');
  }
  if (zone.width === 100 && zone.height === 100) {
    directives.push('distribute visual interest evenly but keep a quiet zone in the center');
  }

  // Where NOT to put detail (text zones)
  for (const safe of layout.textSafeZones) {
    if (safe.y > 50) {
      directives.push('ensure the bottom area is dark, simple, and low-detail');
    }
    if (safe.y < 20) {
      directives.push('ensure the top area has low visual complexity');
    }
    if (safe.x < 15 && safe.width < 55) {
      directives.push('keep the left portion calm for text overlay');
    }
  }

  return directives.join('. ');
}

// ============================================================================
// INTENSITY MODIFIERS
// ============================================================================

const INTENSITY_MAP: Record<string, string[]> = {
  'calm':     ['soft focus', 'desaturated', 'gentle lighting', 'low contrast', 'whisper-quiet atmosphere'],
  'balanced': ['natural lighting', 'moderate contrast', 'professional quality', 'clear atmosphere'],
  'bold':     ['vivid colors', 'dramatic lighting', 'strong contrast', 'high saturation', 'impactful'],
  'maximal':  ['extreme contrast', 'hyper-vivid', 'cinematic dramatic', 'bold shadows', 'intense atmosphere'],
};

// ============================================================================
// THE CORE BUILDER
// ============================================================================

export function buildBackplatePrompt(config: PromptConfig): string {
  const {
    category,
    layout,
    palette,
    eventDescription,
    intensity,
    allowFaces,
  } = config;

  const parts: string[] = [];

  // --- 1. CORE IDENTITY: This is a backplate, not a poster ---
  parts.push('wide cinematic background photograph');
  parts.push('designed as a backdrop for typography overlay');
  parts.push('professional event marketing imagery');

  // --- 2. ATMOSPHERE from category ---
  const cat = category.toLowerCase();
  const atmosphere = CATEGORY_ATMOSPHERE[cat] || CATEGORY_ATMOSPHERE['conference'];
  // Pick 2-3 random atmosphere keywords for variety
  const shuffled = [...atmosphere].sort(() => Math.random() - 0.5);
  parts.push(shuffled.slice(0, 3).join(', '));

  // --- 3. COLOR DIRECTION from palette ---
  parts.push(palette.promptKeywords.join(', '));

  // --- 4. COMPOSITION from layout ---
  parts.push(getCompositionDirective(layout));

  // --- 5. INTENSITY ---
  parts.push(INTENSITY_MAP[intensity].join(', '));

  // --- 6. NEGATIVE SPACE directive ---
  parts.push('generous negative space');
  parts.push('room for text overlay');
  parts.push('no text in the image');
  parts.push('no logos');
  parts.push('no watermarks');
  parts.push('no borders or frames');

  // --- 7. FACE CONTROL ---
  if (!allowFaces) {
    parts.push('no people');
    parts.push('no faces');
    parts.push('no human figures');
  } else {
    parts.push('if people present, silhouetted or from behind');
    parts.push('no direct eye contact with camera');
    parts.push('figures as atmosphere, not subjects');
  }

  // --- 8. FORBIDDEN elements from palette ---
  if (palette.forbidden.length > 0) {
    parts.push(`avoid: ${palette.forbidden.join(', ')}`);
  }

  // --- 9. USER CONTEXT (sanitized — only atmosphere, never literal) ---
  if (eventDescription) {
    // Extract only mood/atmosphere words, ignore specifics
    const sanitized = eventDescription
      .replace(/[^a-zA-Z\s]/g, '')
      .split(' ')
      .filter(w => w.length > 3)
      .slice(0, 5)
      .join(' ');
    if (sanitized.length > 0) {
      parts.push(`atmosphere inspired by: ${sanitized}`);
    }
  }

  // --- 10. QUALITY ANCHORS ---
  parts.push('8K resolution');
  parts.push('shot on Hasselblad');
  parts.push('editorial quality');
  parts.push('depth of field');

  return parts.join(', ');
}

// ============================================================================
// NEGATIVE PROMPT (what the model must NOT generate)
// ============================================================================

export function buildNegativePrompt(config: PromptConfig): string {
  const parts: string[] = [
    'text',
    'words',
    'letters',
    'logos',
    'watermarks',
    'borders',
    'frames',
    'UI elements',
    'buttons',
    'low quality',
    'blurry',
    'pixelated',
    'distorted',
    'disfigured',
    'bad anatomy',
    'extra limbs',
    'extra fingers',
    'mutated hands',
    'poorly drawn face',
    'deformed',
    'ugly',
    'oversaturated',
    'cartoon',
    'anime',
    'illustration',
    'clipart',
    'stock photo watermark',
  ];

  if (!config.allowFaces) {
    parts.push('faces', 'people', 'human figures', 'portraits', 'headshots');
  }

  // Add palette forbidden items
  parts.push(...config.palette.forbidden);

  return parts.join(', ');
}

// ============================================================================
// BATCH PROMPT GENERATOR
// Generates multiple varied prompts for the same config
// ============================================================================

export function buildPromptBatch(config: PromptConfig, count: number = 6): Array<{
  prompt: string;
  negativePrompt: string;
  seed: number;
}> {
  const batch: Array<{ prompt: string; negativePrompt: string; seed: number }> = [];
  const baseSeed = config.seed || Math.floor(Math.random() * 999999);

  for (let i = 0; i < count; i++) {
    const seed = baseSeed + (i * 12345); // deterministic but varied
    const variedConfig = { ...config, seed };
    batch.push({
      prompt: buildBackplatePrompt(variedConfig),
      negativePrompt: buildNegativePrompt(variedConfig),
      seed,
    });
  }

  return batch;
}
