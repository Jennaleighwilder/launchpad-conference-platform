'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SpeakerApplyPage() {
  const [submitted, setSubmitted] = useState(false);

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
          <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <Link href="/speakers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Speakers</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=600&fit=crop"
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 100%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Apply to Speak</h1>
          <p className="text-xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Share your expertise with our community. Apply to speak at Launchpad events and reach innovators, founders, and industry leaders.
          </p>
        </div>
      </section>

      {/* Application form */}
      <section className="px-6 py-24">
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(79,255,223,0.2)', border: '2px solid var(--color-accent)' }}>
                  <svg className="w-8 h-8" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4">Application received!</h3>
                <p className="mb-6" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  We&apos;ll review your application and get back to you within 5 business days. In the meantime, explore our <Link href="/speakers" className="hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-accent)' }}>speaker lineup</Link>.
                </p>
                <Link href="/" className="btn-primary">Back to Launchpad</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-6">Speaker Application</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Full name" required className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }} />
                  <input type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }} />
                  <input type="text" placeholder="Company / Role" className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }} />
                  <input type="text" placeholder="Proposed talk topic" required className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }} />
                  <select className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }}>
                    <option value="">Which event(s) are you interested in?</option>
                    <option>AI Festival UK 2026</option>
                    <option>Demo Conference 2026</option>
                    <option>AI Summit 2026</option>
                    <option>Any / General interest</option>
                  </select>
                  <textarea placeholder="Short bio & speaking experience" rows={4} className="w-full px-4 py-3 rounded-lg bg-transparent border resize-none" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }} />
                  <textarea placeholder="Additional notes (optional)" rows={2} className="w-full px-4 py-3 rounded-lg bg-transparent border resize-none" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'var(--color-text)' }} />
                </div>
                <button type="submit" className="btn-primary w-full mt-6 py-4">Submit Application</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
