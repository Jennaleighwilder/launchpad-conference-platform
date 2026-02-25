'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEMO_EVENTS = [
  { slug: 'the-future-forum', name: 'The Future Forum', date: 'March 23, 2026', desc: 'For students & young leaders', color: '#FBBF24' },
  { slug: 'cybernova', name: 'CyberNova', date: 'March 24, 2026', desc: 'Cybersecurity deep-dive', color: '#60A5FA' },
  { slug: 'ai-summit-2026', name: 'AI Summit 2026', date: 'March 25-26, 2026', desc: 'The flagship 2-day conference', color: '#A78BFA' },
  { slug: 'startup-zaken', name: 'Startup Zaken', date: 'March 28, 2026', desc: 'For small & medium businesses', color: '#34D399' },
  { slug: 'an-evening-with', name: 'An Evening With', date: 'March 29, 2026', desc: 'World-class keynote speaker', color: '#888' },
];

const SPEAKERS = [
  { name: 'Sarah Chen', role: 'CTO, TechForge', flag: '🇺🇸', color: '#4FFFDF' },
  { name: 'Marcus Berg', role: 'CEO, EventScale', flag: '🇩🇪', color: '#A78BFA' },
  { name: 'Priya Sharma', role: 'VP Engineering, CloudNova', flag: '🇮🇳', color: '#34D399' },
  { name: 'James Wright', role: 'Founder, LaunchLab', flag: '🇬🇧', color: '#F472B6' },
  { name: 'Ana Costa', role: 'Director of AI, FutureConf', flag: '🇧🇷', color: '#60A5FA' },
];

const PERSONAS = [
  { role: 'Startup Founder', pct: 42, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', cta: 'Startup plan →' },
  { role: 'Enterprise Planner', pct: 28, gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', cta: 'Enterprise plan →' },
  { role: 'Event Agency', pct: 18, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', cta: 'Agency plan →' },
  { role: 'Community Builder', pct: 12, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', cta: 'Community plan →' },
];

const PARTNER_TIERS = [
  { label: 'CO-ORGANISERS', names: ['TechForge', 'ScaleUp.io', 'NovaPay'] },
  { label: 'STRATEGIC PARTNERS', names: ['CloudBridge', 'EventStack', 'DataPulse', 'FlowSync', 'LaunchLab'] },
  { label: 'KEY PARTNERS', names: ['Innovate', 'GrowthHub', 'FutureConf', 'StackAI', 'VenueMatch', 'TicketFlow', 'SpeakerSync', 'SchedulePro'] },
];

function CountdownWidget() {
  const [diff, setDiff] = useState({ d: 28, h: 3, m: 2, s: 17 });
  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    const tick = () => {
      const now = new Date();
      let ms = end.getTime() - now.getTime();
      if (ms < 0) ms = 0;
      setDiff({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-xl p-6" style={{ background: '#fff', color: '#0A0A0A' }}>
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: '#666' }}>Starting in</div>
      <div className="flex gap-4 font-mono text-2xl font-bold">
        <span>{diff.d}d</span>
        <span>{diff.h}h</span>
        <span>{diff.m}m</span>
        <span>{diff.s}s</span>
      </div>
      <a href="#" className="text-sm mt-3 block" style={{ color: 'var(--color-accent)' }}>Add to calendar 📅</a>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>How It Works</Link>
          <Link href="/dashboard" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Demo Events</Link>
          <Link href="/sponsor" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Sponsor</Link>
          <Link href="/affiliate" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Affiliate</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      {/* Hero — full viewport, cinematic */}
      <section className="min-h-screen flex flex-col justify-end relative px-6 pb-24 pt-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A1A] to-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(79,255,223,0.15) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.25,
        }} />
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider border" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.9)' }}>AI-Powered</span>
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider border" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.9)' }}>60-Second Generation</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
              The platform that launches<br />conferences in seconds
            </h1>
            <div className="flex gap-4 flex-wrap">
              <Link href="/create" className="btn-primary" style={{ fontSize: '1.125rem' }}>Generate Your Event →</Link>
              <a href="#how-it-works" className="px-6 py-3 rounded-lg font-semibold border transition-all hover:border-[var(--color-accent)]"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--color-text)' }}>See How It Works →</a>
            </div>
          </div>
          <div className="hidden md:block">
            <CountdownWidget />
          </div>
        </div>
      </section>

      {/* Why Launchpad — split layout, light bg */}
      <section className="px-6 py-32" style={{ background: '#0A0A0A' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-16 items-center">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>Why Launchpad</div>
            <h2 className="text-4xl md:text-5xl font-normal mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              The playground for event creators
            </h2>
            <p className="mb-8" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '1.125rem' }}>
              Launchpad eliminates months of planning. Drop your topic, city, and date — AI generates speakers, schedule, venue, and pricing. A complete shareable event page in under a minute.
            </p>
            <div className="space-y-4">
              {['Explore the AI engine ↗', 'See demo events ↗', 'View pricing ↗', 'Start generating ↗'].map((label) => (
                <a key={label} href={label.includes('demo') ? '/dashboard' : label.includes('pricing') ? '#pricing' : '/create'} className="block py-2 border-b border-transparent hover:border-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text)' }}>{label}</a>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden h-64" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }} />
            <div className="rounded-2xl overflow-hidden h-48 ml-12" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>How It Works</h2>
          <p className="text-center mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Three steps. One click. Done.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', emoji: '✍️', title: 'Describe', desc: 'Topic, city, date, capacity, budget, vibe. Six fields. No complexity.', accent: 'var(--color-accent)' },
              { step: '02', emoji: '🤖', title: 'Generate', desc: 'AI agents research speakers, build schedule, match venue, set pricing — all in parallel.', accent: 'var(--color-warm)' },
              { step: '03', emoji: '🚀', title: 'Share', desc: 'Your conference page is live with a shareable URL, ticket sales ready, full event details.', accent: 'var(--color-accent)' },
            ].map((item) => (
              <div key={item.step} className="card group">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <div className="mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: item.accent }}>{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choose Your Path */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Choose Your Path</div>
          <h2 className="text-center text-4xl md:text-5xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>This is where you belong</h2>
          <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            Launchpad isn&apos;t one-size-fits-all. Whether you&apos;re a startup, enterprise, or agency — we handle the complexity.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {PERSONAS.map((p) => (
              <div key={p.role} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-48" style={{ background: p.gradient }} />
                <div className="p-6">
                  <div className="text-xs uppercase mb-2" style={{ color: 'var(--color-text-muted)' }}>I am a</div>
                  <h3 className="text-xl font-semibold mb-2">{p.role}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Launchpad adapts to your scale. From first-time organizers to enterprise teams.</p>
                  <Link href="/create" className="btn-primary w-full text-sm py-2">{p.cta}</Link>
                  <div className="mt-4">
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: 'var(--color-accent)' }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{p.pct}% of users</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="text-xs uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>What users say</div>
          <blockquote className="text-4xl md:text-5xl font-normal italic leading-tight mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            &ldquo;I generated a complete conference in under a minute. Speakers, venue, schedule, pricing — all of it. This is the future of event planning.&rdquo;
          </blockquote>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>— EventScale</p>
        </div>
      </section>

      {/* Speakers */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-normal" style={{ fontFamily: 'var(--font-display)' }}>Confirmed speakers</h2>
              <h2 className="text-4xl font-normal" style={{ fontFamily: 'var(--font-display)' }}>for Demo Conference 2026</h2>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard" className="btn-primary text-sm py-2">Explore the program →</Link>
              <a href="/dashboard" className="px-4 py-2 rounded-lg border text-sm" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>Meet all speakers →</a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {SPEAKERS.map((s, i) => (
              <div key={s.name}>
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/5] flex items-center justify-center" style={{ background: s.color + '40' }}>
                  <span className="text-4xl font-bold" style={{ color: s.color }}>{s.name.charAt(0)}</span>
                </div>
                <div className="w-8 h-8 rounded-full mb-2 flex items-center justify-center text-xs font-bold" style={{ background: s.color + '40', color: s.color }}>{s.name.charAt(0)}</div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{s.role}</p>
                <span className="text-sm">{s.flag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Showcase */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Launchpad Showcase</div>
          <h2 className="text-center text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>A full week of inspiration, connection, and innovation</h2>
          <p className="text-center max-w-2xl mx-auto mb-12" style={{ color: 'var(--color-text-muted)' }}>Explore generated events from our platform.</p>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {DEMO_EVENTS.map((e, i) => (
              <Link key={e.slug} href={e.slug.startsWith('ai-') ? '/e/ai-austin-ovw4' : '/dashboard'} className="flex-shrink-0 w-72 snap-center rounded-2xl overflow-hidden group" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-48" style={{ background: `linear-gradient(135deg, ${e.color}40 0%, ${e.color}20 100%)` }} />
                <div className="p-4">
                  <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>{e.date}</div>
                  <div className="w-2 h-2 rounded-full inline-block mr-2" style={{ background: e.color }} />
                  <h3 className="font-semibold mb-1">{e.name}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{e.desc}</p>
                  <span className="text-sm" style={{ color: 'var(--color-accent)' }}>Explore event →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <h2 className="text-4xl font-normal" style={{ fontFamily: 'var(--font-display)' }}>They make it all possible</h2>
            <div>
              <p className="mb-4" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>Launchpad wouldn&apos;t be possible without the visionaries who stand behind us. From leading investors to forward-thinking companies.</p>
              <Link href="/sponsor" className="text-sm" style={{ color: 'var(--color-accent)' }}>Become a partner →</Link>
            </div>
          </div>
          <div className="space-y-12">
            {PARTNER_TIERS.map((tier) => (
              <div key={tier.label}>
                <div className="text-xs uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>{tier.label}</div>
                <div className="flex flex-wrap gap-8">
                  {tier.names.map((n) => (
                    <div key={n} className="px-6 py-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="font-semibold">{n}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: 'var(--font-display)' }}>Join the Launchpad Community</h2>
            <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>Stay up to date with the latest AI event generation features.</p>
            <form className="flex flex-col sm:flex-row gap-4 mb-4">
              <input type="text" placeholder="First name" className="input-field flex-1" />
              <input type="text" placeholder="Last name" className="input-field flex-1" />
              <input type="text" placeholder="Company" className="input-field flex-1" />
              <input type="email" placeholder="Email" className="input-field flex-1" />
            </form>
            <button type="button" className="btn-primary w-full sm:w-auto">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>Simple pricing</h2>
          <p className="text-center mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Start free. Scale when you need to.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['1 event', 'AI generation', 'Shareable page', 'In-memory storage'], highlight: false, pct: 35, gradient: '#34D399' },
              { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited events', 'Supabase persistence', 'Custom branding', 'Priority support'], highlight: true, pct: 52, gradient: '#4FFFDF', badge: 'Most Popular' },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'Dedicated support', 'SLA', 'Custom integrations'], highlight: false, pct: 13, gradient: '#A78BFA' },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-2xl overflow-hidden ${tier.highlight ? 'ring-1' : ''}`}
                style={tier.highlight ? { borderColor: 'rgba(79,255,223,0.4)', boxShadow: '0 0 30px rgba(79,255,223,0.08)', background: 'rgba(255,255,255,0.03)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-1" style={{ background: tier.gradient }} />
                <div className="p-6 text-center">
                  {tier.badge && <span className="text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>{tier.badge}</span>}
                  <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>{tier.name}</div>
                  <div className="mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: tier.highlight ? 'var(--color-accent)' : 'var(--color-text)' }}>{tier.price}</div>
                  <div className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{tier.period}</div>
                  <ul className="space-y-2 text-left mb-6">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/create" className="btn-primary w-full block mb-4">Get started →</Link>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${tier.pct}%`, background: tier.gradient }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{tier.pct}% of users choose this</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center" style={{ background: 'var(--color-surface)' }}>
        <h2 className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>Ready to launch?</h2>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Your next conference is 60 seconds away.</p>
        <Link href="/create" className="btn-primary" style={{ fontSize: '1.125rem' }}>Create Your Event →</Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0A0A0A' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-6xl md:text-8xl font-normal mb-16" style={{ fontFamily: 'var(--font-display)' }}>LAUNCHPAD</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
            <div>
              <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Product</div>
              <div className="space-y-2">
                <Link href="/create" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Generate Event</Link>
                <Link href="/dashboard" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Demo Events</Link>
                <Link href="/sponsor" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Sponsor</Link>
                <a href="#how-it-works" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>AI Engine</a>
                <Link href="/create" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Swarm Mode</Link>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Resources</div>
              <div className="space-y-2">
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Documentation</a>
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>API</a>
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Blog</a>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Company</div>
              <div className="space-y-2">
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>About</a>
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Contact</a>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Legal</div>
              <div className="space-y-2">
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Privacy</a>
                <a href="#" className="block text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Terms</a>
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Connect</div>
              <div className="flex gap-4">
                <a href="#" className="text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Twitter</a>
                <a href="#" className="text-sm hover:text-white transition-colors" style={{ color: '#666' }}>LinkedIn</a>
                <a href="#" className="text-sm hover:text-white transition-colors" style={{ color: '#666' }}>GitHub</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: '#666' }}>© 2026 Launchpad. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:text-white transition-colors" style={{ color: '#666' }}>LinkedIn</a>
              <a href="#" className="text-sm hover:text-white transition-colors" style={{ color: '#666' }}>Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
