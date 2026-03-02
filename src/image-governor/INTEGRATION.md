# Image Governor — Integration Guide

## What This Is

The Image Governor is a **design governance layer** that sits between your apps and AI image generation.

**Before:** Your app asks AI for a "poster" → AI makes ugly choices → user sees garbage  
**After:** Your app asks the Governor → Governor constrains, generates, inspects, rejects bad ones → user only sees approved images assembled with programmatic typography

The AI never designs anything. It generates **backplates** (atmospheric backgrounds). Your **code** does the designing.

---

## Architecture

```
User picks event category + fills details
        ↓
Governor selects: Layout + Palette + Fonts
        ↓
Prompt Builder creates constrained backplate prompt
        ↓
AI generates background image (NOT a poster)
        ↓
Image Inspector checks: brightness, contrast, busyness, novelty
        ↓
Failed? → Auto-retry with perturbed seed (up to 12 attempts)
Passed? → Image enters approved pool
        ↓
PosterRenderer assembles: backplate + gradient + typography overlay
        ↓
User sees a finished, professional poster
```

---

## File Structure

```
image-governor/
├── index.ts                    # Single import point
├── config/
│   ├── layouts.ts              # 8 locked layout templates
│   ├── palettes.ts             # 12 curated color palettes
│   └── typography.ts           # 6 font pairings
├── lib/
│   ├── promptBuilder.ts        # Converts config → constrained AI prompts
│   ├── imageInspector.ts       # Canvas-based image quality analysis
│   ├── seedManager.ts          # Tracks seeds, prevents sameness
│   └── qualityGate.ts          # Master orchestrator
├── components/
│   └── PosterRenderer.tsx      # React component: backplate + text overlay
└── INTEGRATION.md              # This file
```

---

## Step-by-Step Integration

### 1. Copy into your project

Copy the `image-governor/` folder into your Next.js project root (or `src/`).

```bash
cp -r image-governor/ your-project/src/image-governor/
```

### 2. Basic Usage (Design Tokens Only)

If you just want the Governor's design decisions without image generation:

```tsx
import { getDesignTokens } from '@/image-governor';

// User selected "music" category
const tokens = getDesignTokens('music');

console.log(tokens.selected.layout);   // FULL_BLEED_OVERLAY
console.log(tokens.selected.palette);  // ELECTRIC_NIGHT
console.log(tokens.selected.fonts);    // BOLD_POSTER

// Show alternatives to user
console.log(tokens.alternatives.layouts);   // [FULL_BLEED_OVERLAY, TICKET_FLYER, CINEMA_WIDE]
console.log(tokens.alternatives.palettes);  // [ELECTRIC_NIGHT, SMOKE_NOIR, FESTIVAL_BRIGHT]
```

### 3. Full Generation Flow

```tsx
import { governorGenerate } from '@/image-governor';

// Your existing image generation function (wraps OpenAI, Stability, Replicate, etc.)
async function myImageGenerator(prompt: string, negativePrompt: string, seed: number): Promise<string> {
  // Call your AI image API here
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    body: JSON.stringify({ prompt, negative_prompt: negativePrompt, seed }),
  });
  const data = await response.json();
  return data.imageUrl;
}

// Ask the Governor for approved images
const result = await governorGenerate({
  category: 'music',
  eventDescription: 'Underground techno night in Brooklyn warehouse',
  intensity: 'bold',
  allowFaces: false,
  requestedCount: 3,
  maxAttempts: 12,
  generateImage: myImageGenerator,
});

// result.approved = array of 3 quality-checked images
// result.designTokens = { layout, palette, fonts }
// result.stats = { totalAttempts, accepted, rejected, reasons }
```

### 4. Render the Poster

```tsx
import { PosterRenderer } from '@/image-governor';

function EventPoster({ result }) {
  const { approved, designTokens } = result;
  const { layout, palette, fonts } = designTokens;

  return (
    <PosterRenderer
      imageUrl={approved[0].url}
      layout={layout}
      palette={palette}
      fonts={fonts}
      content={{
        title: 'WAREHOUSE TECHNO',
        subtitle: 'An underground experience',
        date: 'March 15, 2026',
        location: 'Brooklyn, NY',
        ctaText: 'Get Tickets →',
      }}
      width={800}
    />
  );
}
```

### 5. Let Users Choose Layout + Palette

```tsx
import { getLayoutsForCategory, getPalettesForCategory } from '@/image-governor';

function DesignPicker({ category }) {
  const layouts = getLayoutsForCategory(category);
  const palettes = getPalettesForCategory(category);

  return (
    <div>
      <h3>Choose Layout</h3>
      {layouts.map(l => (
        <button key={l.id} onClick={() => setLayout(l.id)}>
          {l.name} — {l.description}
        </button>
      ))}

      <h3>Choose Mood</h3>
      {palettes.map(p => (
        <button key={p.id} onClick={() => setPalette(p.id)}>
          <span style={{ background: p.accent, width: 20, height: 20, display: 'inline-block', borderRadius: '50%' }} />
          {p.name} — {p.description}
        </button>
      ))}
    </div>
  );
}
```

---

## Integration Per App

### Popup (popup-tawny-nu.vercel.app)

Popup already has 8 categories (Fashion, Food, Art, Wellness, Music, Markets, Tech, Literary).

**Where to wire:**
- When user selects a category → call `getDesignTokens(category)`
- When generating event page imagery → call `governorGenerate()` instead of direct image generation
- Replace inline stock photos with `PosterRenderer` component

**Key benefit:** Each category automatically gets appropriate layouts, palettes, and fonts instead of random Unsplash images.

### Jukebox (jukebox-blond.vercel.app)

Jukebox has the same category structure.

**Where to wire:**
- Same as Popup, but add album-cover square layouts (use `1:1` aspect ratio)
- Add `TICKET_FLYER` for vertical social media formats

### Launchpad (launchpad-conference-platform.vercel.app)

Launchpad is the most complex — it generates entire conference pages with speakers.

**Where to wire:**
- Conference hero images → `governorGenerate({ category: 'conference', allowFaces: false })`
- Speaker photos → **Do NOT generate faces.** Use monogram avatars or Unsplash editorial portraits with `inspectImageFromUrl()` to validate quality
- Session/track imagery → Use `governorGenerate()` with relevant sub-categories

**Critical:** Set `allowFaces: false` for conference backgrounds. AI faces in professional contexts destroy credibility.

---

## Tuning the Inspector

The image inspector has tunable thresholds in `lib/imageInspector.ts`:

```typescript
const THRESHOLDS = {
  MIN_COMPOSITE_SCORE: 55,        // Lower = more permissive
  TEXT_ZONE_MAX_BRIGHTNESS: 170,   // Lower = darker text zones required
  TEXT_ZONE_MAX_EDGE_DENSITY: 0.35, // Lower = calmer text zones
  MIN_CONTRAST_RATIO: 4.5,        // WCAG AA standard
  MAX_SIMILARITY_TO_RECENT: 0.85,  // Lower = more variety enforced
};
```

If too many images are being rejected, raise `MIN_COMPOSITE_SCORE` threshold slightly. If images still look bad, lower the text zone brightness limit.

---

## Without AI Generation (Stock Photo Mode)

You can use the Governor purely for design governance with stock photos:

```tsx
import { getDesignTokens, inspectImageFromUrl } from '@/image-governor';

const tokens = getDesignTokens('tech');
const { layout, palette, fonts } = tokens.selected;

// Check if a stock photo works with the layout
const inspection = await inspectImageFromUrl(
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920',
  layout,
  palette
);

if (inspection.passed) {
  // Use it with PosterRenderer
} else {
  console.log('Image failed:', inspection.failures);
  // Try a different stock photo
}
```

This lets you validate Unsplash images against your layout rules — rejecting ones where text zones would be unreadable.

---

## What This System Prevents

| Problem | How Governor Fixes It |
|---------|-----------------------|
| AI puts detail where text should go | Layout system defines text-free zones; inspector rejects violations |
| Every poster looks the same | Seed manager tracks fingerprints, rejects duplicates |
| Colors clash or look amateur | Curated palettes with WCAG-verified contrast |
| Fonts look random/generic | Locked pairings tested for each category |
| AI-generated faces look uncanny | `allowFaces: false` default; negative prompt enforcement |
| Bright backgrounds kill readability | Gradient overlays + brightness inspection in text zones |
| User sees bad generations | Inspector rejects before display; auto-retries silently |

---

## The Core Principle

**AI generates texture. Code designs the poster.**

The moment you let the model choose layout, typography, or color, quality collapses. The Governor ensures every visual decision is made by rules, not probability.
