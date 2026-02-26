import Link from 'next/link';

const MILESTONES = [
  { date: '2025 Q3', title: 'Launchpad founded', desc: 'Jennifer West joins as CTO & Lead Engineer. Designed and built the initial architecture.' },
  { date: '2025 Q4', title: 'Swarm AI shipped', desc: '5 parallel agents generating complete conferences in under 30 seconds.' },
  { date: '2026 Q1', title: 'Public launch', desc: '34 pages, 11 API routes, full event generation and checkout flow live.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>About Launchpad</h1>
        <p className="mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
          We&apos;re building the future of conference planning. AI-generated events in 60 seconds — no spreadsheets, no 6-month cycles.
        </p>

        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Team</h2>
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full shrink-0" style={{ background: 'rgba(79,255,223,0.2)' }} />
              <div>
                <h3 className="font-semibold text-lg">Jennifer West</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-accent)' }}>CTO & Lead Engineer</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  Designed, built & launched Launchpad. Previously Mirror Protocol™, The Forgotten Code Research Institute. Security research, AI systems, cross-platform tooling.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Milestones</h2>
          <div className="space-y-6">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-24 shrink-0 text-sm font-mono" style={{ color: 'var(--color-accent)' }}>{m.date}</div>
                <div>
                  <h4 className="font-medium mb-1">{m.title}</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Mission</h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            Event planning is broken. Great ideas get stuck in coordination hell — venue research, speaker outreach, schedule drafting. We&apos;re fixing that with AI. Describe your event, hit generate, get a production-ready page in 60 seconds.
          </p>
        </section>

        <p className="mt-12">
          <Link href="/" className="text-sm" style={{ color: 'var(--color-accent)' }}>← Back to Launchpad</Link>
        </p>
      </div>
    </main>
  );
}
