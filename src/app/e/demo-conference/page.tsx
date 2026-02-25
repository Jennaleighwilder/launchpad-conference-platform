'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TRACK_COLORS = ['#4FFFDF', '#A78BFA', '#34D399', '#F472B6', '#FBBF24', '#60A5FA'];
const SOLD_PCT = { early_bird: 78, regular: 45, vip: 12 };
const accentColor = '#4FFFDF';

const VENUE = {
  name: 'Beurs van Berlage',
  address: 'Damrak 243, Amsterdam',
  capacity_note: 'Historic venue in the heart of Amsterdam. A landmark building originally built as a commodities exchange, now a premier event space.',
};

const TRACKS = ['AI & Machine Learning', 'Startup Growth', 'Enterprise Innovation'];

const SPEAKERS = [
  { name: 'Sarah Chen', role: 'CTO, TechForge', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop', talk: 'Building AI-First Products', track: 'AI & Machine Learning' },
  { name: 'Marcus Berg', role: 'CEO, EventScale', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop', talk: 'Scaling Events to 10K Attendees', track: 'Startup Growth' },
  { name: 'Priya Sharma', role: 'VP Engineering, CloudNova', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop', talk: 'Enterprise ML Infrastructure', track: 'Enterprise Innovation' },
  { name: 'James Wright', role: 'Founder, LaunchLab', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', talk: 'From Zero to Series A', track: 'Startup Growth' },
  { name: 'Ana Costa', role: 'Director of AI, FutureConf', img: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop', talk: 'Responsible AI in Production', track: 'AI & Machine Learning' },
  { name: 'David Kim', role: 'Head of Growth, ScaleUp', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop', talk: 'Growth Loops That Work', track: 'Startup Growth' },
  { name: 'Emma Watson', role: 'Chief Data Officer, DataPulse', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop', talk: 'Data Strategy for Enterprises', track: 'Enterprise Innovation' },
  { name: 'Alex Rivera', role: 'Founder, AI Ventures', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop', talk: 'Investing in AI Startups', track: 'AI & Machine Learning' },
  { name: 'Sofia Martinez', role: 'VP Product, FlowSync', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop', talk: 'Product-Led Growth at Scale', track: 'Startup Growth' },
  { name: 'Michael Chen', role: 'CTO, Innovate Corp', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop', talk: 'Legacy to AI: Enterprise Transformation', track: 'Enterprise Innovation' },
  { name: 'Yuki Tanaka', role: 'Research Lead, StackAI', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', talk: 'LLMs in Production', track: 'AI & Machine Learning' },
  { name: 'Rachel Green', role: 'Head of Partnerships, Launchpad', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop', talk: 'Building Ecosystems', track: 'Enterprise Innovation' },
];

const SCHEDULE = [
  { time: '09:00', title: 'Opening Keynote: The Future of AI', speaker: 'Sarah Chen', track: 'AI & Machine Learning', day: 'Day 1' },
  { time: '10:30', title: 'Scaling Events to 10K Attendees', speaker: 'Marcus Berg', track: 'Startup Growth', day: 'Day 1' },
  { time: '12:00', title: 'Enterprise ML Infrastructure', speaker: 'Priya Sharma', track: 'Enterprise Innovation', day: 'Day 1' },
  { time: '14:00', title: 'From Zero to Series A', speaker: 'James Wright', track: 'Startup Growth', day: 'Day 1' },
  { time: '09:00', title: 'Responsible AI in Production', speaker: 'Ana Costa', track: 'AI & Machine Learning', day: 'Day 2' },
  { time: '10:30', title: 'Growth Loops That Work', speaker: 'David Kim', track: 'Startup Growth', day: 'Day 2' },
  { time: '12:00', title: 'Data Strategy for Enterprises', speaker: 'Emma Watson', track: 'Enterprise Innovation', day: 'Day 2' },
  { time: '14:00', title: 'Investing in AI Startups', speaker: 'Alex Rivera', track: 'AI & Machine Learning', day: 'Day 2' },
];

const PRICING = { early_bird: '€299', regular: '€499', vip: '€999' };

function CountdownTimer() {
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date('2026-03-25T09:00:00');
    const tick = () => {
      const now = new Date();
      let ms = end.getTime() - now.getTime();
      if (ms < 0) ms = 0;
      setDiff({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex gap-4 font-mono">
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: accentColor }}>{diff.d}</div>
        <div className="text-xs uppercase" style={{ color: 'var(--color-text-muted)' }}>Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: accentColor }}>{diff.h}</div>
        <div className="text-xs uppercase" style={{ color: 'var(--color-text-muted)' }}>Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: accentColor }}>{diff.m}</div>
        <div className="text-xs uppercase" style={{ color: 'var(--color-text-muted)' }}>Min</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold" style={{ color: accentColor }}>{diff.s}</div>
        <div className="text-xs uppercase" style={{ color: 'var(--color-text-muted)' }}>Sec</div>
      </div>
    </div>
  );
}

function ticketsRemaining(tier: keyof typeof SOLD_PCT) {
  const pct = SOLD_PCT[tier] ?? 0;
  const cap = 2500;
  const sold = Math.round((cap / 3) * (pct / 100));
  return Math.max(0, Math.round(cap / 3) - sold);
}

export default function DemoConferencePage() {
  const [bgVideoReady, setBgVideoReady] = useState(true);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      {bgVideoReady && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-30"
            onError={() => setBgVideoReady(false)}
          >
            <source src="/conference-bg.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Hero */}
      <section className="relative px-6 pt-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-[var(--color-accent)]"
            style={{ color: 'var(--color-text-muted)' }}>
            ← Back to Launchpad
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }}></span>
            <span style={{ color: accentColor, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tickets Available
            </span>
          </div>

          <h1 className="mb-4" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
          }}>
            SuperNova AI Summit 2026
          </h1>

          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
            Where AI meets ambition
          </p>

          <div className="flex flex-wrap gap-6 mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2">
              <span>📍</span><span>Amsterdam, Netherlands</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span><span>March 25-26, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span><span>2,500 attendees</span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Event starts in</p>
            <CountdownTimer />
          </div>

          <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            Where AI meets ambition. A two-day summit bringing together innovators, founders, and enterprise leaders to shape the future of artificial intelligence.
          </p>

          <div className="flex flex-wrap gap-2">
            {TRACKS.map((track, i) => (
              <span key={track} className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: `${TRACK_COLORS[i % TRACK_COLORS.length]}20`,
                  border: `1px solid ${TRACK_COLORS[i % TRACK_COLORS.length]}50`,
                  color: TRACK_COLORS[i % TRACK_COLORS.length],
                }}>
                {track}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Speakers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SPEAKERS.map((speaker, i) => {
              const trackColor = TRACK_COLORS[TRACKS.indexOf(speaker.track) % TRACK_COLORS.length] || accentColor;
              return (
                <div key={i} className="card group">
                  <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                    <Image
                      src={speaker.img}
                      alt={speaker.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{speaker.talk}</p>
                  <span className="text-xs px-2 py-0.5 rounded"
                    style={{ background: `${trackColor}20`, color: trackColor }}>
                    {speaker.track}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="space-y-0">
              {SCHEDULE.map((item, i) => (
                <div key={i} className="relative flex items-start gap-6 py-5 pl-12">
                  <div className="absolute left-0 w-20 text-right">
                    <span className="text-sm font-medium" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>
                      {item.time}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 card py-4">
                    <div className="font-medium mb-1">{item.title}</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.speaker}</div>
                    {item.track && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded"
                        style={{ background: `${accentColor}15`, color: accentColor }}>
                        {item.track}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Venue</h2>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">{VENUE.name}</h3>
            <p className="mb-2" style={{ color: 'var(--color-text-muted)' }}>{VENUE.address}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>{VENUE.capacity_note}</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Tickets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center flex flex-col">
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Early Bird</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>
                {PRICING.early_bird}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Limited availability</div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.early_bird}%`, background: accentColor }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining('early_bird')} tickets remaining</p>
              <Link
                href={`/checkout/demo-conference?tier=early_bird&price=${encodeURIComponent(PRICING.early_bird)}`}
                className="btn-primary w-full py-3 text-sm text-center"
              >
                Buy Ticket
              </Link>
            </div>
            <div className="card text-center flex flex-col" style={{ borderColor: 'rgba(79,255,223,0.3)', boxShadow: '0 0 20px rgba(79,255,223,0.05)' }}>
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: accentColor }}>Regular</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                {PRICING.regular}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Standard admission</div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.regular}%`, background: accentColor }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining('regular')} tickets remaining</p>
              <Link
                href={`/checkout/demo-conference?tier=regular&price=${encodeURIComponent(PRICING.regular)}`}
                className="btn-primary w-full py-3 text-sm text-center"
              >
                Buy Ticket
              </Link>
            </div>
            <div className="card text-center flex flex-col">
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-warm)' }}>VIP</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm)' }}>
                {PRICING.vip}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Premium access + perks</div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.vip}%`, background: 'var(--color-warm)' }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining('vip')} tickets remaining</p>
              <Link
                href={`/checkout/demo-conference?tier=vip&price=${encodeURIComponent(PRICING.vip)}`}
                className="btn-primary w-full py-3 text-sm text-center"
              >
                Buy Ticket
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center mb-8">
          <Link href="/sponsor" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>
            Become a Sponsor →
          </Link>
        </div>
      </section>

      {/* Share */}
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Share this event</p>
          <button
            onClick={() => typeof window !== 'undefined' && navigator.clipboard.writeText(window.location.href)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          >
            {typeof window !== 'undefined' ? window.location.href : '/e/demo-conference'}
            <span style={{ color: 'var(--color-accent)' }}>📋</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation
        </p>
      </footer>
    </main>
  );
}
