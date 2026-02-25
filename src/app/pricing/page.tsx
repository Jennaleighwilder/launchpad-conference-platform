'use client';

import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['1 event', 'AI generation', 'Shareable page', 'In-memory storage', 'Community support'],
    cta: 'Choose Plan',
    href: '/create',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: ['Unlimited events', 'Supabase persistence', 'Custom branding', 'Priority support', 'Swarm mode', 'Analytics dashboard', 'API access', 'OG social cards'],
    cta: 'Choose Plan',
    href: '/checkout/pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Everything in Pro', 'Dedicated support', 'SLA', 'Custom integrations', 'White-label option', 'Onboarding call', 'Custom AI training'],
    cta: 'Choose Plan',
    href: '/contact',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-normal mb-6 text-center" style={{ fontFamily: 'var(--font-display)' }}>Simple pricing</h1>
          <p className="text-xl text-center mb-16" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Start free. Scale when you need to.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl overflow-hidden p-8 ${plan.highlight ? 'ring-1' : ''}`}
                style={plan.highlight ? { borderColor: 'rgba(79,255,223,0.4)', boxShadow: '0 0 30px rgba(79,255,223,0.08)', background: 'rgba(255,255,255,0.03)' } : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {plan.badge && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                    {plan.badge}
                  </span>
                )}
                <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                <div className="mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: plan.highlight ? 'var(--color-accent)' : 'var(--color-text)' }}>
                  {plan.price}
                  <span className="text-lg font-normal" style={{ color: 'var(--color-text-muted)' }}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="btn-primary w-full block text-center">
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
