# Project Brief — Launchpad Conference Platform

Context for ongoing development. See also: `AI_INSTRUCTIONS.md`, `ARCHITECTURE.md`.

---

## AI Festival UK 2026 Page (`/e/ai-festival-uk-2026`)

Custom demo page with real event data. **What's working well:**
- Speakers section — 10 photos, names/roles/tracks correct
- Schedule with Day 1/Day 2 tabs
- Nav bar (Home, Hotels, Dining)
- Track pills, countdown timer
- Sponsors, tickets, venue, Stay & Explore

---

## Known Issues (AI Festival UK 2026)

### 1. Hero gradient — unreadable text
The title and description text are washed out by the hero background. The gradient overlay is not dark enough.

**Fix:** Use `rgba(4,4,14,0.5)` at top, `rgba(4,4,14,0.92)` at 70%, solid `#04040E` at bottom.

**File:** `src/app/e/ai-festival-uk-2026/page.tsx` — hero overlay `style` on the gradient div.

---

### 2. Random promo videos section
"AI Festival Promo 1–8" and "Bayou Scene" appear as static thumbnails in a grid. These are MP4 files rendered as images. They should **not** be on the AI Festival page.

**Fix:** Remove the promo video gallery from the AI Festival page. It may be pulling from a shared component (e.g. `DemoEventLayout.tsx`) or `video-catalog.ts` meant for the landing page. Ensure the AI Festival page does not include this section.

---

### 3. Hero image/video — wrong asset
The hero shows a red tricycle or other non–tech/AI imagery. Ken Burns slideshow or hero video may be loading the wrong asset.

**Fix:** Hero images/video must be tech/AI themed, not random Unsplash nature shots. Update the hero media source in `src/app/e/ai-festival-uk-2026/page.tsx` (currently uses lava video `9b68ed1f-ef9b-437c-b0bc-642f911e47a3_hd.mp4`). If the page inherits from a shared layout, ensure the AI Festival page overrides with appropriate tech/AI assets.

---

## Summary for Next Thread

1. **Hero gradient fix** — `rgba(4,4,14,0.5)` → `rgba(4,4,14,0.92)` at 70% → `#04040E` at bottom
2. **Remove video gallery section** from AI Festival page — it's pulling from shared promo catalog
3. **Hero images** — use tech/AI themed assets, not random nature shots
