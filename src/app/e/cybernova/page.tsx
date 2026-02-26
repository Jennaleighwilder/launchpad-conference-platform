'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RadarSweep, GameOfLife } from '@/components/event-viz';
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

const TRACK_COLORS = ['#1E3A8A', '#DC2626', '#3B82F6', '#EF4444', '#60A5FA'];
const SOLD_PCT = { early_bird: 71, regular: 52, vip: 22 };
const accentColor = '#3B82F6';
const accentRed = '#DC2626';
const SLIDESHOW_IMAGES = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&h=1080&fit=crop',
];

const VENUE = {
  name: 'STATION Berlin',
  address: 'Luckenwalder Str. 4-6, 10963 Berlin',
  capacity_note: 'Industrial tech hub. 2 days of talks + 48hr CTF. Home to Europe\'s largest security gatherings.',
  photo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop',
  amenities: ['Wi-Fi', 'A/V', 'CTF Lab', 'Lockpick Village', 'Catering', '24/7 Access'],
};

const HOTELS = [
  { name: 'Hotel Adlon Kempinski', distance: '2.1 km', price: '€320', stars: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Michelberger Hotel', distance: '0.8 km', price: '€145', stars: 4, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { name: 'Generator Berlin Mitte', distance: '0.5 km', price: '€65', stars: 3, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
];

const RESTAURANTS = [
  { name: 'Katz Orange', cuisine: 'German', distance: '0.3 km', price: '€€€' },
  { name: 'Burgermeister', cuisine: 'Burgers', distance: '0.2 km', price: '€' },
  { name: 'Coda Dessert Bar', cuisine: 'Desserts', distance: '0.4 km', price: '€€€' },
  { name: 'Markthalle Neun', cuisine: 'Street Food', distance: '0.6 km', price: '€€' },
];

const TRACKS = ['Offensive Security', 'Defense & IR', 'CTF & Challenges', 'Zero Trust'];

const SPEAKERS = [
  { id: 'anna-mueller', name: 'Anna Mueller', role: 'Lead Researcher, CrowdStrike', img: getSpeakerPhoto(0), talk: 'APT Trends 2026', track: 'Offensive Security', bio: '15 years tracking nation-state actors. Discovered 12 zero-days. Black Hat keynote speaker.' },
  { id: 'viktor-kowalski', name: 'Viktor Kowalski', role: 'CISO, Deutsche Bank', img: getSpeakerPhoto(1), talk: 'Defending at Scale', track: 'Defense & IR', bio: 'Built security ops for 90K employees. Ex-Mandiant. Incident response veteran.' },
  { id: 'lena-schmidt', name: 'Lena Schmidt', role: 'CTF Champion, HackerOne', img: getSpeakerPhoto(2), talk: 'From CTF to Bug Bounty', track: 'CTF & Challenges', bio: 'DEF CON CTF winner. $2M+ in bounties. Training the next gen of ethical hackers.' },
  { id: 'marc-weber', name: 'Marc Weber', role: 'Principal, Google Security', img: getSpeakerPhoto(3), talk: 'Zero Trust Architecture', track: 'Zero Trust', bio: 'Architected Zero Trust at Google. Author of "Beyond the Perimeter."' },
  { id: 'sophie-berger', name: 'Sophie Berger', role: 'Red Team Lead, Airbus', img: getSpeakerPhoto(4), talk: 'Aviation Security', track: 'Offensive Security', bio: 'Pen-tests aircraft systems. DEF CON speaker. Aviation + infosec pioneer.' },
  { id: 'thomas-bauer', name: 'Thomas Bauer', role: 'Director IR, Palo Alto', img: getSpeakerPhoto(5), talk: 'Ransomware Response', track: 'Defense & IR', bio: 'Led 200+ ransomware investigations. Ransomware task force advisor.' },
  { id: 'yuki-tanaka', name: 'Yuki Tanaka', role: 'CTF Organizer, SECCON', img: getSpeakerPhoto(6), talk: 'Building CTF Infrastructure', track: 'CTF & Challenges', bio: 'Organized SECCON CTF. 50K+ participants. Open-source CTF platform maintainer.' },
  { id: 'david-nguyen', name: 'David Nguyen', role: 'VP Security, Cloudflare', img: getSpeakerPhoto(7), talk: 'Zero Trust at the Edge', track: 'Zero Trust', bio: 'Built Cloudflare\'s Zero Trust stack. Securing 20% of the web.' },
  { id: 'maria-santos', name: 'Maria Santos', role: 'Researcher, Kaspersky', img: getSpeakerPhoto(8), talk: 'IoT Botnets', track: 'Offensive Security', bio: 'Tracks IoT malware families. Discovered Mirai variants. 30+ CVEs.' },
  { id: 'james-okonkwo', name: 'James Okonkwo', role: 'CISO, Siemens', img: getSpeakerPhoto(9), talk: 'OT/IT Convergence', track: 'Defense & IR', bio: 'Securing critical infrastructure. ICS/SCADA expert. NIST contributor.' },
];

const SCHEDULE = [
  { time: '09:00', title: 'Keynote: APT Trends 2026', speaker: 'Anna Mueller', track: 'Offensive Security', day: 'Day 1', keynote: true },
  { time: '09:45', title: 'Defending at Scale', speaker: 'Viktor Kowalski', track: 'Defense & IR', day: 'Day 1' },
  { time: '10:30', title: 'CTF Kickoff — 48hr Challenge Begins', speaker: 'Lena Schmidt', track: 'CTF & Challenges', day: 'Day 1' },
  { time: '11:00', title: 'Zero Trust Architecture', speaker: 'Marc Weber', track: 'Zero Trust', day: 'Day 1' },
  { time: '12:00', title: 'Lunch & Lockpick Village', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '14:00', title: 'Aviation Security', speaker: 'Sophie Berger', track: 'Offensive Security', day: 'Day 1' },
  { time: '14:45', title: 'Ransomware Response', speaker: 'Thomas Bauer', track: 'Defense & IR', day: 'Day 1' },
  { time: '15:30', title: 'Building CTF Infrastructure', speaker: 'Yuki Tanaka', track: 'CTF & Challenges', day: 'Day 1' },
  { time: '09:00', title: 'Day 2 Keynote: Zero Trust at the Edge', speaker: 'David Nguyen', track: 'Zero Trust', day: 'Day 2', keynote: true },
  { time: '09:45', title: 'IoT Botnets', speaker: 'Maria Santos', track: 'Offensive Security', day: 'Day 2' },
  { time: '10:30', title: 'OT/IT Convergence', speaker: 'James Okonkwo', track: 'Defense & IR', day: 'Day 2' },
  { time: '12:00', title: 'CTF Finals & Awards', speaker: 'Lena Schmidt', track: 'CTF & Challenges', day: 'Day 2' },
  { time: '14:00', title: 'Closing & Afterparty', speaker: '-', track: 'All', day: 'Day 2' },
];

const PRICING = { early_bird: '€349', regular: '€499', vip: '€899' };

export default function CybernovaPage() {
  const [scheduleDay, setScheduleDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const scheduleFiltered = SCHEDULE.filter((s) => s.day === scheduleDay);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      <ScanlineOverlay color="59,130,246" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <KenBurnsSlideshow images={SLIDESHOW_IMAGES} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, #1E3A8A26 0%, #DC262615 40%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none">
          <RadarSweep primary="#1E3A8A" secondary="#DC2626" />
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
          <h1 className="mb-4" style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>CyberNova</h1>
          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>2 days + 48hr CTF · 10 security researchers</p>
          <div className="flex flex-wrap gap-6 mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2"><span>📍</span><span>Berlin, Germany</span></div>
            <div className="flex items-center gap-2"><span>📅</span><span>June 18-19, 2026</span></div>
            <div className="flex items-center gap-2"><span>👥</span><span><LiveRegistrationCounter count={892} max={1200} accentColor={accentColor} /> registered</span></div>
          </div>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Event starts in</p>
            <CountdownTimer endDate="2026-06-18T09:00:00" accentColor={accentColor} />
          </div>
          <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            Europe's premier security conference. Two days of talks from 10 researchers. 48-hour Capture The Flag. Lockpick village. Zero Trust, offensive security, incident response.
          </p>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((track, i) => (
              <span key={track} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: `${TRACK_COLORS[i]}20`, border: `1px solid ${TRACK_COLORS[i]}50`, color: TRACK_COLORS[i] }}>{track}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.9) 100%)', borderTop: `1px solid ${accentColor}26`, borderBottom: `1px solid ${accentRed}26` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</div>
              <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Live registration & ticket flow</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><RegistrationLineChart accentColor={accentColor} initialBase={600} /></div>
            <div className="space-y-4"><TicketBarChart soldPct={SOLD_PCT} accentColor={accentColor} colors={[accentColor, accentRed, 'var(--color-warm)']} /></div>
          </div>
        </div>
      </section>

      <WaveDivider colors={['#1E3A8A', '#DC2626']} />

      {/* Interactive Exhibit: Network Life (cyber theme) */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(180deg, rgba(15,20,35,0.98) 0%, rgba(5,5,15,0.99) 100%)', borderTop: `1px solid ${accentColor}30`, borderBottom: `1px solid ${accentRed}20` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 24px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Interactive Exhibit</div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Emergent Network Behavior</h2>
            </div>
          </div>
          <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Conway&apos;s Game of Life: simple rules, infinite complexity. Like malware spreading or defenses propagating. Watch autonomous patterns evolve — no central control.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}30`, boxShadow: `0 0 40px ${accentColor}10` }}>
            <GameOfLife width={90} height={65} cellSize={6} color={accentColor} speed={70} />
          </div>
        </div>
      </section>

      <WaveDivider colors={['#1E3A8A']} />

      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</span>
            <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Speakers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SPEAKERS.map((speaker) => {
              const trackColor = TRACK_COLORS[TRACKS.indexOf(speaker.track) % TRACK_COLORS.length] || accentColor;
              const expanded = expandedSpeaker === speaker.id;
              return (
                <div key={speaker.id} className="card group">
                  <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="20vw" />
                  </div>
                  <h3 className="font-semibold mb-1">{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{speaker.talk}</p>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${trackColor}20`, color: trackColor }}>{speaker.track}</span>
                  <button onClick={() => setExpandedSpeaker(expanded ? null : speaker.id)} className="mt-3 text-xs block" style={{ color: accentColor }}>{expanded ? '− Less' : '+ Bio'}</button>
                  {expanded && <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{speaker.bio}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDivider colors={['#1E3A8A']} />

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

      <WaveDivider colors={['#DC2626']} />

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
            <iframe title="Venue map" src="https://www.google.com/maps?q=STATION+Berlin&z=15&output=embed" width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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

      <WaveDivider colors={['#1E3A8A']} />

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Tickets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'early_bird' as const, label: 'Early Bird', price: PRICING.early_bird },
              { tier: 'regular' as const, label: 'Regular', price: PRICING.regular, featured: true },
              { tier: 'vip' as const, label: 'VIP', price: PRICING.vip },
            ].map(({ tier, label, price, featured }) => (
              <div key={tier} className={`card text-center flex flex-col ${featured ? 'border-[rgba(59,130,246,0.3)]' : ''}`} style={featured ? { boxShadow: `0 0 20px ${accentColor}14` } : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: tier === 'vip' ? 'var(--color-warm)' : accentColor }}>{price}</div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT[tier]}%`, background: tier === 'vip' ? 'var(--color-warm)' : accentColor }} />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining(SOLD_PCT[tier], 1200)} remaining</p>
                <Link href={`/checkout/cybernova?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">Buy Ticket</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation</p>
      </footer>
    </main>
  );
}
