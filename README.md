# 🚀 Launchpad — AI Conference Generator

Generate professional conference websites in seconds. Enter a topic and city, and AI builds the entire event — speakers, venue, schedule, pricing, and a shareable public page.

## Features

- **Instant Generation** — Full conference page from just topic + city + date
- **🐝 Swarm Mode** — 5 parallel AI agents (Speaker, Venue, Schedule, Pricing, Branding)
- **Smart Fallback** — Works without any API keys using built-in databases
- **Stripe Checkout** — Ticket sales with Early Bird / Regular / VIP tiers
- **Shareable Pages** — Every event gets a public URL at `/e/[slug]`
- **Zero-Config Deploy** — Run standalone, or add Supabase/OpenAI/Stripe as needed

## Quick Start

```bash
git clone <your-repo-url>
cd conference-platform
npm install
npm run dev
```

Open http://localhost:3000 — everything works with zero API keys.

## Environment Variables

Copy `.env.example` to `.env.local`. **All optional:**

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | AI-generated content (falls back to smart defaults) |
| `NEXT_PUBLIC_SUPABASE_URL` | Persistent storage (falls back to in-memory) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server access |
| `STRIPE_SECRET_KEY` | Ticket payments |

## Deploy

**Vercel:** `npx vercel` → add env vars in dashboard
**Railway:** Push to GitHub → connect in railway.app
**Docker:** `docker build -t launchpad . && docker run -p 3000:3000 launchpad`

## 🐝 Swarm Mode

Toggle on the create form. 5 AI agents run in parallel via `Promise.all()`:

| Agent | Role | ~Speed |
|-------|------|--------|
| ✍️ Branding | Name, tagline, description | 2s |
| 🎤 Speakers | 8 diverse speakers | 3s |
| 🏛️ Venue | City-matched real venue | 1.5s |
| 📋 Schedule | 12-session full-day program | 3s |
| 💰 Pricing | Market-calibrated tiers | 1.5s |

Total: ~3-5s (parallel) vs ~10-15s (sequential). Requires `OPENAI_API_KEY`.

## Supabase Setup

Run `supabase-schema.sql` in your Supabase SQL Editor for persistent storage.

## Tech Stack

Next.js 16 · Tailwind v4 · Supabase · OpenAI GPT-4o-mini · Stripe · TypeScript

## License

MIT
