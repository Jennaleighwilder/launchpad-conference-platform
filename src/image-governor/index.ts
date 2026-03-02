// ============================================================================
// IMAGE GOVERNOR — MAIN INDEX
// ============================================================================
// Single import point for all governor functionality.
//
// Usage in your apps (Popup, Jukebox, Launchpad):
//
//   import { governorGenerate, getDesignTokens } from '@/image-governor';
//
// ============================================================================

// --- Core Governor ---
export {
  governorGenerate,
  getDesignTokens,
  getStats,
  type GovernorRequest,
  type GovernorResult,
  type ApprovedImage,
} from './lib/qualityGate';

// --- Config ---
export {
  LAYOUTS,
  getAllLayouts,
  getLayoutsForCategory,
  type LayoutTemplate,
} from './config/layouts';

export {
  PALETTES,
  getAllPalettes,
  getPalettesForCategory,
  type ColorPalette,
} from './config/palettes';

export {
  FONT_PAIRINGS,
  getFontsForCategory,
  type FontPairing,
} from './config/typography';

// --- Prompt Building ---
export {
  buildBackplatePrompt,
  buildNegativePrompt,
  buildPromptBatch,
  type PromptConfig,
} from './lib/promptBuilder';

// --- Image Inspection ---
export {
  inspectImage,
  inspectImageFromUrl,
  type InspectionResult,
} from './lib/imageInspector';

// --- Seed Management ---
export {
  recordGeneration,
  generateFingerprint,
  fingerprintFromCanvas,
  isTooSimilar,
  perturbSeed,
  getUniqueSeedBatch,
  clearHistory,
} from './lib/seedManager';

// --- Renderer ---
export { default as PosterRenderer } from './components/PosterRenderer';
export type { PosterContent, PosterRendererProps } from './components/PosterRenderer';

// --- Launchpad topic hero pools ---
export { getHeroPoolForTopic, getUniqueHeroForEvent } from './config/stockImages';
