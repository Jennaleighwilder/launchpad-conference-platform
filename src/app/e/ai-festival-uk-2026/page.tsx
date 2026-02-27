'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSpeakerPhoto } from '@/lib/speaker-photos';
import {
  KenBurnsSlideshow,
  WaveDivider,
  LiveRegistrationCounter,
  CountdownTimer,
  ScanlineOverlay,
} from '@/components/demo-event/DemoEventLayout';
import { FALLBACK_HERO_POOL } from '@/lib/hero-images';

const accentColor = '#22C55E';
const TRACK_COLORS = ['#22C55E', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];
const SLIDESHOW_IMAGES = FALLBACK_HERO_POOL.slice(0, 12);

const TRACKS = [
  'PitchFest',
  'Cyber Security',
  'Robotics & Automation',
  'AI & Quantum Computing',
  'Energy Environment & Infrastructure',
  'Agriculture & Food',
  'XR & AI',
  'Creative & Media',
  'Healthcare',
];

const VENUE = {
  name: 'West Suffolk College STEM Centre',
  address: '73 Western Way, Bury St Edmunds IP33 3TB, UK',
  capacity_note: '£2M state-of-the-art XR Lab. Immersive tech, spatial computing, and AI-powered experiences.',
  photo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
  amenities: ['XR Lab', 'Spatial Computing', 'Immersive Tech', 'Wi-Fi', 'A/V', 'Recording'],
};

const SPEAKERS = [
  { id: 's1', name: 'Dr. Sarah Mitchell', role: 'Head of AI, BT Group', img: getSpeakerPhoto(0), talk: 'AI in Critical Infrastructure', track: 'Energy Environment & Infrastructure', bio: 'Leading BT\'s AI strategy for national infrastructure. 15 years in telecoms and energy.' },
  { id: 's2', name: 'James Chen', role: 'Quantum Lead, AWS', img: getSpeakerPhoto(1), talk: 'Quantum Computing & AI', track: 'AI & Quantum Computing', bio: 'AWS quantum research. PhD Cambridge. Bridging quantum and classical ML.' },
  { id: 's3', name: 'Dr. Emma Watson', role: 'Director, Robotics Lab', img: getSpeakerPhoto(2), talk: 'Autonomous Systems in Industry', track: 'Robotics & Automation', bio: 'Industrial robotics pioneer. Ex-Boston Dynamics. Now leading UK automation.' },
  { id: 's4', name: 'Marcus Webb', role: 'CISO, Barclays Eagle Labs', img: getSpeakerPhoto(3), talk: 'AI-Powered Cyber Defence', track: 'Cyber Security', bio: 'Cybersecurity at scale. Former GCHQ. Securing fintech ecosystems.' },
  { id: 's5', name: 'Dr. Priya Patel', role: 'Chief Medical AI, NHS', img: getSpeakerPhoto(4), talk: 'AI in Diagnostics', track: 'Healthcare', bio: 'NHS AI deployment. Clinical validation. 100+ hospitals using her systems.' },
  { id: 's6', name: 'Alex Rivera', role: 'Creative Director, BBC R&D', img: getSpeakerPhoto(5), talk: 'Generative AI in Media', track: 'Creative & Media', bio: 'BBC R&D. AI-generated content. BAFTA-nominated projects.' },
  { id: 's7', name: 'Dr. Tom Hughes', role: 'XR Lab Lead, West Suffolk College', img: getSpeakerPhoto(6), talk: 'Spatial AI & Immersive Learning', track: 'XR & AI', bio: 'Built the £2M XR Lab. Immersive education. AR/VR for skills.' },
  { id: 's8', name: 'Dr. Fiona Green', role: 'AgriTech Director', img: getSpeakerPhoto(7), talk: 'AI for Sustainable Farming', track: 'Agriculture & Food', bio: 'AgriTech innovation. Precision agriculture. Net-zero food systems.' },
  { id: 's9', name: 'Rachel Kim', role: 'Partner, Tech VC', img: getSpeakerPhoto(8), talk: 'PitchFest: What Investors Look For', track: 'PitchFest', bio: 'Early-stage investor. 50+ portfolio companies. AI and deep tech focus.' },
  { id: 's10', name: 'David Okonkwo', role: 'Founder, AgriAI', img: getSpeakerPhoto(9), talk: 'From Farm to Pitch', track: 'PitchFest', bio: 'AgriAI founder. Raised £2M. Scaling AI for agriculture.' },
];

const SCHEDULE = [
  { time: '09:00', title: 'Opening Keynote: AI in the UK', speaker: 'Dr. Sarah Mitchell', track: 'Energy Environment & Infrastructure', day: 'Day 1', keynote: true },
  { time: '09:45', title: 'Quantum Computing & AI', speaker: 'James Chen', track: 'AI & Quantum Computing', day: 'Day 1' },
  { time: '10:30', title: 'Coffee & Networking', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '11:00', title: 'Autonomous Systems in Industry', speaker: 'Dr. Emma Watson', track: 'Robotics & Automation', day: 'Day 1' },
  { time: '11:45', title: 'AI-Powered Cyber Defence', speaker: 'Marcus Webb', track: 'Cyber Security', day: 'Day 1' },
  { time: '12:30', title: 'Lunch & Exhibition', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '13:30', title: 'PitchFest Round 1', speaker: 'Rachel Kim (Judge)', track: 'PitchFest', day: 'Day 1' },
  { time: '14:30', title: 'Energy & Infrastructure Panel', speaker: 'Dr. Sarah Mitchell + panel', track: 'Energy Environment & Infrastructure', day: 'Day 1' },
  { time: '15:30', title: 'XR Lab Demo: Spatial AI', speaker: 'Dr. Tom Hughes', track: 'XR & AI', day: 'Day 1' },
  { time: '16:30', title: 'Networking Reception', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '09:00', title: 'Day 2 Keynote: AI in Healthcare', speaker: 'Dr. Priya Patel', track: 'Healthcare', day: 'Day 2', keynote: true },
  { time: '09:45', title: 'Generative AI in Media', speaker: 'Alex Rivera', track: 'Creative & Media', day: 'Day 2' },
  { time: '10:30', title: 'AI for Sustainable Farming', speaker: 'Dr. Fiona Green', track: 'Agriculture & Food', day: 'Day 2' },
  { time: '11:15', title: 'PitchFest Finals', speaker: 'Rachel Kim, David Okonkwo', track: 'PitchFest', day: 'Day 2' },
  { time: '12:30', title: 'Lunch & Demos', speaker: '-', track: 'All', day: 'Day 2' },
  { time: '13:30', title: 'Panel: The Future of UK AI', speaker: 'Multiple speakers', track: 'All', day: 'Day 2' },
  { time: '14:30', title: 'XR Lab Open Session', speaker: 'Dr. Tom Hughes', track: 'XR & AI', day: 'Day 2' },
  { time: '15:30', title: 'Closing Remarks & Awards', speaker: '-', track: 'All', day: 'Day 2' },
  { time: '16:00', title: 'Festival Close', speaker: '-', track: 'All', day: 'Day 2' },
];

const PROMO_VIDEOS = [
  { src: '/videos/9b68ed1f-ef9b-437c-b0bc-642f911e47a3_hd.mp4', title: 'AI Festival Promo 1' },
  { src: '/videos/8d0ea574-bdda-47c4-8ce8-e9318d70e7b8_hd.mp4', title: 'AI Festival Promo 2' },
  { src: '/videos/19a52e15-e11c-41a2-89ae-6a7949390ff3_hd.mp4', title: 'AI Festival Promo 3' },
  { src: '/videos/38bf5980-84f6-41a7-b7a0-843826866b12_hd.mp4', title: 'AI Festival Promo 4' },
  { src: '/videos/238b20ff-eae0-44a1-9ec7-edb208aee28a_hd.mp4', title: 'AI Festival Promo 5' },
  { src: '/videos/a190cbaa-1e3f-4be5-8582-54908502fd04_hd.mp4', title: 'AI Festival Promo 6' },
  { src: '/videos/b95c83b8-f526-44e8-bb61-df4568c392dd_hd.mp4', title: 'AI Festival Promo 7' },
  { src: '/videos/ba94a4eb-7348-4b66-9acf-3a784b39eeed_hd.mp4', title: 'AI Festival Promo 8' },
  { src: '/videos/Bayou_Scene_Video_Generation.mp4', title: 'Bayou Scene' },
];

const HOTELS = [
  { name: 'The Angel Hotel', distance: '8 min walk', price: '£120', stars: 4, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Premier Inn Town Centre', distance: '12 min walk', price: '£75', stars: 3, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { name: 'Ravenwood Hall', distance: '15 min drive', price: '£180', stars: 4, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
  { name: 'Premier Inn North', distance: '10 min drive', price: '£65', stars: 3, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
];

const DINING = [
  { name: 'Bellota', cuisine: 'Chef\'s table tasting menu', rating: '4.9★', distance: '0.5 km' },
  { name: 'Verve', cuisine: 'Cocktails & pizza', rating: '4.8★', distance: '0.6 km' },
  { name: 'Rustico', cuisine: 'Italian · near venue', rating: '4.7★', distance: '0.3 km' },
  { name: 'Damson & Wilde', cuisine: 'Modern British', rating: '4.6★', distance: '0.7 km' },
  { name: 'Edmunds Restaurant', cuisine: 'At West Suffolk College', rating: '4.9★', distance: 'On site' },
];

const COFFEE = [
  { name: 'Midgar Coffee', rating: '4.7★', note: 'Specialty roasters' },
  { name: 'Sector 7', rating: '5.0★', note: 'Independent' },
  { name: 'Blend Coffee & Wine', rating: '4.8★', note: 'All-day' },
  { name: 'The Suffolk Carver', rating: '4.7★', note: 'Café & deli' },
];

const EXPLORE = [
  { name: 'Abbey Gardens & Ruins', note: 'Historic abbey, botanical gardens' },
  { name: 'Arc Shopping Centre', note: 'High street shopping' },
  { name: 'West Stow Anglo-Saxon Village', note: 'Living history, 15 min drive' },
];

const TRANSPORT = [
  { mode: 'Train', note: 'Bury St Edmunds station · 15 min walk to venue · Direct from Cambridge, Ipswich' },
  { mode: 'Bus', note: 'Suffolk County Council routes · Stop near STEM Centre' },
  { mode: 'Parking', note: 'On-site parking at West Suffolk College' },
];

const SPONSORS = [
  { name: 'BT', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=120&h=60&fit=crop' },
  { name: 'Orbital Global', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=60&fit=crop' },
  { name: 'VirtTuri', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=60&fit=crop' },
  { name: 'AWS', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=120&h=60&fit=crop' },
  { name: 'Barclays Eagle Labs', tier: 'Platinum', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&h=60&fit=crop' },
  { name: 'University of Essex', tier: 'Academic', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&h=60&fit=crop' },
  { name: 'UEA', tier: 'Academic', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&h=60&fit=crop' },
  { name: 'University of Suffolk', tier: 'Academic', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&h=60&fit=crop' },
  { name: 'Eastern Education Group', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=120&h=60&fit=crop' },
  { name: 'Birketts', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&h=60&fit=crop' },
  { name: 'Connected Innovation', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=60&fit=crop' },
  { name: 'Creative East', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=60&fit=crop' },
  { name: 'Health Innovation East', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=120&h=60&fit=crop' },
  { name: 'Babergh Mid Suffolk', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&h=60&fit=crop' },
  { name: 'Suffolk Economy', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=60&fit=crop' },
  { name: 'Tech East', tier: 'Partner', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=60&fit=crop' },
];

type LocalTab = 'hotels' | 'dining' | 'coffee' | 'explore';

export default function AIFestivalUK2026Page() {
  const [scheduleDay, setScheduleDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const [localTab, setLocalTab] = useState<LocalTab>('hotels');
  const scheduleFiltered = SCHEDULE.filter((s) => s.day === scheduleDay);

  return (
    <main className="min-h-screen relative" style={{ background: 'transparent' }}>
      <ScanlineOverlay color="34,197,94" />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: accentColor, color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <a href="#local-guide" className="text-sm hover:text-[var(--color-accent)] transition-colors hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>Hotels</a>
          <a href="#local-guide" className="text-sm hover:text-[var(--color-accent)] transition-colors hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>Dining</a>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="relative px-6 pt-32 pb-24 min-h-[70vh] flex flex-col justify-end overflow-hidden isolate">
        <div className="absolute inset-0 z-0">
          <KenBurnsSlideshow images={SLIDESHOW_IMAGES} />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.8) 100%)' }} />
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}26 0%, transparent 70%)` }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
            <span style={{ color: accentColor, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>30% Early Bird</span>
          </div>
          <h1 className="mb-4" style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>AI Festival UK 2026</h1>
          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>10 tracks · 2 days · Bury St Edmunds</p>
          <div className="flex flex-wrap gap-6 mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2"><span>📍</span><span>STEM Centre, 73 Western Way, Bury St Edmunds</span></div>
            <div className="flex items-center gap-2"><span>📅</span><span>May 27–28, 2026</span></div>
            <div className="flex items-center gap-2"><span>👥</span><span><LiveRegistrationCounter count={1247} max={2000} accentColor={accentColor} /> registered</span></div>
          </div>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Festival starts in</p>
            <CountdownTimer endDate="2026-05-27T09:00:00" accentColor={accentColor} />
          </div>
          <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            The UK&apos;s premier AI festival. Two days at West Suffolk College&apos;s STEM Centre (£2M XR Lab). Energy, Quantum, Robotics, Cyber, Healthcare, Creative, XR, Agriculture, and PitchFest.
          </p>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((track, i) => (
              <span key={track} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: `${TRACK_COLORS[i % TRACK_COLORS.length]}20`, border: `1px solid ${TRACK_COLORS[i % TRACK_COLORS.length]}50`, color: TRACK_COLORS[i % TRACK_COLORS.length] }}>{track}</span>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-20" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Speakers</span>
            <h2 className="text-base font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>10 experts across 9 tracks</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {SPEAKERS.map((speaker, i) => {
              const trackColor = TRACK_COLORS[TRACKS.indexOf(speaker.track) % TRACK_COLORS.length] || accentColor;
              const expanded = expandedSpeaker === speaker.id;
              return (
                <div key={speaker.id} className="card group">
                  <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="20vw" unoptimized />
                  </div>
                  <h3 className="font-semibold mb-1.5 text-base">{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-1.5" style={{ color: accentColor, lineHeight: 1.4 }}>{speaker.talk}</p>
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

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
              <h2 className="text-base font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
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
                    <div className="flex-1 min-w-0 card py-5 flex gap-4">
                      <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: item.track === 'All' ? 'rgba(255,255,255,0.2)' : barColor }} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-base">{item.title}</span>
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

      <section className="px-6 py-16" style={{ background: 'linear-gradient(180deg, rgba(34,197,94,0.03) 0%, transparent 100%)', borderTop: `1px solid ${accentColor}26`, borderBottom: `1px solid ${accentColor}26` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Watch</div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Promo videos</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {PROMO_VIDEOS.map((v) => (
              <div key={v.src} className="card overflow-hidden group">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <video
                    src={v.src}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
                <h3 className="font-semibold text-sm">{v.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Sponsors</h2>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {SPONSORS.map((s) => (
              <div key={s.name} className="card px-6 py-4 flex flex-col items-center gap-2 min-w-[100px]">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image src={s.logo} alt={s.name} fill className="object-contain" unoptimized />
                </div>
                <span className="font-medium text-sm">{s.name}</span>
                <span className="text-xs" style={{ color: accentColor }}>{s.tier}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-base font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Venue</h2>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image src={VENUE.photo} alt={VENUE.name} width={800} height={400} className="w-full h-48 object-cover" unoptimized />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {VENUE.amenities.map((a) => (
              <span key={a} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{a}</span>
            ))}
          </div>
          <p className="text-base mb-4" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{VENUE.capacity_note}</p>
          <div className="flex flex-wrap gap-3 mb-6">
            {TRANSPORT.map((t) => (
              <div key={t.mode} className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="font-medium text-sm">{t.mode}</span>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{t.note}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)', height: 280 }}>
            <iframe title="Venue map" src="https://www.google.com/maps?q=STEM+Centre+73+Western+Way+Bury+St+Edmunds&z=15&output=embed" width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section id="local-guide" className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Stay & Explore</h2>
          <p className="text-base mb-8" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Real local picks near West Suffolk College. Hotels, dining, coffee, and things to do in Bury St Edmunds.</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {(['hotels', 'dining', 'coffee', 'explore'] as const).map((tab) => (
              <button key={tab} onClick={() => setLocalTab(tab)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors" style={{ background: localTab === tab ? accentColor : 'rgba(255,255,255,0.05)', color: localTab === tab ? 'var(--color-bg)' : 'var(--color-text-muted)', border: localTab === tab ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>{tab}</button>
            ))}
          </div>
          {localTab === 'hotels' && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HOTELS.map((h) => (
                  <div key={h.name} className="card overflow-hidden">
                    <div className="relative h-32 -m-6 mb-4">
                      <Image src={h.img} alt={h.name} fill className="object-cover" unoptimized />
                    </div>
                    <h3 className="font-semibold mb-1">{h.name}</h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{h.distance} · {'★'.repeat(h.stars)}</p>
                    <p className="text-sm font-medium" style={{ color: accentColor }}>{h.price}/night</p>
                  </div>
                ))}
              </div>
              <a href="https://www.booking.com/searchresults.html?ss=Bury+St+Edmunds&checkin=2026-05-27&checkout=2026-05-29" target="_blank" rel="noopener noreferrer" className="inline-block mt-6 text-sm font-medium" style={{ color: accentColor }}>View all hotels in Bury St Edmunds →</a>
            </>
          )}
          {localTab === 'dining' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DINING.map((r) => (
                <div key={r.name} className="card">
                  <h3 className="font-semibold mb-1">{r.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{r.cuisine} · {r.distance}</p>
                  <p className="text-xs mt-1" style={{ color: accentColor }}>{r.rating}</p>
                </div>
              ))}
            </div>
          )}
          {localTab === 'coffee' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COFFEE.map((c) => (
                <div key={c.name} className="card">
                  <h3 className="font-semibold mb-1">{c.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.note}</p>
                  <p className="text-xs mt-1" style={{ color: accentColor }}>{c.rating}</p>
                </div>
              ))}
            </div>
          )}
          {localTab === 'explore' && (
            <div className="grid sm:grid-cols-3 gap-6">
              {EXPLORE.map((e) => (
                <div key={e.name} className="card">
                  <h3 className="font-semibold mb-2">{e.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{e.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Tickets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'day1' as const, label: 'Day 1', price: '£49', desc: 'May 27 · All tracks' },
              { tier: 'full' as const, label: 'Full Festival', price: '£89', desc: 'May 27–28 · 30% early bird', featured: true },
              { tier: 'day2' as const, label: 'Day 2', price: '£49', desc: 'May 28 · All tracks' },
            ].map(({ tier, label, price, desc, featured }) => (
              <div key={tier} className={`card text-center flex flex-col ${featured ? 'border-[rgba(34,197,94,0.3)]' : ''}`} style={featured ? { boxShadow: `0 0 20px ${accentColor}14` } : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>{price}</div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
                <Link href={`/checkout/ai-festival-uk-2026?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">Buy Ticket</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation</p>
        <Link href="/affiliate" className="text-sm" style={{ color: accentColor }}>Earn 40% as affiliate →</Link>
      </footer>
    </main>
  );
}
