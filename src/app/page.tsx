'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
        style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-105"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </div>
        <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
          Create Event →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 transition-all hover:border-opacity-60"
          style={{ background: 'var(--color-accent-dim)', border: '1px solid rgba(79,255,223,0.2)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent)' }}></span>
          <span style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
            AI-Powered Conference Generation
          </span>
        </div>

        <h1 className="max-w-4xl mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
          Launch Your Conference in{' '}
          <span style={{ color: 'var(--color-accent)' }}>60 Seconds</span>
        </h1>

        <p className="max-w-2xl mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', lineHeight: 1.6 }}>
          Drop your topic, city, and date. AI generates speakers, schedule, venue, and pricing — 
          a complete shareable event page ready to sell tickets.
        </p>

        <div className="flex gap-4 flex-wrap justify-center mb-20">
          <Link href="/create" className="btn-primary" style={{ fontSize: '1.125rem' }}>
            Generate Your Event →
          </Link>
          <a href="#how-it-works" className="btn-secondary" style={{ fontSize: '1.125rem' }}>
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl w-full">
          {[
            { value: '60s', label: 'Generation Time' },
            { value: '100%', label: 'AI-Powered' },
            { value: '∞', label: 'Scalability' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--color-accent)' }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-24" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>
            How It Works
          </h2>
          <p className="text-center mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            Three steps. One click. Done.
          </p>
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

      {/* Features Grid */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>
            Everything you need
          </h2>
          <p className="text-center mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            AI handles the heavy lifting so you can focus on your event
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎤', title: 'AI Speakers', desc: 'Curated, diverse speaker profiles with roles and talk titles' },
              { icon: '📋', title: 'Smart Scheduling', desc: 'Full-day program with tracks, times, and room assignments' },
              { icon: '🏛️', title: 'Venue Matching', desc: 'City-matched venues with capacity and address' },
              { icon: '💰', title: 'Dynamic Pricing', desc: 'Early bird, regular, and VIP tiers based on your budget' },
              { icon: '🔗', title: 'Shareable Pages', desc: 'Beautiful public URLs ready to share on social' },
              { icon: '💳', title: 'Stripe Payments', desc: 'Sell tickets with secure checkout integration' },
            ].map((item) => (
              <div key={item.title} className="card group">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="px-6 py-24" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>
            Simple pricing
          </h2>
          <p className="text-center mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            Start free. Scale when you need to.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['1 event', 'AI generation', 'Shareable page', 'In-memory storage'], highlight: false },
              { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited events', 'Supabase persistence', 'Custom branding', 'Priority support'], highlight: true },
              { name: 'Enterprise', price: 'Custom', period: '', features: ['Everything in Pro', 'Dedicated support', 'SLA', 'Custom integrations'], highlight: false },
            ].map((tier) => (
              <div key={tier.name} className={`card text-center ${tier.highlight ? 'ring-1' : ''}`}
                style={tier.highlight ? { borderColor: 'rgba(79,255,223,0.4)', boxShadow: '0 0 30px rgba(79,255,223,0.08)' } : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>{tier.name}</div>
                <div className="mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: tier.highlight ? 'var(--color-accent)' : 'var(--color-text)' }}>
                  {tier.price}
                </div>
                <div className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{tier.period}</div>
                <ul className="space-y-2 text-left">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
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
      <footer className="px-6 py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
            <span style={{ fontFamily: 'var(--font-display)' }}>Launchpad</span>
          </div>
          <div className="flex gap-8" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
            <Link href="/create" className="hover:text-[var(--color-accent)] transition-colors">Create Event</Link>
            <a href="#how-it-works" className="hover:text-[var(--color-accent)] transition-colors">How It Works</a>
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>© 2026 Launchpad. AI-powered conference generation.</div>
        </div>
      </footer>
    </main>
  );
}
