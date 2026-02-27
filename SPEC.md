# Launchpad — Full Product Specification

**Version:** 1.0  
**Last Updated:** February 2026  
**Purpose:** Marketing, investor, and development reference

---

## 1. Executive Summary

**Launchpad** is an AI-powered conference website generator. Users enter a topic, city, and date; the platform generates a complete, professional event page in under 60 seconds — including speakers, venue, schedule, pricing, and a shareable public URL. It works with zero API keys (smart fallbacks) or scales with OpenAI, Supabase, and Stripe for production use.

**Core value proposition:** Turn an idea into a live event page in 60 seconds. No design skills. No developer. No weeks of setup.

---

## 2. What It Does

### 2.1 Event Generation

| Input | Output |
|-------|--------|
| Topic (e.g., "AI in Healthcare") | Event name, tagline, description |
| City (e.g., "London") | City-matched venue with address |
| Date | Formatted date, countdown timer |
| Capacity (50–5,000) | Influences pricing and scale |
| Budget tier (Starter / Growth / Premium / Enterprise) | Ticket price ranges |
| Vibe (Professional / Builder / Academic / Festival) | Visual theme, tone |
| Optional speaker hints | Curated speaker lineup |

**Generated content:**
- **Speakers** — 8–12 diverse speakers with names, roles, bios, photos
- **Venue** — Real or plausible venue with address, capacity note
- **Schedule** — Full-day program (1–3 days) with times, titles, speakers, tracks
- **Pricing** — Early Bird, Regular, VIP tiers (market-calibrated)
- **Hero media** — Unique image or video per event (no reuse)
- **Visual theme** — 12 distinct themes (fonts, colors, overlays)

### 2.2 Swarm Mode (Pro)

5 parallel AI agents run simultaneously:

| Agent | Role | Typical time |
|-------|------|--------------|
| Branding | Name, tagline, description | ~2s |
| Speakers | 8 diverse speakers | ~3s |
| Venue | City-matched venue | ~1.5s |
| Schedule | Full program | ~3s |
| Pricing | Market-appropriate tiers | ~1.5s |

**Total:** ~3–5 seconds (parallel) vs ~10–15 seconds (sequential). Requires `OPENAI_API_KEY`.

### 2.3 Event Page Features

- **Hero** — Video or image, gradient overlay, countdown timer, live registration counter
- **Speakers** — Grid with photos, roles, talks, expandable bios
- **Schedule** — Day tabs, track colors, keynote badges
- **Venue** — Gallery, amenities, transport, embedded Google Map
- **Tickets** — Tier cards, Stripe Checkout integration
- **Local guide** — "Beyond the Festival" (Hotels, Dining, Coffee, Explore) for featured events
- **12 themes** — SuperNova, Editorial, Neon Brutalist, etc. — selected by topic × vibe × slug hash

### 2.4 Smart Fallbacks

- **No OpenAI key** — Built-in generation with topic/city/vibe logic; enhanced mode for Swarm
- **No Supabase** — In-memory event store; events persist for session
- **No Stripe** — Checkout shows "Coming soon" or email capture
- **Hero images** — Picsum fallback; Unsplash when configured; AI-generated when available

---

## 3. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript |
| AI | OpenAI GPT-4o-mini (optional) |
| Database | Supabase (optional) or in-memory |
| Payments | Stripe |
| Email | Resend |
| Deployment | Vercel, Railway, Docker |

**Key dependencies:** `openai`, `@supabase/supabase-js`, `stripe`, `resend`, `nanoid`, `qrcode`, `canvas-confetti`, `uuid`

---

## 4. Architecture

### 4.1 App Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing
│   ├── create/page.tsx     # Event creation form
│   ├── dashboard/page.tsx  # Organizer dashboard
│   ├── e/[slug]/page.tsx   # Dynamic event page
│   ├── e/ai-festival-uk-2026/  # Custom event (AI Festival)
│   ├── checkout/[slug]/    # Ticket checkout
│   ├── affiliate/          # Affiliate program
│   ├── pricing/            # Pricing plans
│   ├── features/           # Feature overview
│   ├── integrations/       # Integrations list
│   ├── blog/, careers/, community/, docs/, etc.
│   └── api/                # API routes
├── components/             # Reusable UI
├── contexts/               # React context (Accessibility)
├── lib/                    # Core logic
└── public/                 # Static assets, videos
```

### 4.2 API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/events/generate` | POST | Create event (standard or swarm) |
| `/api/events` | GET | List events (dashboard) |
| `/api/events/[slug]` | GET | Fetch single event |
| `/api/events/[slug]/blocks` | GET | Event content blocks |
| `/api/events/[slug]/hero` | GET | Hero media |
| `/api/checkout` | POST | Create Stripe Checkout session |
| `/api/stripe/webhook` | POST | Stripe webhooks |
| `/api/attendees/checkin` | POST | QR check-in |
| `/api/attendees/qr` | GET | Generate QR ticket |
| `/api/lifecycle/run` | POST | Event lifecycle automation |
| `/api/events/swarm-status` | GET | Swarm progress (SSE) |

### 4.3 Data Flow

1. **Create** → User submits form → `POST /api/events/generate` → `generateEvent()` or `runSwarm()` → Supabase or memory → Redirect to `/e/[slug]`
2. **Checkout** → User clicks Buy → `POST /api/checkout` → Stripe Checkout → Webhook → Success page
3. **Event page** → `GET /api/events/[slug]` → Render dynamic page with theme, schedule, speakers

---

## 5. User Flows

### 5.1 Organizer: Create Event

1. Go to `/create`
2. Enter topic, city, date; optionally capacity, budget, vibe, speaker hints
3. Toggle Swarm mode (Pro)
4. Submit → Progress UI → Redirect to `/e/[slug]`
5. Share link; optionally go to Dashboard to manage

### 5.2 Attendee: Buy Ticket

1. Land on event page `/e/[slug]`
2. Browse speakers, schedule, venue
3. Click "Buy Ticket" → Select tier → Enter name/email
4. Redirect to Stripe Checkout
5. Pay → Redirect to `/checkout/success` → Confetti, QR ticket (when implemented)

### 5.3 Affiliate: Earn Commission

1. Apply at `/affiliate`
2. Get unique link
3. Share → Referrals sign up for Pro → 40% recurring commission, paid monthly

---

## 6. Business Model

### 6.1 Pricing Plans

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 event, AI generation, shareable page, in-memory storage |
| **Pro** | $29/mo | Unlimited events, Supabase, custom branding, Swarm mode, analytics, API, OG cards |
| **Enterprise** | Custom | Everything in Pro + dedicated support, SLA, white-label, custom AI |

### 6.2 Affiliate Program

- **Commission:** 40% recurring on Pro subscriptions
- **Refer-a-friend:** Referrer gets 40%; referred gets 20% off first month
- **Tiers:** Standard (1–50), Influencer (50–500), Partner (500+)
- **Payout:** Monthly, no cap

### 6.3 Revenue Streams

1. Pro subscriptions ($29/mo)
2. Enterprise contracts
3. Ticket fees (configurable; Stripe handles processing)

---

## 7. Features (Implemented vs Roadmap)

### Implemented

- AI event generation (standard + swarm)
- 12 visual themes
- Dynamic event pages (`/e/[slug]`)
- Stripe Checkout
- QR tickets (API)
- Check-in API
- Dashboard (event list)
- Affiliate landing page
- Accessibility panel (Dyslexia, ADHD, High Contrast, Reduced Motion, Text size, Google Translate)
- LiveChat widget
- Custom events (AI Festival UK 2026, Demo Conference, etc.)
- Video hero support (MP4/WebM)
- Particle network, scroll-reveal, speaker hover effects
- Event lifecycle engine (Supabase)
- Resend email

### Roadmap (from Features page)

- Live Q&A, polls, social wall
- Attendee networking (matchmaking, 1:1 meetings)
- Email marketing automation
- A/B testing, SMS campaigns
- Hybrid/virtual sessions (Zoom, YouTube, Vimeo)
- Sponsor management
- Advanced analytics

---

## 8. Integrations

| Category | Integrations |
|----------|--------------|
| **Payments** | Stripe (LIVE), PayPal (LIVE) |
| **Backend** | Supabase (LIVE) |
| **Video** | Zoom, YouTube, Vimeo, Twitch (BETA) |
| **CRM** | HubSpot, Salesforce (Enterprise) |
| **Marketing** | Mailchimp, Zapier |
| **Design** | Canva (BETA), Figma (BETA) |
| **Security** | Okta SSO (Enterprise) |
| **Data** | Airtable, Eventbrite (BETA) |

---

## 9. Accessibility & Compliance

### 9.1 Accessibility Panel (♿)

- **Dyslexia Mode** — OpenDyslexic font, wider spacing
- **ADHD Focus** — No animations, narrow text
- **High Contrast** — Enhanced contrast
- **Reduced Motion** — Disables motion
- **Text Size** — Normal, Large, Extra Large
- **Language** — Google Translate (10 languages)

### 9.2 Implementation

- Fixed FAB at `bottom-24 right-6` (above LiveChat)
- `z-[9999]` for visibility
- Persisted via `AccessibilityContext`

---

## 10. Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `OPENAI_API_KEY` | AI generation (Swarm, enhanced) | No (fallback) |
| `NEXT_PUBLIC_SUPABASE_URL` | Database | No (in-memory) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase | No |
| `STRIPE_SECRET_KEY` | Payments | No (checkout disabled) |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | For production |
| `NEXT_PUBLIC_APP_URL` | Checkout redirect base | For Stripe |
| `RESEND_API_KEY` | Transactional email | No |

---

## 11. Deployment

- **Vercel:** `npx vercel` → add env vars
- **Railway:** Push to GitHub → connect repo
- **Docker:** `docker build -t launchpad . && docker run -p 3000:3000 launchpad`

---

## 12. Key Files for Developers

| File | Purpose |
|------|---------|
| `src/lib/generate.ts` | Standard event generation |
| `src/lib/swarm.ts` | 5-agent parallel generation |
| `src/lib/event-themes.ts` | 12 theme definitions |
| `src/lib/types.ts` | EventData, SpeakerData, etc. |
| `src/lib/hero-images.ts` | Hero image resolution |
| `src/lib/hero-videos.ts` | Hero video resolution |
| `src/lib/stripe.ts` | Stripe client |
| `src/lib/supabase.ts` | Supabase client |
| `src/app/e/[slug]/page.tsx` | Dynamic event page (~1,400 lines) |
| `src/app/create/page.tsx` | Create form + Swarm UI |
| `supabase/migrations/` | Schema (events, attendees, lifecycle) |

---

## 13. Demo Events

Pre-built event pages for showcase:

- `ai-festival-uk-2026` — AI Festival UK (custom, full design)
- `the-future-forum` — Gen Z, Tokyo
- `cybernova` — Hacker vibes, Berlin
- `ai-summit-2026` — Flagship, SF
- `startup-zaken` — Dutch biz, Amsterdam
- `an-evening-with` — Intimate keynote, London
- `demo-conference` — Tech immersive, Amsterdam

---

*This document is maintained as the single source of truth for Launchpad's capabilities, architecture, and roadmap.*
