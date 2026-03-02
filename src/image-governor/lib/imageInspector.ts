// ============================================================================
// IMAGE GOVERNOR — IMAGE INSPECTOR
// ============================================================================
// This is the "stupid choice" kill switch.
// Every generated image runs through this BEFORE a user ever sees it.
// Bad images are rejected and regenerated automatically.
// ============================================================================

import { type LayoutTemplate } from '../config/layouts';
import { type ColorPalette } from '../config/palettes';

// ============================================================================
// INSPECTION RESULT
// ============================================================================

export interface InspectionResult {
  passed: boolean;
  score: number;             // 0–100 composite quality score
  scores: {
    brightness: number;      // 0–100
    contrast: number;        // 0–100
    textZoneClarity: number; // 0–100
    composition: number;     // 0–100
    novelty: number;         // 0–100
  };
  failures: string[];        // human-readable failure reasons
  warnings: string[];        // non-blocking concerns
}

// ============================================================================
// THRESHOLDS (tunable)
// ============================================================================

const THRESHOLDS = {
  /** Minimum composite score to pass */
  MIN_COMPOSITE_SCORE: 55,
  /** Max brightness (0-255) in text safe zones */
  TEXT_ZONE_MAX_BRIGHTNESS: 170,
  /** Min brightness variance required (prevents solid-color generations) */
  MIN_BRIGHTNESS_VARIANCE: 15,
  /** Max edge density in text zones (0-1 scale) */
  TEXT_ZONE_MAX_EDGE_DENSITY: 0.35,
  /** Min contrast ratio for text readability (WCAG AA) */
  MIN_CONTRAST_RATIO: 4.5,
  /** Max similarity to recent images (cosine, 0-1) */
  MAX_SIMILARITY_TO_RECENT: 0.85,
  /** Max saturation in text zones (0-255) */
  TEXT_ZONE_MAX_SATURATION: 180,
};

// ============================================================================
// CANVAS-BASED IMAGE ANALYSIS
// Works in browser (Next.js client) or Node with node-canvas
// ============================================================================

/**
 * Analyze an image using Canvas API
 * Returns pixel data for a given zone
 */
function getZonePixels(
  imageData: ImageData,
  imgWidth: number,
  imgHeight: number,
  zone: { x: number; y: number; width: number; height: number }
): Uint8ClampedArray {
  const startX = Math.floor((zone.x / 100) * imgWidth);
  const startY = Math.floor((zone.y / 100) * imgHeight);
  const endX = Math.floor(((zone.x + zone.width) / 100) * imgWidth);
  const endY = Math.floor(((zone.y + zone.height) / 100) * imgHeight);

  const pixels: number[] = [];
  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (y * imgWidth + x) * 4;
      pixels.push(imageData.data[idx]);     // R
      pixels.push(imageData.data[idx + 1]); // G
      pixels.push(imageData.data[idx + 2]); // B
      pixels.push(imageData.data[idx + 3]); // A
    }
  }
  return new Uint8ClampedArray(pixels);
}

/**
 * Calculate average brightness of pixel array (R,G,B,A format)
 */
function averageBrightness(pixels: Uint8ClampedArray): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    // Perceived brightness formula
    sum += (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
    count++;
  }
  return count > 0 ? sum / count : 0;
}

/**
 * Calculate brightness variance (measures "busyness")
 */
function brightnessVariance(pixels: Uint8ClampedArray): number {
  const avg = averageBrightness(pixels);
  let sumDiffSq = 0;
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const b = 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
    sumDiffSq += (b - avg) ** 2;
    count++;
  }
  return count > 0 ? Math.sqrt(sumDiffSq / count) : 0;
}

/**
 * Calculate average saturation
 */
function averageSaturation(pixels: Uint8ClampedArray): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i] / 255;
    const g = pixels[i + 1] / 255;
    const b = pixels[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const s = max === min ? 0 : (l > 0.5 ?
      (max - min) / (2 - max - min) :
      (max - min) / (max + min));
    sum += s * 255;
    count++;
  }
  return count > 0 ? sum / count : 0;
}

/**
 * Simple edge detection score (Sobel-like)
 * Returns 0-1 where higher = more edges = more "busy"
 */
function edgeDensity(
  imageData: ImageData,
  imgWidth: number,
  imgHeight: number,
  zone: { x: number; y: number; width: number; height: number }
): number {
  const startX = Math.max(1, Math.floor((zone.x / 100) * imgWidth));
  const startY = Math.max(1, Math.floor((zone.y / 100) * imgHeight));
  const endX = Math.min(imgWidth - 1, Math.floor(((zone.x + zone.width) / 100) * imgWidth));
  const endY = Math.min(imgHeight - 1, Math.floor(((zone.y + zone.height) / 100) * imgHeight));

  let edgeCount = 0;
  let totalPixels = 0;

  for (let y = startY; y < endY; y += 2) { // sample every other pixel for speed
    for (let x = startX; x < endX; x += 2) {
      const idx = (y * imgWidth + x) * 4;
      const idxRight = (y * imgWidth + (x + 1)) * 4;
      const idxDown = ((y + 1) * imgWidth + x) * 4;

      const current = 0.299 * imageData.data[idx] + 0.587 * imageData.data[idx + 1] + 0.114 * imageData.data[idx + 2];
      const right = 0.299 * imageData.data[idxRight] + 0.587 * imageData.data[idxRight + 1] + 0.114 * imageData.data[idxRight + 2];
      const down = 0.299 * imageData.data[idxDown] + 0.587 * imageData.data[idxDown + 1] + 0.114 * imageData.data[idxDown + 2];

      const gradient = Math.abs(current - right) + Math.abs(current - down);
      if (gradient > 30) edgeCount++; // threshold for "edge"
      totalPixels++;
    }
  }

  return totalPixels > 0 ? edgeCount / totalPixels : 0;
}

// ============================================================================
// MAIN INSPECTION FUNCTION
// ============================================================================

export async function inspectImage(
  imageSource: HTMLCanvasElement | ImageData,
  layout: LayoutTemplate,
  palette: ColorPalette,
  recentEmbeddings?: number[][] // for novelty check
): Promise<InspectionResult> {

  const failures: string[] = [];
  const warnings: string[] = [];

  // --- Get ImageData ---
  let imageData: ImageData;
  let imgWidth: number;
  let imgHeight: number;

  if (imageSource instanceof HTMLCanvasElement) {
    const ctx = imageSource.getContext('2d')!;
    imgWidth = imageSource.width;
    imgHeight = imageSource.height;
    imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
  } else {
    imageData = imageSource;
    imgWidth = imageData.width;
    imgHeight = imageData.height;
  }

  // ================================================================
  // CHECK 1: TEXT ZONE BRIGHTNESS
  // Text areas must not be too bright (makes text unreadable)
  // ================================================================
  let textZoneBrightnessScore = 100;
  for (const zone of layout.textSafeZones) {
    const zonePixels = getZonePixels(imageData, imgWidth, imgHeight, zone);
    const avgBright = averageBrightness(zonePixels);

    if (avgBright > THRESHOLDS.TEXT_ZONE_MAX_BRIGHTNESS) {
      failures.push(`Text zone too bright (${avgBright.toFixed(0)}/255, max ${THRESHOLDS.TEXT_ZONE_MAX_BRIGHTNESS})`);
      textZoneBrightnessScore = Math.max(0, 100 - ((avgBright - THRESHOLDS.TEXT_ZONE_MAX_BRIGHTNESS) * 2));
    }

    const saturation = averageSaturation(zonePixels);
    if (saturation > THRESHOLDS.TEXT_ZONE_MAX_SATURATION) {
      warnings.push(`High saturation in text zone (${saturation.toFixed(0)})`);
      textZoneBrightnessScore = Math.max(0, textZoneBrightnessScore - 10);
    }
  }

  // ================================================================
  // CHECK 2: OVERALL CONTRAST / NOT A SOLID COLOR
  // Image must have enough variance to look like a real photograph
  // ================================================================
  const fullPixels = getZonePixels(imageData, imgWidth, imgHeight, { x: 0, y: 0, width: 100, height: 100 });
  const variance = brightnessVariance(fullPixels);
  let contrastScore = 100;

  if (variance < THRESHOLDS.MIN_BRIGHTNESS_VARIANCE) {
    failures.push(`Image too flat/uniform (variance ${variance.toFixed(1)}, need ${THRESHOLDS.MIN_BRIGHTNESS_VARIANCE})`);
    contrastScore = 20;
  } else {
    contrastScore = Math.min(100, (variance / 60) * 100);
  }

  // ================================================================
  // CHECK 3: TEXT ZONE BUSYNESS (edge density)
  // Text zones must not have too many edges/details
  // ================================================================
  let textZoneClarityScore = 100;
  for (const zone of layout.textSafeZones) {
    const density = edgeDensity(imageData, imgWidth, imgHeight, zone);
    if (density > THRESHOLDS.TEXT_ZONE_MAX_EDGE_DENSITY) {
      failures.push(`Text zone too busy (edge density ${(density * 100).toFixed(0)}%, max ${THRESHOLDS.TEXT_ZONE_MAX_EDGE_DENSITY * 100}%)`);
      textZoneClarityScore = Math.max(0, 100 - ((density - THRESHOLDS.TEXT_ZONE_MAX_EDGE_DENSITY) * 200));
    }
  }

  // ================================================================
  // CHECK 4: COMPOSITION BALANCE
  // Image shouldn't be too centered (dead) or too skewed
  // ================================================================
  let compositionScore = 80; // default decent

  // Check 3x3 grid balance
  const gridScores: number[] = [];
  for (let gy = 0; gy < 3; gy++) {
    for (let gx = 0; gx < 3; gx++) {
      const gridZone = { x: gx * 33.3, y: gy * 33.3, width: 33.3, height: 33.3 };
      const gridPixels = getZonePixels(imageData, imgWidth, imgHeight, gridZone);
      gridScores.push(brightnessVariance(gridPixels));
    }
  }

  // Center (index 4) shouldn't dominate
  const centerScore = gridScores[4];
  const avgOther = gridScores.filter((_, i) => i !== 4).reduce((a, b) => a + b, 0) / 8;
  if (centerScore > avgOther * 2) {
    warnings.push('Visual weight concentrated in center');
    compositionScore = 60;
  }

  // ================================================================
  // CHECK 5: NOVELTY (similarity to recent generations)
  // ================================================================
  let noveltyScore = 100;
  // In a real implementation, you'd compute image embeddings and check
  // cosine similarity. For now, this is a placeholder that accepts.
  // The seedManager handles this at the generation level.

  // ================================================================
  // COMPOSITE SCORE
  // ================================================================
  const compositeScore = Math.round(
    (textZoneBrightnessScore * 0.30) +
    (contrastScore * 0.15) +
    (textZoneClarityScore * 0.30) +
    (compositionScore * 0.15) +
    (noveltyScore * 0.10)
  );

  const passed = compositeScore >= THRESHOLDS.MIN_COMPOSITE_SCORE && failures.length === 0;

  return {
    passed,
    score: compositeScore,
    scores: {
      brightness: textZoneBrightnessScore,
      contrast: contrastScore,
      textZoneClarity: textZoneClarityScore,
      composition: compositionScore,
      novelty: noveltyScore,
    },
    failures,
    warnings,
  };
}

// ============================================================================
// CONVENIENCE: Load image from URL and inspect
// ============================================================================

export async function inspectImageFromUrl(
  imageUrl: string,
  layout: LayoutTemplate,
  palette: ColorPalette,
): Promise<InspectionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      resolve(inspectImage(canvas, layout, palette));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
}
