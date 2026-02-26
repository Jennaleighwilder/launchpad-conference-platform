# Launchpad — Investor Specs & Product Readiness

**Document purpose:** Exact specifications of what was built, how it works, what is ready for immediate sale, and what must be done before production.

---

## 1. Executive Summary

**Launchpad** is an AI-powered Event Operating System that generates complete conference websites in 60 seconds. A user enters topic, city, date, and capacity — AI produces speakers, venue, schedule, pricing, and a shareable event page. The platform supports ticket sales, sponsor inquiries, affiliate programs, and event lifecycle automation.

**Tech stack:** Next.js 16, React 19, Tailwind v4, TypeScript, Supabase, OpenAI GPT-4o-mini, Stripe, Resend (email)

**Deployment:** Vercel-ready, standalone Docker build, cron for lifecycle

---

## 2. Architecture Overview

### 2.1 Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── create/             # Event creation wizard
│   ├── dashboard/          # Organizer event list
│   ├── e/[slug]/           # Dynamic event page + agenda
│   ├── e/demo-conference/  # Hardcoded demo event (SuperNova AI Summit)
│   ├── checkout/[slug]/    # Ticket checkout (event-specific)
│   ├── checkout/pro/       # Pro plan subscription checkout
│   ├── checkout/success/   # Post-purchase confirmation
│   ├── checkout/cancel/    # Checkout cancelled
│   ├── pricing/            # Pricing plans (Free/Pro/Enterprise)
│   ├── contact/            # Enterprise contact form
│   ├── sponsor/            # Sponsorship inquiry page
│   ├── affiliate/          # Affiliate program page
│   ├── speakers/           # All speakers grid
│   ├── speakers/[id]/      # Individual speaker profile
│   └── api/                # API routes
│       ├── events/         # List, generate, fetch by slug
│       ├── checkout/       # Stripe session creation
│       ├── stripe/webhook/ # Payment confirmation
│       ├── attendees/      # Check-in, QR
│       └── lifecycle/run/  # Hourly status transitions
├── lib/
│   ├── generate.ts         # Single-pass AI generation
│   ├── swarm.ts            # 5-agent parallel generation
│   ├── types.ts            # EventData, SpeakerData, etc.
│   ├── supabase.ts         # DB client
│   ├── stripe.ts           # Stripe client
│   ├── email.ts            # Resend ticket confirmation
│   ├── speaker-photos.ts   # Unsplash speaker images
│   └── lifecycle/          # Event status engine
└── data/
    └── speakers.ts         # Speaker database
```

### 2.2 Data Flow

```
User → Create Form → POST /api/events/generate
  → OpenAI (or fallback) → Event JSON
  → Supabase insert OR in-memory store
  → Redirect to /e/[slug]

User → Buy Ticket → POST /api/checkout (Stripe) OR mock /checkout/[slug]
  → Stripe Checkout Session OR mock form
  → Stripe webhook → attendees table + email
  → /checkout/success
```

---

## 3. Features Built — Complete Inventory

### 3.1 Pages (All Routes)

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Landing page: hero, Why Launchpad, How It Works, Choose Your Path, Testimonials, Experience (video + stats), Speakers, Event Showcase, Partners, Newsletter, Pricing, CTA, Footer | ✅ Live |
| `/create` | Event creation wizard: topic, city, date, capacity, budget, vibe, speakers_hint. Standard + Swarm mode toggle | ✅ Live |
| `/dashboard` | Organizer dashboard: list of generated events (from Supabase or memory) | ✅ Live |
| `/e/[slug]` | Dynamic event page: hero, speakers, schedule, venue, pricing, sponsor CTA, share | ✅ Live |
| `/e/demo-conference` | Hardcoded demo: SuperNova AI Summit 2026, 12 speakers, 8 sessions, 3 tiers | ✅ Live |
| `/e/[slug]/agenda` | Full agenda view for event | ✅ Live |
| `/checkout/[slug]` | Mock ticket checkout: event summary, card form, 2s delay → success | ✅ Demo only |
| `/checkout/pro` | Mock Pro subscription checkout ($29/mo) | ✅ Demo only |
| `/checkout/success` | Confirmation: ticket (event) or Pro plan activated | ✅ Live |
| `/checkout/cancel` | Checkout cancelled | ✅ Live |
| `/pricing` | Free / Pro / Enterprise plans with Choose Plan buttons | ✅ Live |
| `/contact` | Enterprise contact form: Name, Company, Email, Size, Message | ✅ Live |
| `/sponsor` | Sponsorship page: hero, benefits, tiers (Gold/Platinum/Diamond), inquiry modal, images | ✅ Live |
| `/affiliate` | Affiliate program: hero, 3 steps, testimonials, commission tiers, apply form | ✅ Live |
| `/speakers` | All 10 speakers grid with links to profiles | ✅ Live |
| `/speakers/[id]` | Speaker profile: bio, talk, panels, connect, more speakers | ✅ Live |
| `/integrations` | Integrations catalog (Slack, Stripe, Zoom, HubSpot, etc.) | ✅ Live |
| `/features` | Feature tabs: AI, Engagement, Networking, Registration, etc. | ✅ Live |

### 3.2 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/events` | GET | List all events (Supabase or memory) |
| `/api/events/generate` | POST | Create event via AI. `?mode=swarm` for 5-agent parallel |
| `/api/events/[slug]` | GET | Fetch single event (demo slugs, Supabase, memory) |
| `/api/events/swarm-status` | GET | Swarm progress (if used) |
| `/api/checkout` | POST | Create Stripe Checkout session (requires Stripe + Supabase) |
| `/api/stripe/webhook` | POST | Handle `checkout.session.completed` → attendees + email |
| `/api/attendees/checkin` | GET | Mark attendee checked in (`?attendee_id=`) |
| `/api/attendees/qr` | GET | Returns QR data URL for check-in (`?attendee_id=`) |
| `/api/lifecycle/run` | GET | Hourly cron: draft→planning→announcing→ticket_sales→live→completed |

### 3.3 Integrations

| Service | Purpose | Required? |
|---------|---------|-----------|
| **OpenAI** | AI generation (GPT-4o-mini). Fallback: built-in speaker/venue/schedule DB | Optional |
| **Supabase** | Events, attendees, lifecycle_log. Fallback: in-memory Map | Optional |
| **Stripe** | Real ticket payments. Fallback: mock checkout | Optional |
| **Resend** | Ticket confirmation email. Fallback: console log | Optional |

---

## 4. How It Works — Detailed Flows

### 4.1 Event Generation

1. User fills form on `/create` (topic, city, date, capacity, budget, vibe, speakers_hint).
2. `POST /api/events/generate` (or `?mode=swarm`).
3. **With OpenAI:** Single prompt → JSON (name, tagline, venue, tracks, speakers, schedule, pricing) OR 5 parallel agents (branding, speakers, venue, schedule, pricing).
4. **Without OpenAI:** Fallback uses `generate.ts` — topic-key detection, speaker DB, venue DB, schedule builder, default pricing.
5. Event saved to Supabase (if configured) or in-memory `memoryStore`.
6. Redirect to `/e/[slug]`.

### 4.2 Ticket Purchase — Two Modes

**Demo mode** (default: `NEXT_PUBLIC_DEMO_MODE !== 'false'`):

- Buy Ticket → `/checkout/[slug]?tier=X&price=Y`
- Mock form (name, email, card) → 2s delay → `/checkout/success?slug=...&tier=...&name=...&email=...`
- No Stripe, no DB. Confetti + fake ticket with QR.

**Production mode** (`NEXT_PUBLIC_DEMO_MODE=false`):

- Buy Ticket → `POST /api/checkout` with eventSlug, ticketType, buyerEmail, buyerName
- API creates Stripe Checkout session → redirect to Stripe
- Stripe webhook → insert `attendees`, send email via Resend
- Success URL: `/checkout/success?session_id=...`

### 4.3 Event Lifecycle (Cron)

- Vercel cron: `0 * * * *` → `/api/lifecycle/run` hourly
- Engine checks: date, core details, speaker count
- Transitions: `draft` → `planning` → `announcing` → `ticket_sales` → `live` → `completed`
- Requires Supabase + `lifecycle_log` table

### 4.4 Demo Events (Hardcoded)

API returns hardcoded data for slugs: `demo-conference`, `ai-summit-2026`, `the-future-forum`, `cybernova`, `startup-zaken`, `an-evening-with`. These bypass Supabase and memory.

---

## 5. What Is Ready for Immediate Sale

### 5.1 ✅ Ready (No Code Changes)

| Item | Notes |
|------|-------|
| **Landing page** | Full marketing site, all links wired |
| **Event creation** | Works with or without OpenAI |
| **Event pages** | Dynamic + demo-conference |
| **Speaker profiles** | 10 speakers, individual pages |
| **Pricing page** | Free → /create, Pro → /checkout/pro, Enterprise → /contact |
| **Sponsor page** | Inquiry form, tier cards, images |
| **Affiliate page** | Apply form, commission tiers |
| **Contact form** | Enterprise lead capture |
| **Mock checkout** | Full demo flow: event → checkout → success |
| **Pro checkout** | Mock $29/mo → success |

### 5.2 ⚠️ Requires Configuration (Env Vars)

| Item | Env Vars | Effort |
|------|----------|--------|
| **Real ticket sales** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_DEMO_MODE=false` | Low |
| **Persistent events** | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Low |
| **AI generation** | `OPENAI_API_KEY` | Low |
| **Ticket emails** | `RESEND_API_KEY`, `EMAIL_FROM` | Low |
| **Dashboard** | Supabase (events list) | Low |

### 5.3 ❌ Not Ready / Gaps

| Item | What's Missing |
|------|----------------|
| **Pro plan billing** | `/checkout/pro` is mock only. No Stripe subscription, no recurring billing |
| **Enterprise contact** | Form submits to state only. No CRM, no email to sales |
| **Affiliate tracking** | Apply form shows success. No affiliate links, no conversion tracking, no dashboard |
| **Documentation / API / Blog** | Nav links show "coming soon" alerts |
| **About / Contact / Privacy / Terms** | Footer links show "coming soon" alerts |
| **Ticket inventory** | No oversell protection. No `tickets_sold` or `capacity` enforcement |
| **Speaker confirmation** | No speaker invite/accept flow |
| **Media generation** | No auto-generated speaker cards, session graphics |
| **Custom branding** | Pro tier mentions it; not implemented |
| **Analytics dashboard** | Pro tier mentions it; not implemented |
| **API access** | Pro tier mentions it; no public API |
| **Swarm mode** | Works with OpenAI; no progress streaming or status API for long runs |

---

## 6. Data Model

### 6.1 EventData (TypeScript)

```ts
{
  id, slug, name, topic, city, date, capacity, budget, vibe,
  venue: { name, address, capacity_note? },
  tracks: string[],
  speakers: SpeakerData[],
  schedule: ScheduleItem[],
  pricing: { early_bird, regular, vip?, currency },
  description, tagline, topic_key,
  created_at, status, organizer_email?
}
```

**Status values:** `draft` | `planning` | `announcing` | `ticket_sales` | `live` | `completed` | `sold_out` | `past`

### 6.2 Supabase Tables (Expected)

- `events` — full event JSON
- `attendees` — event_id, email, name, ticket_type, stripe_session_id, payment_status, checkin_status
- `lifecycle_log` — event_id, from_status, to_status, action_key

---

## 7. Environment Variables Reference

| Variable | Purpose | Required For |
|----------|---------|--------------|
| `OPENAI_API_KEY` | AI generation | Swarm + standard AI mode |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Persistent events, checkout, lifecycle |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server key | Same |
| `NEXT_PUBLIC_ANON_KEY` | (if used) | Client-side Supabase |
| `STRIPE_SECRET_KEY` | Stripe API | Real checkout |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification | Payment confirmation |
| `RESEND_API_KEY` | Email sending | Ticket confirmation |
| `EMAIL_FROM` | Sender address | Resend |
| `NEXT_PUBLIC_APP_URL` | App base URL | Stripe success/cancel URLs |
| `NEXT_PUBLIC_DEMO_MODE` | `false` = real Stripe | Production checkout |

---

## 8. What Needs to Be Done — Prioritized

### P0 — Before First Paying Customer

1. **Stripe production** — Configure live keys, webhook, test full flow
2. **Supabase production** — Run migrations, verify events + attendees
3. **Set `NEXT_PUBLIC_DEMO_MODE=false`** for production
4. **Resend** — Configure domain, test ticket email

### P1 — Revenue & Retention

1. **Pro plan** — Stripe subscription product, `/checkout/pro` → real Stripe subscription
2. **Enterprise contact** — Webhook or Zapier to CRM, or email to sales
3. **Ticket inventory** — Add `tickets_sold` per tier, enforce capacity

### P2 — Growth & Trust

1. **Affiliate system** — Unique links, conversion tracking, `increment_conversion` RPC (schema exists)
2. **Documentation** — At least a basic docs page
3. **Privacy / Terms** — Legal pages

### P3 — Product Depth

1. **Custom branding** — Logo, colors for Pro
2. **Analytics** — Basic event views, ticket sales
3. **API** — Read-only event API for Pro
4. **Speaker flow** — Invite, accept, profile edit

---

## 9. Deployment

- **Vercel:** `npx vercel` — add env vars, crons run automatically
- **Docker:** `docker build -t launchpad . && docker run -p 3000:3000 launchpad`
- **Repo:** https://github.com/Jennaleighwilder/launchpad-conference-platform

---

## 10. Summary Table

| Category | Ready | Config Needed | Not Done |
|----------|-------|---------------|----------|
| **Marketing** | Landing, pricing, sponsor, affiliate, contact | — | Docs, API, Blog, About, Privacy, Terms |
| **Event creation** | Full flow, Swarm mode | OpenAI for AI | — |
| **Event pages** | Dynamic + demo | — | — |
| **Speakers** | Grid + profiles | — | — |
| **Checkout** | Mock (demo + Pro) | Stripe for real | Pro subscription, inventory |
| **Email** | Code exists | Resend | — |
| **Lifecycle** | Engine + cron | Supabase | — |
| **Affiliate** | Page + form | — | Links, tracking, payouts |

---

*Last updated: Feb 2026*
