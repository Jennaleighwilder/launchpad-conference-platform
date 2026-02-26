'use client';

import Link from 'next/link';
import { JOBS, CAREERS_LOCATION, CAREERS_PERKS, CAREERS_FAQ } from '@/data/careers';

export default function CareersPage() {
  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
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

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #312e81 100%)',
      }}>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(79,255,223,0.2)', border: '1px solid rgba(79,255,223,0.4)', color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600 }}>
            {CAREERS_LOCATION.name}, {CAREERS_LOCATION.city} — {CAREERS_LOCATION.tagline}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Build the future of events
          </h1>
          <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            {CAREERS_LOCATION.description}
          </p>
        </div>
      </section>

      {/* Job listings */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-display)' }}>Open roles</h2>
          <div className="space-y-4">
            {JOBS.map((job) => (
              <Link key={job.slug} href={`/careers/${job.slug}`} className="block rounded-2xl p-6 transition-all hover:border-[var(--color-accent)]"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      {job.status && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>{job.status}</span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{job.department} · {job.location}</p>
                    <p className="font-medium" style={{ color: 'var(--color-accent)' }}>{job.salary} + equity</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-display)' }}>Why join us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAREERS_PERKS.map((p) => (
              <div key={p.label} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-accent)' }}>{p.label}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-display)' }}>FAQ</h2>
          <div className="space-y-4">
            {CAREERS_FAQ.map((item, i) => (
              <div key={i} className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.a}</p>
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
