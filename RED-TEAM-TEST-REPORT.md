# LAUNCHPAD RED TEAM TEST REPORT
**Date:** February 27, 2026  
**Site:** https://launchpad-conference-platform.vercel.app  
**Status:** Automated checks + codebase audit

---

## API ROUTES — ✅ ALL PASS

| Endpoint | Valid Request | Empty/Invalid | Notes |
|----------|---------------|---------------|-------|
| GET /api/stats | `{ events: 24, source: "supabase" }` | — | Real data from Supabase |
| POST /api/contact | `{ success: true }` | 400, "Name, email, and message required" | Resend + Supabase optional |
| POST /api/events/promote | `{ success: true, promo: {...} }` | 400, "Event name and topic required" | Template fallback when no OpenAI |
| GET /api/events/[slug] | Returns event or 404 | — | ai-festival-uk-2026 returns demo event |

---

## LANDING PAGE — VERIFIED VIA CODEBASE

| Check | Status | Notes |
|-------|--------|-------|
| Hero "Generate Your Event →" links to /create | ✅ | |
| "See Promotion Engine →" scrolls to #promotion | ✅ | Test plan says "See How It Works → #engine" — actual CTA is "See Promotion Engine" → #promotion |
| Social proof ticker | ✅ | Topic categories (AI & Machine Learning, Startup & Venture, etc.) — NOT TechCrunch/YC |
| 5 AI agent cards in Engine section | ✅ | Speaker, Venue, Schedule, Pricing, Branding |
| 6 PBot cards in Promotion Engine | ✅ | Social Blitz, Community, Email, Partners, SEO, Retargeting |
| GDPR + EU AI Act cards | ✅ | |
| "Events Generated" from /api/stats | ✅ | Uses `eventsCount` from API (24 in prod) |
| "50,000+ Attendees" / "$12M+ Revenue" labeled "Global event industry" | ✅ | |
| Nav "How It Works" scrolls to #how-it-works | ✅ | |
| Early Bird countdown | ⚠️ | Shows 0d0h0m0s if past March 28 — countdown end date is 2026-03-28 |
| Industry Data animated counters | ✅ | $2.1T, 67%, 54% — animate on scroll (IntersectionObserver) |

---

## EVENT PAGES — IMPORTANT ROUTING NOTE

**Demo events use dedicated pages, NOT the dynamic [slug] route:**

| URL | Route | Promote / Customize buttons? |
|-----|-------|------------------------------|
| /e/ai-festival-uk-2026 | `e/ai-festival-uk-2026/page.tsx` | ❌ No |
| /e/ai-summit-2026 | `e/ai-summit-2026/page.tsx` | ❌ No |
| /e/cybernova | `e/cybernova/page.tsx` | ❌ No |
| /e/startup-zaken | `e/startup-zaken/page.tsx` | ❌ No |
| /e/the-future-forum | `e/the-future-forum/page.tsx` | ❌ No |
| /e/an-evening-with | `e/an-evening-with/page.tsx` | ❌ No |
| /e/demo-conference | `e/demo-conference/page.tsx` | ❌ No |
| /e/[any-new-slug] | `e/[slug]/page.tsx` (dynamic) | ✅ Yes |

**Promote modal and Customize modal** only appear on events served by the dynamic route — i.e. **newly generated events** or events fetched from the API that don't have a dedicated page.

To test Promote/Customize: create a new event at /create (e.g. topic "AI", city "London") — the resulting event page will have both buttons.

---

## AI FESTIVAL UK — VERIFIED

| Check | Status |
|-------|--------|
| Schema.org JSON-LD | ✅ Injected via useEffect |
| document.title | ✅ "AI Festival UK 2026 — Bury St Edmunds \| Launchpad" |
| 10 speakers, 9 tracks | ✅ |
| Beyond the Festival tabs (Hotels/Dining/Coffee/Explore) | ✅ |
| Sponsor tiers | ✅ Platinum, Academic, Partner |
| Promote/Customize buttons | ❌ Not on this page (dedicated route) |

---

## MANUAL TESTING STILL NEEDED

These require a live browser (Chrome/Safari/Mobile):

1. **Visual & layout** — FOUC, readability, responsive breakpoints
2. **Accessibility panel** — Dyslexia, ADHD Focus, High Contrast, Reduced Motion, Google Translate
3. **Create page** — Form validation, XSS attempts, generation flow, swarm mode
4. **Promote modal** — Open on a *generated* event, Generate Kit, 6 tabs, copy buttons
5. **Customize modal** — Edit, save, persist
6. **Checkout flow** — Demo vs Stripe
7. **Secondary pages** — /about, /pricing, /blog, /contact, /faq, /roi, etc.
8. **404 handling** — /nonexistent, /e/nonexistent-event
9. **Lighthouse** — Performance, Accessibility, SEO
10. **Cross-browser** — Chrome, Safari, Firefox, Edge, mobile

---

## QUICK FIX SUGGESTIONS

1. **Early Bird countdown** — If past March 28, consider hiding or showing "Early bird ended" instead of 0d0h0m0s.
2. **Demo events + Promote/Customize** — Either add Promote/Customize to the 7 demo event pages, or document that they're only on generated events.
3. **Test plan wording** — "See How It Works → #engine" could be updated to "See Promotion Engine → #promotion" and "How It Works (nav) → #how-it-works".

---

## NEXT STEPS

1. Run full manual test suite in Chrome + Safari + Mobile
2. Run Lighthouse on /, /e/ai-festival-uk-2026, /create
3. Test XSS: create event with `<script>alert(1)</script>` in topic
4. Test form validation on /create and /contact
5. Collect bugs and bring to Cursor for fixes
