# Changelog for Twan — Launchpad Updates

**Date:** February 2026

---

## 1. Landing Page — Restored Twan's Preferred Look

### Hero
- **Big conference photo background** — Full-bleed conference image (photo-1540575467063) with Ken Burns zoom animation
- **Centered layout** — Text and CTAs centered above the fold (no terminal on left/right)
- **Early bird countdown card** — Prominent card with:
  - Copy: *"This is an early bird version of the platform for free. After the countdown ends, the pricing model applies."*
  - Countdown to **March 28, 2026**
  - Days, hours, minutes, seconds
- **More info visible** — No empty space above the fold; content centered and readable

### New Features Layered On
- **Animated terminal** — Moved below hero in "See it in action" strip before social proof
- **Why Launchpad** — Section with image + feature list (unchanged)
- All existing sections: Promotion Engine, Industry Stats, How It Works, etc.

---

## 2. Investor Deck v3 (12 slides)

**File:** `Launchpad-Investor-Deck-v3.pptx`

### New Slides
- **Capital Requirements** — $750K seed, 18-month runway, allocation pie (Engineering 40%, Growth 25%, AI Infra 20%, Ops 15%)
- **MRR Projections** — $5K → $50K → $150K → $250K (Months 6, 12, 18, 24)
- **Promotion Engine** — 6 AI street-team bots (Social Blitz, Community Infiltrator, Email Outreach, Partner Network, SEO & Content, Retargeting)
- **Market Opportunity** — $2.1T market, 6.4% CAGR, cited sources
- **Business Model** — 4 pricing tiers (Free, Pro, Agency, Enterprise)

### Removed
- All quantum / Murderer's Lock content — focused 100% on event AI

### Updated Stats
- 34 pages, 11K+ lines, 11 APIs
- Dark theme, cyan accent (#4FFFDF)

---

## 3. Platform — Full Feature List

### Landing
- Hero with conference photo + Ken Burns + early bird countdown
- Social proof ticker
- Industry stats (cited)
- Promotion Engine (6 bots)
- Why Launchpad
- How It Works + 5-Agent Engine
- Choose Your Path
- Testimonials
- Experience the Energy (video + YouTube embeds)
- Speakers
- Event Showcase
- Partners
- Newsletter
- Pricing
- CTA

### Demo Events (6)
- AI Summit 2026, Demo Conference, CyberNova, Startup Zaken, An Evening With, The Future Forum
- Unique speakers, photos, bios, schedules per event
- YouTube embeds
- Audio replays (Demo Conference)
- Museum exhibits (Prisoner's Kaleidoscope, Game of Life)

### Accessibility
- ♿ button: Dyslexia Mode, ADHD Focus, High Contrast, Reduced Motion, text sizes

### Blog
- 16 articles with real sources and links
- Markdown-like renderer (## ** [] `code`)
- Audio support ( !audio:url )
- YouTube embeds ( !youtube:videoId )

---

## 4. Deploy

- **Build:** `npm run build` — clean
- **Deploy:** Push to GitHub → Vercel auto-deploys
- **Deck:** `Launchpad-Investor-Deck-v3.pptx` in project root

---

## 5. Quick Commands

```bash
# Build
npm run build

# Deploy (push to main)
git add . && git commit -m "..." && git push origin main

# Regenerate deck
.venv-deck/bin/python scripts/build-pitch-deck.py
```
