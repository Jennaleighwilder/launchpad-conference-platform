'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MatrixRain, PrisonerDilemmaKaleidoscope } from '@/components/event-viz';
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

const TRACK_COLORS = ['#EC4899', '#F472B6', '#FB7185', '#F9A8D4', '#FBCFE8'];
const SOLD_PCT = { early_bird: 82, regular: 58, vip: 18 };
const accentColor = '#EC4899';
const SLIDESHOW_IMAGES = [
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1920&h=1080&fit=crop',
];

const VENUE = {
  name: 'Tokyo International Forum',
  address: '3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005',
  capacity_note: 'Stunning glass atrium. Premier venue for global gatherings. Gen Z energy meets Japanese precision.',
  photo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop',
  amenities: ['Wi-Fi', 'A/V', 'Green Room', 'Expo Hall', 'Catering', 'Interpretation'],
};

const HOTELS = [
  { name: 'Palace Hotel Tokyo', distance: '0.5 km', price: '¥45,000', stars: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Mandarin Oriental Tokyo', distance: '0.8 km', price: '¥62,000', stars: 5, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { name: 'Shinagawa Prince Hotel', distance: '2.1 km', price: '¥18,000', stars: 4, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
];

const RESTAURANTS = [
  { name: 'Sushi Saito', cuisine: 'Sushi', distance: '0.4 km', price: '¥¥¥¥' },
  { name: 'Ramen Jiro', cuisine: 'Ramen', distance: '0.6 km', price: '¥' },
  { name: 'Izakaya Gonpachi', cuisine: 'Japanese', distance: '0.3 km', price: '¥¥¥' },
  { name: 'Tsukiji Market', cuisine: 'Street Food', distance: '1.2 km', price: '¥¥' },
];

const TRACKS = ['Gen Z Leadership', 'Climate Action', 'Digital Identity', 'Future of Work'];

const SPEAKERS = [
  { id: 'yuki-tanaka', name: 'Yuki Tanaka', role: 'CEO, NextGen Labs', img: getSpeakerPhoto(24), talk: 'Leading at 28', track: 'Gen Z Leadership', bio: 'Founded NextGen Labs at 24. Forbes 30 Under 30. Building the future of sustainable tech in Tokyo.' },
  { id: 'marcus-okonkwo', name: 'Marcus Okonkwo', role: 'Founder, AfriTech', img: getSpeakerPhoto(25), talk: 'Climate Tech in Africa', track: 'Climate Action', bio: '29. Raised $20M for solar microgrids. UN Youth Ambassador. TED speaker.' },
  { id: 'sakura-yamamoto', name: 'Sakura Yamamoto', role: 'CTO, MetaVerse Inc', img: getSpeakerPhoto(26), talk: 'Digital Identity & Web3', track: 'Digital Identity', bio: '27. Ex-Google. Building decentralized identity systems. 50K Twitter followers.' },
  { id: 'alex-rivera', name: 'Alex Rivera', role: 'Head of Future of Work, Stripe', img: getSpeakerPhoto(27), talk: 'Remote-First at Scale', track: 'Future of Work', bio: '31. Led Stripe\'s distributed teams. Author of "Async by Default."' },
  { id: 'zara-patel', name: 'Zara Patel', role: 'CEO, GreenByte', img: getSpeakerPhoto(28), talk: 'Carbon-Neutral Cloud', track: 'Climate Action', bio: '26. GreenByte raised $15M Series A. Making cloud computing sustainable.' },
  { id: 'kenji-watanabe', name: 'Kenji Watanabe', role: 'Founder, DAO Collective', img: getSpeakerPhoto(29), talk: 'Governance Without Hierarchy', track: 'Digital Identity', bio: '30. Built one of Asia\'s largest DAOs. 100K members. No bosses.' },
  { id: 'maya-okoye', name: 'Maya Okoye', role: 'VP Product, Notion', img: getSpeakerPhoto(30), talk: 'Tools for Async Teams', track: 'Future of Work', bio: '28. Scaled Notion to 30M users. Passionate about work-life integration.' },
  { id: 'david-kim', name: 'David Kim', role: 'Activist, Fridays for Future', img: getSpeakerPhoto(31), talk: 'Youth-Led Climate Action', track: 'Climate Action', bio: '24. Organizer of Tokyo climate strikes. 500K Instagram. Voice of a generation.' },
];

const SCHEDULE = [
  { time: '09:00', title: 'Opening: The Gen Z Manifesto', speaker: 'Yuki Tanaka', track: 'Gen Z Leadership', day: 'Day 1', keynote: true },
  { time: '09:45', title: 'Climate Tech in Africa', speaker: 'Marcus Okonkwo', track: 'Climate Action', day: 'Day 1' },
  { time: '10:30', title: 'Digital Identity & Web3', speaker: 'Sakura Yamamoto', track: 'Digital Identity', day: 'Day 1' },
  { time: '11:15', title: 'Coffee & Networking', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '11:45', title: 'Remote-First at Scale', speaker: 'Alex Rivera', track: 'Future of Work', day: 'Day 1' },
  { time: '12:30', title: 'Lunch & Exhibition', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '14:00', title: 'Carbon-Neutral Cloud', speaker: 'Zara Patel', track: 'Climate Action', day: 'Day 1' },
  { time: '14:45', title: 'Governance Without Hierarchy', speaker: 'Kenji Watanabe', track: 'Digital Identity', day: 'Day 1' },
  { time: '15:30', title: 'Tools for Async Teams', speaker: 'Maya Okoye', track: 'Future of Work', day: 'Day 1' },
  { time: '09:00', title: 'Day 2 Keynote: Youth-Led Action', speaker: 'David Kim', track: 'Climate Action', day: 'Day 2', keynote: true },
  { time: '09:45', title: 'Leading at 28', speaker: 'Yuki Tanaka', track: 'Gen Z Leadership', day: 'Day 2' },
  { time: '10:30', title: 'Panel: The Future is Now', speaker: 'All speakers', track: 'All', day: 'Day 2' },
  { time: '12:00', title: 'Closing & Afterparty', speaker: '-', track: 'All', day: 'Day 2' },
];

const PRICING = { early_bird: '¥12,000', regular: '¥18,000', vip: '¥45,000' };

export default function TheFutureForumPage() {
  const [scheduleDay, setScheduleDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const scheduleFiltered = SCHEDULE.filter((s) => s.day === scheduleDay);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      <ScanlineOverlay color="236,72,153" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <KenBurnsSlideshow images={SLIDESHOW_IMAGES} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}26 0%, transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none">
          <MatrixRain color={accentColor} />
        </div>
      </div>

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

      <section className="relative px-6 pt-32 pb-24 min-h-[70vh] flex flex-col justify-end">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ color: accentColor, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tickets Available</span>
          </div>
          <h1 className="mb-4" style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>The Future Forum</h1>
          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>Gen Z energy · 8 under-35 leaders</p>
          <div className="flex flex-wrap gap-6 mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2"><span>📍</span><span>Tokyo, Japan</span></div>
            <div className="flex items-center gap-2"><span>📅</span><span>May 12-13, 2026</span></div>
            <div className="flex items-center gap-2"><span>👥</span><span><LiveRegistrationCounter count={1247} max={1500} accentColor={accentColor} /> registered</span></div>
          </div>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Event starts in</p>
            <CountdownTimer endDate="2026-05-12T09:00:00" accentColor={accentColor} />
          </div>
          <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            Where Gen Z leads. Two days with 8 leaders under 35 — climate activists, DAO builders, remote-work pioneers — shaping the future from Tokyo.
          </p>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((track, i) => (
              <span key={track} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: `${TRACK_COLORS[i]}20`, border: `1px solid ${TRACK_COLORS[i]}50`, color: TRACK_COLORS[i] }}>{track}</span>
            ))}
          </div>
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
            <div className="md:col-span-2"><RegistrationLineChart accentColor={accentColor} initialBase={800} /></div>
            <div className="space-y-4"><TicketBarChart soldPct={SOLD_PCT} accentColor={accentColor} colors={[accentColor, '#F472B6', 'var(--color-warm)']} /></div>
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor, '#F472B6']} />

      {/* Interactive Exhibit: Cooperation Kaleidoscope */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(180deg, rgba(20,5,25,0.98) 0%, rgba(5,5,15,0.99) 100%)', borderTop: `1px solid ${accentColor}30`, borderBottom: `1px solid ${accentColor}30` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 24px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Interactive Exhibit</div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Cooperation & Collective Action</h2>
            </div>
          </div>
          <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Spatial game theory: when cooperation spreads across a network. Gen Z leads through collective action — climate, DAOs, community. Teal = cooperate. Watch patterns emerge.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}30`, boxShadow: `0 0 40px ${accentColor}15` }}>
            <PrisonerDilemmaKaleidoscope size={72} cellSize={5} speed={90} colors={{ cooperator: accentColor, defector: '#1a0a14', flipToC: '#f9a8d4', flipToD: '#fb7185' }} />
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</span>
            <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Speakers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {SPEAKERS.map((speaker) => {
              const trackColor = TRACK_COLORS[TRACKS.indexOf(speaker.track) % TRACK_COLORS.length] || accentColor;
              const expanded = expandedSpeaker === speaker.id;
              return (
                <div key={speaker.id} className="card group">
                  <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="25vw" unoptimized />
                  </div>
                  <h3 className="font-semibold mb-1">{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{speaker.talk}</p>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${trackColor}20`, color: trackColor }}>{speaker.track}</span>
                  <button onClick={() => setExpandedSpeaker(expanded ? null : speaker.id)} className="mt-3 text-xs block" style={{ color: accentColor }}>{expanded ? '− Less' : '+ Bio'}</button>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
              <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
            </div>
            <div className="flex gap-2">
              {(['Day 1', 'Day 2'] as const).map((d) => (
                <button key={d} onClick={() => setScheduleDay(d)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ background: scheduleDay === d ? accentColor : 'rgba(255,255,255,0.05)', color: scheduleDay === d ? 'var(--color-bg)' : 'var(--color-text-muted)', border: scheduleDay === d ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>{d}</button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="space-y-0">
              {scheduleFiltered.map((item, i) => {
                const trackIdx = TRACKS.indexOf(item.track);
                const barColor = trackIdx >= 0 ? TRACK_COLORS[trackIdx % TRACK_COLORS.length] : accentColor;
                return (
                  <div key={i} className="relative flex items-start gap-6 py-5 pl-12">
                    <div className="absolute left-0 w-20 text-right">
                      <span className="text-sm font-medium" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>{item.time}</span>
                    </div>
                    <div className="flex-1 min-w-0 card py-4 flex gap-4">
                      <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: item.track === 'All' ? 'rgba(255,255,255,0.2)' : barColor }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {item.keynote && <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${accentColor}20`, color: accentColor }}>Keynote</span>}
                        </div>
                        <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{item.speaker}</div>
                        {item.track !== 'All' && <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded" style={{ background: `${barColor}20`, color: barColor }}>{item.track}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
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
            <iframe title="Venue map" src="https://www.google.com/maps?q=Tokyo+International+Forum&z=15&output=embed" width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
              <div key={tier} className={`card text-center flex flex-col ${featured ? 'border-[rgba(236,72,153,0.3)]' : ''}`} style={featured ? { boxShadow: `0 0 20px ${accentColor}14` } : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: tier === 'vip' ? 'var(--color-warm)' : accentColor }}>{price}</div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT[tier]}%`, background: tier === 'vip' ? 'var(--color-warm)' : accentColor }} />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining(SOLD_PCT[tier], 1500)} remaining</p>
                <Link href={`/checkout/the-future-forum?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">Buy Ticket</Link>
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
