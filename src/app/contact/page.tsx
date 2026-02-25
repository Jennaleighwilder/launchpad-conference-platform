'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
          <Link href="/pricing" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Pricing</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-xl mx-auto">
          <h1 className="text-5xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Enterprise</h1>
          <p className="text-xl mb-12" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Get in touch for custom pricing, dedicated support, and enterprise features.
          </p>

          {submitted ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)' }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-accent)' }}>Thank you!</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Our enterprise team will reach out within 24 hours to schedule your demo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Company</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Inc"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Company Size</label>
                <select className="input-field w-full" style={{ background: 'var(--color-bg)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}>
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Message</label>
                <textarea
                  placeholder="Tell us about your event needs..."
                  rows={5}
                  className="input-field w-full resize-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Request Demo
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
