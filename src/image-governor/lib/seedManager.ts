// ============================================================================
// IMAGE GOVERNOR — SEED MANAGER
// ============================================================================
// Tracks generation seeds and image fingerprints to prevent "AI sameness".
// If a new generation looks too similar to a recent one, it's rejected
// and regenerated with a perturbed seed.
// ============================================================================

export interface GenerationRecord {
  seed: number;
  timestamp: number;
  category: string;
  layoutId: string;
  paletteId: string;
  /** Simple perceptual fingerprint (brightness histogram) */
  fingerprint: number[];
  /** Composite quality score from inspector */
  qualityScore: number;
  /** Whether this was accepted or rejected */
  accepted: boolean;
}

// ============================================================================
// IN-MEMORY STORE (per session)
// For persistence across sessions, serialize to localStorage or DB
// ============================================================================

const MAX_HISTORY = 100;
let history: GenerationRecord[] = [];

/**
 * Add a generation record to history
 */
export function recordGeneration(record: GenerationRecord): void {
  history.push(record);
  if (history.length > MAX_HISTORY) {
    history = history.slice(-MAX_HISTORY);
  }
}

/**
 * Get generation history
 */
export function getHistory(): GenerationRecord[] {
  return [...history];
}

/**
 * Clear history
 */
export function clearHistory(): void {
  history = [];
}

// ============================================================================
// FINGERPRINTING
// Simple perceptual hash using brightness histogram
// ============================================================================

/**
 * Generate a simple brightness histogram fingerprint from ImageData
 * Returns array of 16 values representing brightness distribution
 */
export function generateFingerprint(imageData: ImageData): number[] {
  const bins = 16;
  const histogram = new Array(bins).fill(0);
  const totalPixels = imageData.width * imageData.height;

  for (let i = 0; i < imageData.data.length; i += 4) {
    const brightness = Math.floor(
      (0.299 * imageData.data[i] + 0.587 * imageData.data[i + 1] + 0.114 * imageData.data[i + 2])
      / 256 * bins
    );
    histogram[Math.min(brightness, bins - 1)]++;
  }

  // Normalize to 0-1
  return histogram.map(v => v / totalPixels);
}

/**
 * Generate fingerprint from canvas element
 */
export function fingerprintFromCanvas(canvas: HTMLCanvasElement): number[] {
  // Resize to small for speed
  const small = document.createElement('canvas');
  small.width = 64;
  small.height = 64;
  const ctx = small.getContext('2d')!;
  ctx.drawImage(canvas, 0, 0, 64, 64);
  const imageData = ctx.getImageData(0, 0, 64, 64);
  return generateFingerprint(imageData);
}

// ============================================================================
// SIMILARITY DETECTION
// ============================================================================

/**
 * Cosine similarity between two fingerprints
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
}

/**
 * Check if a new image is too similar to any recent accepted image
 */
export function isTooSimilar(
  newFingerprint: number[],
  threshold: number = 0.85,
  categoryFilter?: string
): { similar: boolean; mostSimilar: number; matchedSeed?: number } {
  const recent = history
    .filter(r => r.accepted)
    .filter(r => !categoryFilter || r.category === categoryFilter)
    .slice(-50); // check last 50 accepted

  let maxSim = 0;
  let matchedSeed: number | undefined;

  for (const record of recent) {
    const sim = cosineSimilarity(newFingerprint, record.fingerprint);
    if (sim > maxSim) {
      maxSim = sim;
      matchedSeed = record.seed;
    }
  }

  return {
    similar: maxSim > threshold,
    mostSimilar: maxSim,
    matchedSeed,
  };
}

// ============================================================================
// SEED PERTURBATION
// When an image is rejected for similarity, generate a new varied seed
// ============================================================================

/**
 * Generate a perturbed seed that's deterministic but different
 */
export function perturbSeed(originalSeed: number, attempt: number): number {
  // Use a simple hash-like perturbation
  const primes = [7919, 6271, 4969, 3571, 2689, 1949, 1523, 1151];
  const prime = primes[attempt % primes.length];
  return Math.abs((originalSeed * prime + attempt * 31337) % 999999999);
}

/**
 * Get a batch of unique seeds that haven't been used recently
 */
export function getUniqueSeedBatch(count: number, baseSeed?: number): number[] {
  const usedSeeds = new Set(history.map(r => r.seed));
  const seeds: number[] = [];
  let seed = baseSeed || Math.floor(Math.random() * 999999999);

  let attempts = 0;
  while (seeds.length < count && attempts < count * 10) {
    seed = perturbSeed(seed, attempts);
    if (!usedSeeds.has(seed)) {
      seeds.push(seed);
      usedSeeds.add(seed);
    }
    attempts++;
  }

  return seeds;
}

// ============================================================================
// STATISTICS
// ============================================================================

export function getStats(): {
  totalGenerated: number;
  totalAccepted: number;
  totalRejected: number;
  acceptanceRate: number;
  averageQuality: number;
  categoryBreakdown: Record<string, { count: number; avgQuality: number }>;
} {
  const accepted = history.filter(r => r.accepted);
  const rejected = history.filter(r => !r.accepted);

  const categoryBreakdown: Record<string, { count: number; avgQuality: number }> = {};
  for (const record of accepted) {
    if (!categoryBreakdown[record.category]) {
      categoryBreakdown[record.category] = { count: 0, avgQuality: 0 };
    }
    categoryBreakdown[record.category].count++;
    categoryBreakdown[record.category].avgQuality += record.qualityScore;
  }
  for (const cat of Object.keys(categoryBreakdown)) {
    categoryBreakdown[cat].avgQuality /= categoryBreakdown[cat].count;
  }

  return {
    totalGenerated: history.length,
    totalAccepted: accepted.length,
    totalRejected: rejected.length,
    acceptanceRate: history.length > 0 ? accepted.length / history.length : 0,
    averageQuality: accepted.length > 0
      ? accepted.reduce((a, b) => a + b.qualityScore, 0) / accepted.length
      : 0,
    categoryBreakdown,
  };
}
