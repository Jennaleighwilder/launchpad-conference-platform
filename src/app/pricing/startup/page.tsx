'use client';

import Link from 'next/link';

export default function StartupPlanPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
      </nav>

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>For Startup Founders</div>
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Launch your first event in 60 seconds</h1>
          <p className="text-xl mb-12" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            No budget? No team? No problem. Start free, validate your idea, and upgrade when you&apos;re ready to scale.
          </p>

          <div className="rounded-2xl p-8 mb-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-semibold mb-6">What you get</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>1 free event</strong> — Full AI generation, no credit card</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>60-second setup</strong> — Topic, city, date → done</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>Shareable page</strong> — Speakers, schedule, tickets ready</span></li>
              <li className="flex items-start gap-3"><span style={{ color: 'var(--color-accent)' }}>✓</span> <span><strong>Upgrade to Pro</strong> — $29/mo when you need unlimited events</span></li>
            </ul>
            <Link href="/create" className="btn-primary w-full block text-center py-4">Start free — Create your event →</Link>
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <Link href="/pricing" className="hover:text-[var(--color-accent)] transition-colors">View all plans →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
