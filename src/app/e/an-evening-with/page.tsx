'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HelixDNA, GameOfLife } from '@/components/event-viz';
import { getSpeakerPhoto } from '@/lib/speaker-photos';
import {
  KenBurnsSlideshow,
  WaveDivider,
  LiveRegistrationCounter,
  CountdownTimer,
  TicketBarChart,
  RegistrationLineChart,
  ticketsRemaining,
  ScanlineOverlay,
} from '@/components/demo-event/DemoEventLayout';
import { FALLBACK_HERO_POOL } from '@/lib/hero-images';

const TRACK_COLORS = ['#D4AF37', '#E8C547', '#C9A227'];
const SOLD_PCT = { early_bird: 62, regular: 38, vip: 8 };
const accentColor = '#D4AF37';
// Picsum for static demos — 100% reliable on Vercel (Unsplash can rate-limit)
const SLIDESHOW_IMAGES = FALLBACK_HERO_POOL.slice(24, 36);

const VENUE = {
  name: 'The Royal Institution',
  address: '21 Albemarle St, London W1S 4BS',
  capacity_note: 'Historic venue in Mayfair. Home of the Christmas Lectures since 1825. Intimate auditorium for 400.',
  photo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=500&fit=crop',
  amenities: ['Wi-Fi', 'A/V', 'Green Room', 'Catering'],
};

const HOTELS = [
  { name: 'The Ritz London', distance: '0.4 km', price: '£450', stars: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Claridge\'s', distance: '0.6 km', price: '£520', stars: 5, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { name: 'The Connaught', distance: '0.5 km', price: '£480', stars: 5, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
];

const RESTAURANTS = [
  { name: 'Scott\'s', cuisine: 'Seafood', distance: '0.2 km', price: '££££' },
  { name: 'The Wolseley', cuisine: 'European', distance: '0.3 km', price: '£££' },
  { name: 'Hawksmoor Mayfair', cuisine: 'Steakhouse', distance: '0.5 km', price: '£££' },
  { name: 'Dishoom King\'s Cross', cuisine: 'Indian', distance: '2.1 km', price: '££' },
];

const SPEAKERS = [
  { id: 'james-dyson', name: 'James Dyson', role: 'Founder, Dyson', img: getSpeakerPhoto(18), talk: 'Innovation Through Failure', track: 'Keynote', bio: 'British inventor and industrial designer. Founded Dyson in 1991. Revolutionized vacuum technology and hand dryers. Knighted for services to business. Built a global empire from 5,127 failed prototypes.' },
];

const SCHEDULE = [
  { time: '18:00', title: 'Reception & Drinks', speaker: '-', track: 'All', day: 'Evening', keynote: false },
  { time: '19:00', title: 'An Evening with James Dyson: Innovation Through Failure', speaker: 'James Dyson', track: 'Keynote', day: 'Evening', keynote: true },
  { time: '20:30', title: 'Q&A', speaker: 'James Dyson', track: 'Keynote', day: 'Evening' },
  { time: '21:00', title: 'Networking & Book Signing', speaker: '-', track: 'All', day: 'Evening' },
];

const PRICING = { early_bird: '£95', regular: '£145', vip: '£295' };

export default function AnEveningWithPage() {
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);

  return (
    <main className="min-h-screen relative" style={{ background: 'transparent' }}>
      <ScanlineOverlay color="212,175,55" />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: accentColor, color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="relative px-6 pt-32 pb-24 min-h-[70vh] flex flex-col justify-end overflow-hidden isolate">
        {/* Hero media — z-0 (not -z-10) so it stays visible above body bg */}
        <div className="absolute inset-0 z-0">
          <KenBurnsSlideshow images={SLIDESHOW_IMAGES} />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)' }} />
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}26 0%, transparent 70%)` }} />
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <HelixDNA color={accentColor} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ color: accentColor, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tickets Available</span>
          </div>
          <h1 className="mb-4" style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.3)' }}>An Evening With James Dyson</h1>
          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>Intimate keynote · Innovation through failure</p>
          <div className="flex flex-wrap gap-6 mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2"><span>📍</span><span>London, UK</span></div>
            <div className="flex items-center gap-2"><span>📅</span><span>April 15, 2026 · Evening only</span></div>
            <div className="flex items-center gap-2"><span>👥</span><span><LiveRegistrationCounter count={312} max={400} accentColor={accentColor} /> registered</span></div>
          </div>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Event starts in</p>
            <CountdownTimer endDate="2026-04-15T18:00:00" accentColor={accentColor} />
          </div>
          <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            An intimate evening at The Royal Institution with Sir James Dyson. Hear the story behind 5,127 failed prototypes, the birth of the bagless vacuum, and what it takes to build a global innovation empire.
          </p>
        </div>
      </section>

      <section className="px-6 py-12" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.9) 100%)', borderTop: `1px solid ${accentColor}26`, borderBottom: `1px solid ${accentColor}26` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</div>
              <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Live registration & ticket flow</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><RegistrationLineChart accentColor={accentColor} initialBase={180} /></div>
            <div className="space-y-4"><TicketBarChart soldPct={SOLD_PCT} accentColor={accentColor} colors={[accentColor, '#E8C547', 'var(--color-warm)']} /></div>
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor, '#E8C547']} />

      {/* Interactive Exhibit: Innovation Through Iteration */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(180deg, rgba(25,20,5,0.98) 0%, rgba(15,12,5,0.99) 100%)', borderTop: `1px solid ${accentColor}30`, borderBottom: `1px solid ${accentColor}30` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 24px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Interactive Exhibit</div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>5,127 Prototypes</h2>
            </div>
          </div>
          <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Conway&apos;s Game of Life: simple rules, emergent complexity. Like Dyson&apos;s iterative design — each failure informs the next. From four rules, infinite patterns emerge.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}30`, boxShadow: `0 0 40px ${accentColor}10` }}>
            <GameOfLife width={80} height={55} cellSize={7} color={accentColor} speed={90} />
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</span>
            <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Speaker</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
            {SPEAKERS.map((speaker) => {
              const expanded = expandedSpeaker === speaker.id;
              return (
                <div key={speaker.id} className="card group">
                  <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="50vw" unoptimized />
                  </div>
                  <h3 className="font-semibold mb-1">{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{speaker.talk}</p>
                  <button onClick={() => setExpandedSpeaker(expanded ? null : speaker.id)} className="mt-3 text-xs" style={{ color: accentColor }}>{expanded ? '− Less' : '+ Bio'}</button>
                  {expanded && (
                    <div className="mt-3 flex gap-3 items-start">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                        <Image src={speaker.img} alt={speaker.name} fill className="object-cover" unoptimized />
                      </div>
                      <p className="text-xs flex-1" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{speaker.bio}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
            <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="space-y-0">
              {SCHEDULE.map((item, i) => (
                <div key={i} className="relative flex items-start gap-6 py-5 pl-12">
                  <div className="absolute left-0 w-20 text-right">
                    <span className="text-sm font-medium" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>{item.time}</span>
                  </div>
                  <div className="flex-1 min-w-0 card py-4 flex gap-4">
                    <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: item.track === 'All' ? 'rgba(255,255,255,0.2)' : accentColor }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        {item.keynote && <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${accentColor}20`, color: accentColor }}>Keynote</span>}
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.speaker}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Venue</h2>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image src={VENUE.photo} alt={VENUE.name} width={800} height={400} className="w-full h-48 object-cover" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {VENUE.amenities.map((a) => (
              <span key={a} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{a}</span>
            ))}
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{VENUE.capacity_note}</p>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)', height: 280 }}>
            <iframe title="Venue map" src="https://www.google.com/maps?q=The+Royal+Institution+London&z=15&output=embed" width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Stay & Dine</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {HOTELS.map((h) => (
              <div key={h.name} className="card overflow-hidden">
                <div className="relative h-32 -m-6 mb-4">
                  <Image src={h.img} alt={h.name} fill className="object-cover" />
                </div>
                <h3 className="font-semibold mb-1">{h.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{h.distance} · {'★'.repeat(h.stars)}</p>
                <p className="text-sm font-medium" style={{ color: accentColor }}>{h.price}/night</p>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESTAURANTS.map((r) => (
              <div key={r.name} className="card">
                <h3 className="font-semibold mb-1">{r.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{r.cuisine} · {r.distance} · {r.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Tickets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'early_bird' as const, label: 'Early Bird', price: PRICING.early_bird },
              { tier: 'regular' as const, label: 'Regular', price: PRICING.regular, featured: true },
              { tier: 'vip' as const, label: 'VIP', price: PRICING.vip },
            ].map(({ tier, label, price, featured }) => (
              <div key={tier} className={`card text-center flex flex-col ${featured ? 'border-[rgba(212,175,55,0.3)]' : ''}`} style={featured ? { boxShadow: `0 0 20px ${accentColor}14` } : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: tier === 'vip' ? 'var(--color-warm)' : accentColor }}>{price}</div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT[tier]}%`, background: tier === 'vip' ? 'var(--color-warm)' : accentColor }} />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining(SOLD_PCT[tier], 400)} remaining</p>
                <Link href={`/checkout/an-evening-with?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">Buy Ticket</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation</p>
        <Link href="/affiliate" className="text-sm" style={{ color: 'var(--color-accent)' }}>Earn 40% as affiliate →</Link>
      </footer>
    </main>
  );
}
