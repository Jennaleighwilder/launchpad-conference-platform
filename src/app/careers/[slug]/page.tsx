'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { JOBS } from '@/data/careers';

export default function JobPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [submitted, setSubmitted] = useState(false);

  const displayJob = JOBS.find((j) => j.slug === slug);
  if (!displayJob) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-center">
          <h1 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>Job not found</h1>
          <Link href="/careers" className="text-sm" style={{ color: 'var(--color-accent)' }}>← Back to Careers</Link>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/careers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Careers</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/careers" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-accent)' }}>← Back to Careers</Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-4xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{displayJob.title}</h1>
                {displayJob.status && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>{displayJob.status}</span>
                )}
              </div>
              <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>{displayJob.department} · {displayJob.location}</p>
              <p className="text-xl mb-8" style={{ color: 'var(--color-accent)' }}>{displayJob.salary} + equity</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {displayJob.tags.map((t) => (
                  <span key={t} className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>{t}</span>
                ))}
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-lg mb-6" style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>{displayJob.description}</p>
                <h3 className="text-xl font-semibold mb-4">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 mb-8" style={{ color: 'var(--color-text-muted)' }}>
                  {displayJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
                <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--color-text-muted)' }}>
                  {displayJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>

            {/* Sticky sidebar — application form */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-xl font-semibold mb-6">Apply for this role</h3>
                {submitted ? (
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)' }}>
                    <p className="font-medium mb-2" style={{ color: 'var(--color-accent)' }}>Application received!</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>We&apos;ll review and get back to you within 48 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Name</label>
                      <input type="text" required placeholder="Your name" className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Email</label>
                      <input type="email" required placeholder="you@example.com" className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Short pitch (optional)</label>
                      <textarea rows={4} placeholder="Why you? What excites you about this role?" className="input-field w-full resize-none" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Apply now</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
