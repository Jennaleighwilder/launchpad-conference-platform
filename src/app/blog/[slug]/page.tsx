import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/data/blog-posts';

const ARTICLE_CONTENT: Record<string, string> = {
  'meet-jennifer-west': `
Jennifer West grew up in rural Tennessee. Neurodivergent cognition shaped how she learns and builds — pattern-first, systems-oriented, with an ability to hold complex architectures in her head.

**24 million tokens in 63 days.** That's the scale of her work on Mirror Protocol™ and The Forgotten Code Research Institute — cross-platform AI modification, security research, and infrastructure that doesn't break.

The Murderer's Lock is her most recent build: an unbreakable lock using Argon2id (64MB memory), AES-256-GCM, WebAuthn with counter enforcement, and atomic single-use challenges. No downgrade attacks. No replay. Red-team tested with Playwright CI.

Launchpad is the next chapter — AI-powered conference generation that replaces 6-month planning cycles with 60-second drafts. Same rigor. Same obsession with systems that work.
  `,
  'murderers-lock-build': `
The Murderer's Lock is a security research project demonstrating what "unbreakable" looks like when you design for threat models most products ignore.

**Argon2id at 64MB** — memory-hard hashing that makes GPU/ASIC attacks impractical. **AES-256-GCM** — authenticated encryption with no room for tampering. **WebAuthn with counter enforcement** — hardware-backed auth that detects cloning. **Atomic single-use challenges** — no replay, no downgrade. **Graduated lockjaw** — escalation from soft to hard lock. **Shamir recovery** — distributed key recovery without a single point of failure.

We ran Playwright-based red-team CI. Every attack vector we could think of — replay, downgrade, timing — gets tested on every commit. The live demo is available for security researchers.
  `,
  'ai-replacing-event-planning': `
Event planning used to mean months of spreadsheets, venue hunting, and speaker outreach. Today, AI can generate a complete conference — name, venue, speakers, schedule, pricing — in under a minute.

**The old way:** 6+ months of planning, $50K+ in coordination costs, and endless back-and-forth with vendors. **The new way:** Describe your event, hit generate, and get a production-ready event page.

We built Launchpad to bridge that gap. Our AI understands conference structure: keynote slots, panel formats, workshop tracks, networking breaks. It knows real venues in major cities. It generates diverse, credible speaker rosters. And it does it all in parallel — 5 specialized agents working simultaneously.

The result isn't a generic template. It's a tailored conference that matches your topic, vibe, and budget. **90% of event planning is mechanical** — venue research, speaker outreach, schedule drafting, pricing tiers. AI can do that in parallel. Our swarm architecture runs 5 agents at once. The new customize layer lets you tweak name, tagline, accent color, and section order without regenerating. Industry cost analysis: $50K–150K per 500-person event in coordination alone. Launchpad collapses that to minutes.

Investors, startups, and enterprises are already using it to ship events 10x faster.
  `,
  'zero-to-production': `
We built Launchpad to prove a point: AI-assisted development can ship production software fast. **Stack:** Next.js 16, Vercel, Stripe, Supabase. **Architecture:** 5 parallel swarm agents (speakers, venue, schedule, pricing, branding), smart fallback when OpenAI isn't configured, in-memory store when Supabase isn't. **Scope:** 34 pages, 11 API routes, 0 TypeScript errors. **What it proves:** A single developer with the right tools can build a full SaaS in weeks, not months. The customize layer, blog, community, ROI calculator — all added in days. This is the new normal.
  `,
  'swarm-ai-deep-dive': `
Launchpad's Swarm AI runs 5 specialized agents in parallel. Each agent owns one domain: speakers, venue, schedule, pricing, branding. They don't wait for each other — they all fire at once.

**Speaker Agent** curates 8 diverse speakers with names, roles, and bios. **Venue Agent** picks a real venue in your city. **Schedule Agent** builds a 12-session day from 9AM to 6PM. **Pricing Agent** sets tier pricing based on budget. **Branding Agent** generates name, tagline, and description.

Results merge in under 30 seconds. If any agent fails, smart fallbacks fill the gap. No OpenAI key? We have a full fallback generator with 60 speakers across 6 topic categories.

The architecture is designed for speed and reliability. Investors love seeing real AI, not mockups.
  `,
  'conference-budget-guide-2026': `
Planning a conference in 2026? Here's a practical budget breakdown.

**Venue (25–35%):** Convention centers run $5–15 per sq ft. For 500 attendees, budget $15K–40K. **AV & Tech (10–15%):** Mics, screens, livestream. $5K–15K for mid-size. **Catering (15–25%):** Coffee, lunch, breaks. $25–50 per head. **Speakers (0–20%):** Keynotes can be $10K–50K; many accept exposure. **Marketing (10–15%):** Ads, design, swag. **Staff & Ops (10–20%):** Coordination, check-in, support.

Total for a 500-person single-day event: $50K–150K depending on city and polish. Use Launchpad to generate a baseline, then adjust.
  `,
  'hybrid-events-playbook': `
Hybrid events serve in-person and virtual attendees. The playbook:

**1. One registration, two experiences.** Same ticket, different access. In-person gets the room; virtual gets a livestream link.

**2. Dedicated virtual host.** Someone who monitors chat, reads questions aloud, and keeps remote attendees engaged.

**3. Replay everything.** Record keynotes and panels. Virtual attendees in different time zones will watch async.

**4. Networking for both.** In-person: lunch tables, breaks. Virtual: breakout rooms, Slack/Discord, matchmaking tools.

**5. Test the tech.** Run a dry run 24h before. Zoom, YouTube, Vimeo — whatever you use, verify it works.
  `,
  'attendee-engagement-metrics': `
Beyond ticket sales, measure what matters:

**Check-in rate:** Did they show up? **Session attendance:** Which talks drew crowds? **Networking activity:** How many 1:1s or connections? **Q&A participation:** Questions submitted, upvoted. **Poll responses:** Real-time engagement. **App usage:** Agenda views, map opens, chat messages. **NPS post-event:** Would they recommend?

Launchpad tracks these through QR check-in, session data, and post-event surveys. The goal: not just attendance, but active participation.
  `,
  'speaker-curation-engine': `
Our speaker curation engine balances three inputs: topic relevance, diversity (gender, ethnicity, role), and credibility (real-sounding titles and companies).

For AI generation, we prompt for "industry leaders, academics, and practitioners" with "gender/ethnic diversity." For fallback mode, we maintain a database of 60 speakers across 6 topics — AI, Web3, Climate, Health, Fintech, General. Each has a name, role, and professional photo from our Unsplash pool.

We never reuse the same speaker twice in one event. Fisher-Yates shuffle picks 8, then we assign photos. The result feels curated, not random.
  `,
  'modern-event-tech-stack': `
The modern event stack: **Registration** — Launchpad, Eventbrite, Tito. **Payments** — Stripe. **Check-in** — QR codes, NFC. **Livestream** — Zoom, YouTube, Vimeo. **Q&A** — Slido, Mentimeter. **Networking** — Brella, Grip, our built-in matchmaking. **Analytics** — Mixpanel, PostHog, custom dashboards.

Launchpad integrates with 20+ tools. We generate the event; you connect the rest. API-first design means you can push events to any platform.
  `,
  'launch-announcement': `
We're live. Launchpad generates complete conferences in 60 seconds — name, venue, speakers, schedule, pricing. No spreadsheets. No 6-month planning cycles.

We built this because event planning is broken. Great ideas get stuck in coordination hell. We're fixing that with AI. Built by Jennifer West.

Try it: [Create your event](/create). No credit card. No commitment. See what a full conference looks like in under a minute.

— The Launchpad Team
  `,
};

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = ARTICLE_CONTENT[post.slug] || post.excerpt;

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/blog" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-accent)' }}>← Back to Blog</Link>
        <span className="text-xs uppercase tracking-wider px-2 py-1 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{post.category}</span>
        <h1 className="text-4xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>{post.title}</h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>{post.date} · {post.author}</p>
        <div className="rounded-xl overflow-hidden mb-12" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <Image src={post.image} alt="" width={800} height={450} className="w-full h-64 md:h-80 object-cover" />
        </div>
        <div className="prose prose-invert max-w-none" style={{ color: 'var(--color-text)' }}>
          {content.split('\n\n').map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed">
              {para.split('**').map((seg, j) => (j % 2 === 1 ? <strong key={j}>{seg}</strong> : seg))}
            </p>
          ))}
        </div>
        <div className="mt-12 pt-8 flex gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--color-accent)' }}>Share on X</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent((process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app') + '/blog/' + slug)}`} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: 'var(--color-accent)' }}>Share on LinkedIn</a>
        </div>
      </article>
    </main>
  );
}
