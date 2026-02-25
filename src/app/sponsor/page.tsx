'use client';

import { useState } from 'react';
import Link from 'next/link';

const BENEFITS = [
  { num: '01', title: 'Secure High-Value Deal Flow', desc: 'Meet executives, founders, and decision-makers in an environment built for meaningful connections.' },
  { num: '02', title: 'Showcase Industry Leadership', desc: 'Position your brand at the center of innovation. Be seen by the people who matter.' },
  { num: '03', title: 'Command Global Media Authority', desc: 'Leverage our media reach and audience to amplify your announcements and thought leadership.' },
  { num: '04', title: 'Limitless Options to Guarantee ROI', desc: 'From logo placement to experiential activations — we tailor packages to your goals.' },
];

const TIERS = [
  { name: 'Gold', price: '$5,000', benefits: ['Logo on event page', 'Social mention', '1 attendee pass'], booth: '—' },
  { name: 'Platinum', price: '$15,000', benefits: ['Logo on all materials', 'Booth in expo hall', '5 attendee passes', 'Speaking slot'], booth: '10x10' },
  { name: 'Diamond', price: '$50,000', benefits: ['Premier logo placement', 'Main stage presence', '20 attendee passes', 'Keynote slot', 'Dedicated lounge'], booth: '20x20' },
];

export default function SponsorPage() {
  const [modalOpen, setModalOpen] = useState(false);
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
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6" style={{ background: 'linear-gradient(135deg, rgba(79,255,223,0.15) 0%, rgba(10,10,10,1) 50%)' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Become a Sponsor</h1>
          <p className="text-xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Grow your brand, make connections and demonstrate value to a diverse community of tech leaders and innovators.
          </p>
        </div>
      </section>

      {/* Two-column */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-16 items-center">
          <div className="md:col-span-3 rounded-2xl overflow-hidden h-96" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }} />
          <div className="md:col-span-2">
            <p className="mb-6" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              Launchpad events bring together the brightest minds in tech. Work with our partnerships team to select the opportunity that best fits your needs and budget.
            </p>
            <button onClick={() => setModalOpen(true)} className="btn-primary mb-4">Inquire Now</button>
            <p className="text-sm">
              <a href="mailto:partners@launchpad.events" className="hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Click here to reach out directly</a>
            </p>
          </div>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Why Sponsor?</h2>
          <p className="mb-16 max-w-2xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            Sponsorship is more than visibility — it&apos;s access to the ecosystem.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.num}>
                <div className="text-4xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>{b.num}</div>
                <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-normal mb-16" style={{ fontFamily: 'var(--font-display)' }}>Sponsorship Tiers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TIERS.map((t) => (
              <div key={t.name} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="text-xl font-semibold mb-2">{t.name}</h3>
                <div className="text-3xl font-bold mb-6" style={{ color: 'var(--color-accent)' }}>{t.price}</div>
                <ul className="space-y-2 mb-6">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <span style={{ color: 'var(--color-accent)' }}>✓</span> {b}
                    </li>
                  ))}
                </ul>
                {t.booth !== '—' && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Booth: {t.booth}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setModalOpen(false)}>
          <div className="max-w-md w-full rounded-2xl p-8" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Thank you!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Our team will contact you within 24 hours.</p>
                <button onClick={() => { setModalOpen(false); setSubmitted(false); }} className="btn-primary mt-6 w-full">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-semibold mb-6">Sponsorship Inquiry</h3>
                <div className="space-y-4">
                  <input type="text" placeholder="Name" required className="input-field" />
                  <input type="text" placeholder="Company" required className="input-field" />
                  <input type="email" placeholder="Email" required className="input-field" />
                  <select className="input-field">
                    <option>Select budget range</option>
                    <option>$5,000 - $15,000</option>
                    <option>$15,000 - $50,000</option>
                    <option>$50,000+</option>
                  </select>
                  <textarea placeholder="Message" rows={4} className="input-field" />
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="submit" className="btn-primary flex-1">Submit</button>
                  <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 rounded-lg border" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
