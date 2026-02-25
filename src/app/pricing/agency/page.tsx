'use client';

import Link from 'next/link';

export default function AgencyPlanPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <Link href="/checkout/pro" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Start Pro →</Link>
      </nav>

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>For Event Agencies</div>
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Ship client events 10x faster</h1>
          <p className="text-xl mb-12" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Multiple clients, multiple events. Custom branding per client, persistence, and the AI that does the heavy lifting.
          </p>

          <div className="rounded-2xl p-8 mb-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-semibold mb-6">What you get</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>Unlimited events</strong> — One Pro subscription, all clients</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>Custom branding per event</strong> — Each client gets their look</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>Supabase persistence</strong> — Events saved, no data loss</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>API access</strong> — Integrate with your workflow</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>Priority support</strong> — When deadlines loom</span></li>
            </ul>
            <div className="mb-6">
              <span className="text-3xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>$29</span>
              <span className="text-lg" style={{ color: 'var(--color-text-muted)' }}>/mo</span>
            </div>
            <Link href="/checkout/pro" className="btn-primary w-full block text-center py-4">Start Pro — $29/mo →</Link>
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <Link href="/pricing" className="hover:text-[var(--color-accent)] transition-colors">View all plans →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
