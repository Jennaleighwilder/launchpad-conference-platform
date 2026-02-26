'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  { title: 'Apply in 5 minutes', desc: 'Share your audience size and preferred channels. We approve within 48 hours.' },
  { title: 'Get your unique link', desc: 'Share your affiliate link — events, blog, social, email. Track conversions in real time.' },
  { title: 'Earn 40% recurring', desc: '40% of every Pro subscription you refer. Paid monthly. No cap.' },
];

const COMMISSION_TIERS = [
  { tier: 'Standard', range: '1–50 referrals', rate: '40%', desc: 'Creators, organizers, community builders' },
  { tier: 'Influencer', range: '50–500 referrals', rate: '40%', desc: 'YouTubers, podcasters, newsletter writers', badge: 'Popular' },
  { tier: 'Partner', range: '500+ referrals', rate: '40%', desc: 'Agencies, event platforms, co-marketing' },
];

const REFER_A_FRIEND = {
  title: 'Refer a friend, both get rewarded',
  desc: 'Share your link. When someone signs up and subscribes to Pro, you earn 40% recurring. They get 20% off their first month.',
};

const TESTIMONIALS = [
  { quote: 'Launchpad\'s 40% affiliate rate is the highest I\'ve seen in SaaS. I promote it to my 50K YouTube audience and the recurring commissions add up fast.', name: 'Alex Rivera', role: 'Tech YouTuber, 52K subs', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop' },
  { quote: 'As a conference organizer, I recommend Launchpad to everyone. My audience loves it — I earn 40% on every Pro signup. It\'s a no-brainer.', name: 'Sofia Martinez', role: 'Event Creator, Newsletter 12K', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop' },
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
          <Link href="/careers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Careers</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a5f 50%, #0f172a 100%)',
      }}>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full mb-6" style={{ background: 'rgba(79,255,223,0.2)', border: '1px solid rgba(79,255,223,0.4)', color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600 }}>40% recurring commission</div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Earn recurring income by recommending Launchpad
          </h1>
          <p className="text-xl mb-10" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Influencers, podcasters, and event creators earn 40% of every Pro subscription they refer. Paid monthly. No cap.
          </p>
          <Link href="#apply" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:brightness-110" style={{ background: '#4FFFDF', color: '#0A0A0A' }}>
            BECOME AN AFFILIATE
          </Link>
        </div>
      </section>

      {/* Refer a friend */}
      <section className="px-6 py-16" style={{ background: 'rgba(79,255,223,0.06)', borderTop: '1px solid rgba(79,255,223,0.15)', borderBottom: '1px solid rgba(79,255,223,0.15)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>{REFER_A_FRIEND.title}</h2>
          <p className="text-lg" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{REFER_A_FRIEND.desc}</p>
        </div>
      </section>

      {/* 3 steps */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-4xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>0{i + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-base" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission tiers — influencer/podcaster focus */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-normal mb-4 text-center" style={{ fontFamily: 'var(--font-display)' }}>Who should join</h2>
          <p className="text-center mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>Influencers, podcasters, event creators — all earn 40%</p>
          <div className="space-y-4">
            {COMMISSION_TIERS.map((t, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 px-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.tier}</span>
                    {t.badge && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>{t.badge}</span>}
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t.desc}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.range}</span>
                  <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>{t.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24">
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
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Audience type</label>
                <select className="input-field w-full" style={{ cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  <option value="youtube">YouTube / Video</option>
                  <option value="podcast">Podcast</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="social">Social media</option>
                  <option value="events">Event organizer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Website / Channel URL</label>
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
