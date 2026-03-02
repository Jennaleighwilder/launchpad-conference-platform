// ============================================================================
// IMAGE GOVERNOR — QUALITY GATE
// ============================================================================
// The master orchestrator. This is the single entry point your apps call.
// 
// Flow: Generate → Inspect → Accept/Reject → Retry if needed → Return approved
// 
// Your apps NEVER call image generation directly.
// They call: governorGenerate() and receive only approved images.
// ============================================================================

import { type LayoutTemplate, LAYOUTS, getLayoutsForCategory } from '../config/layouts';
import { type ColorPalette, PALETTES, getPalettesForCategory } from '../config/palettes';
import { type FontPairing, getFontsForCategory } from '../config/typography';
import { buildBackplatePrompt, buildNegativePrompt, type PromptConfig } from './promptBuilder';
import { inspectImageFromUrl, type InspectionResult } from './imageInspector';
import {
  recordGeneration,
  generateFingerprint,
  isTooSimilar,
  perturbSeed,
  getUniqueSeedBatch,
  getStats,
} from './seedManager';

// ============================================================================
// GOVERNOR CONFIG
// ============================================================================

export interface GovernorRequest {
  /** Event category (fashion, tech, music, etc.) */
  category: string;
  /** Optional: specific layout ID. If not provided, governor auto-selects. */
  layoutId?: string;
  /** Optional: specific palette ID. If not provided, governor auto-selects. */
  paletteId?: string;
  /** Optional: user's event description for atmosphere hints */
  eventDescription?: string;
  /** Visual intensity */
  intensity?: 'calm' | 'balanced' | 'bold' | 'maximal';
  /** Allow faces in generation */
  allowFaces?: boolean;
  /** How many approved images to return */
  requestedCount?: number;
  /** Max generation attempts before giving up */
  maxAttempts?: number;
  /** Your image generation function — governor calls this with prompt + seed */
  generateImage: (prompt: string, negativePrompt: string, seed: number) => Promise<string>;
}

export interface GovernorResult {
  /** Approved images ready to use */
  approved: ApprovedImage[];
  /** Generation statistics for this batch */
  stats: {
    totalAttempts: number;
    totalAccepted: number;
    totalRejected: number;
    averageScore: number;
    rejectionReasons: string[];
  };
  /** Design tokens for the renderer */
  designTokens: {
    layout: LayoutTemplate;
    palette: ColorPalette;
    fonts: FontPairing;
  };
}

export interface ApprovedImage {
  url: string;
  seed: number;
  score: number;
  inspection: InspectionResult;
}

// ============================================================================
// THE GOVERNOR — MAIN ENTRY POINT
// ============================================================================

export async function governorGenerate(request: GovernorRequest): Promise<GovernorResult> {
  const {
    category,
    layoutId,
    paletteId,
    eventDescription,
    intensity = 'balanced',
    allowFaces = false,
    requestedCount = 3,
    maxAttempts = 12,
    generateImage,
  } = request;

  // --- 1. SELECT DESIGN TOKENS ---
  const layout = layoutId
    ? LAYOUTS[layoutId]
    : getLayoutsForCategory(category)[0];

  const palette = paletteId
    ? PALETTES[paletteId]
    : getPalettesForCategory(category)[0];

  const fonts = getFontsForCategory(category)[0];

  if (!layout || !palette || !fonts) {
    throw new Error(`No design tokens found for category: ${category}`);
  }

  // --- 2. GENERATE SEEDS ---
  const seeds = getUniqueSeedBatch(maxAttempts);

  // --- 3. GENERATION + INSPECTION LOOP ---
  const approved: ApprovedImage[] = [];
  const rejectionReasons: string[] = [];
  let totalAttempts = 0;

  for (let i = 0; i < maxAttempts && approved.length < requestedCount; i++) {
    totalAttempts++;
    const seed = seeds[i] || perturbSeed(Date.now(), i);

    // Build constrained prompt
    const promptConfig: PromptConfig = {
      category,
      layout,
      palette,
      eventDescription,
      intensity,
      allowFaces,
      seed,
    };

    const prompt = buildBackplatePrompt(promptConfig);
    const negativePrompt = buildNegativePrompt(promptConfig);

    try {
      // --- Call the actual image generator ---
      const imageUrl = await generateImage(prompt, negativePrompt, seed);

      // --- Inspect the result ---
      const inspection = await inspectImageFromUrl(imageUrl, layout, palette);

      // --- Check novelty ---
      // Load image to canvas for fingerprinting
      const fingerprint = await getImageFingerprint(imageUrl);
      const similarity = isTooSimilar(fingerprint, 0.85, category);

      if (similarity.similar) {
        inspection.passed = false;
        inspection.failures.push(
          `Too similar to recent image (${(similarity.mostSimilar * 100).toFixed(0)}% match)`
        );
      }

      // --- Record the generation ---
      recordGeneration({
        seed,
        timestamp: Date.now(),
        category,
        layoutId: layout.id,
        paletteId: palette.id,
        fingerprint,
        qualityScore: inspection.score,
        accepted: inspection.passed,
      });

      if (inspection.passed) {
        approved.push({
          url: imageUrl,
          seed,
          score: inspection.score,
          inspection,
        });
      } else {
        rejectionReasons.push(...inspection.failures);
      }

    } catch (error) {
      rejectionReasons.push(`Generation failed: ${(error as Error).message}`);
    }
  }

  // --- 4. SORT BY QUALITY ---
  approved.sort((a, b) => b.score - a.score);

  // --- 5. RETURN RESULTS ---
  const avgScore = approved.length > 0
    ? approved.reduce((a, b) => a + b.score, 0) / approved.length
    : 0;

  return {
    approved,
    stats: {
      totalAttempts,
      totalAccepted: approved.length,
      totalRejected: totalAttempts - approved.length,
      averageScore: avgScore,
      rejectionReasons: Array.from(new Set(rejectionReasons)), // deduplicate
    },
    designTokens: {
      layout,
      palette,
      fonts,
    },
  };
}

// ============================================================================
// HELPER: Get fingerprint from URL
// ============================================================================

async function getImageFingerprint(imageUrl: string): Promise<number[]> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      // Server-side: return empty fingerprint (novelty check skipped)
      resolve(new Array(16).fill(1 / 16));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, 64, 64);
      const imageData = ctx.getImageData(0, 0, 64, 64);
      resolve(generateFingerprint(imageData));
    };
    img.onerror = () => resolve(new Array(16).fill(1 / 16)); // fallback
    img.src = imageUrl;
  });
}

// ============================================================================
// QUICK MODE: Get design tokens only (no generation)
// Useful when you want the governor's layout/palette/font decisions
// but will handle generation yourself
// ============================================================================

export function getDesignTokens(category: string, overrides?: {
  layoutId?: string;
  paletteId?: string;
}) {
  const layout = overrides?.layoutId
    ? LAYOUTS[overrides.layoutId]
    : getLayoutsForCategory(category)[0];

  const palette = overrides?.paletteId
    ? PALETTES[overrides.paletteId]
    : getPalettesForCategory(category)[0];

  const fonts = getFontsForCategory(category)[0];

  const allLayouts = getLayoutsForCategory(category);
  const allPalettes = getPalettesForCategory(category);

  return {
    selected: { layout, palette, fonts },
    alternatives: {
      layouts: allLayouts,
      palettes: allPalettes,
    },
  };
}

// ============================================================================
// RE-EXPORT for convenience
// ============================================================================

export { getStats } from './seedManager';
