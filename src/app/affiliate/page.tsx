'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  { title: 'Join the program', desc: 'Fill in the form — it only takes 5 minutes' },
  { title: 'Share your link', desc: 'Invite others by sharing your affiliate link across your network' },
  { title: 'Earn forever', desc: 'Earn up to 30% recurring commission for every new referral' },
];

const COMMISSION_TIERS = [
  { range: '1-10 referrals', rate: '20%' },
  { range: '11-50 referrals', rate: '25%' },
  { range: '50+ referrals', rate: '30%' },
];

const TESTIMONIALS = [
  { quote: 'Launchpad\'s affiliate program is the most generous I\'ve seen. I\'ve been promoting it to my audience and the recurring commissions add up fast.', name: 'Alex Rivera', role: 'Tech YouTuber', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop' },
  { quote: 'As a conference organizer, I recommend Launchpad to everyone. The 30% commission tier is a no-brainer — my audience loves it and I get paid every month.', name: 'Sofia Martinez', role: 'Event Creator', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop' },
];

export default function AffiliatePage() {
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
      <section className="relative pt-32 pb-24 px-6 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a5f 50%, #0f172a 100%)',
      }}>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Earn recurring income by recommending Launchpad
          </h1>
          <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Become a Launchpad affiliate and earn up to 30% recurring commission every month
          </p>
          <Link href="#apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:brightness-110" style={{ background: '#4FFFDF', color: '#0A0A0A' }}>
            BECOME AN AFFILIATE
          </Link>
        </div>
      </section>

      {/* 3 white cards */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="rounded-2xl p-8" style={{ background: '#fff', color: '#0A0A0A' }}>
                <div className="text-4xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>0{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-base" style={{ color: '#666', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-normal mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            Creators love promoting Launchpad
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 flex gap-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden relative">
                  <Image src={t.img} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="mb-4 italic" style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — Commission tiers */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-normal mb-12 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            How it works
          </h2>
          <div className="space-y-6">
            {COMMISSION_TIERS.map((tier, i) => (
              <div key={i} className="flex justify-between items-center py-4 px-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-medium">{tier.range}</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{tier.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-normal mb-8 text-center" style={{ fontFamily: 'var(--font-display)' }}>
            Apply now
          </h2>
          {submitted ? (
            <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)' }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-accent)' }}>Application received!</h3>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                We&apos;ll review your application and get back to you within 48 hours with your affiliate link and dashboard access.
              </p>
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
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Website / Social URL</label>
                <input type="url" placeholder="https://youtube.com/yourchannel" className="input-field w-full" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Apply Now
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
