'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSpeakerPhoto } from '@/lib/speaker-photos';
import { getUniqueHeroVideoForEvent } from '@/lib/hero-videos';
import {
  WaveDivider,
  LiveRegistrationCounter,
  CountdownTimer,
} from '@/components/demo-event/DemoEventLayout';
import { PromoteModal } from '@/components/PromoteModal';
import { DemoCustomizeModal } from '@/components/DemoCustomizeModal';

const accentColor = '#00F5D4';
const HERO_VIDEO = getUniqueHeroVideoForEvent('AI Festival', 'Bury St Edmunds', 'ai-festival-uk-2026');
const TRACK_COLORS = ['#22C55E', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316'];

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

const HOTELS = [
  { name: 'The Angel Hotel', distance: '8 min walk', price: '£120', stars: 4, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Angel+Hotel+Bury+St+Edmunds' },
  { name: 'Premier Inn Town Centre', distance: '12 min walk', price: '£75', stars: 3, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Premier+Inn+Bury+St+Edmunds+Town+Centre' },
  { name: 'Ravenwood Hall', distance: '15 min drive', price: '£180', stars: 4, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ravenwood+Hall+Hotel+Suffolk' },
  { name: 'Premier Inn North', distance: '10 min drive', price: '£65', stars: 3, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Premier+Inn+Bury+St+Edmunds+North' },
];

const DINING = [
  { name: 'Bellota', cuisine: 'Chef\'s table tasting menu', rating: '4.9★', distance: '0.5 km', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bellota+Bury+St+Edmunds' },
  { name: 'Verve', cuisine: 'Cocktails & pizza', rating: '4.8★', distance: '0.6 km', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Verve+Bury+St+Edmunds' },
  { name: 'Rustico', cuisine: 'Italian · near venue', rating: '4.7★', distance: '0.3 km', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rustico+Italian+Bury+St+Edmunds' },
  { name: 'Damson & Wilde', cuisine: 'Modern British', rating: '4.6★', distance: '0.7 km', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Damson+Wilde+Bury+St+Edmunds' },
  { name: 'Edmunds Restaurant', cuisine: 'At West Suffolk College', rating: '4.9★', distance: 'On site', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Edmunds+Restaurant+West+Suffolk+College' },
];

const COFFEE = [
  { name: 'Midgar Coffee', rating: '4.7★', note: 'Specialty roasters', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Midgar+Coffee+Bury+St+Edmunds' },
  { name: 'Sector 7', rating: '5.0★', note: 'Independent', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sector+7+Bury+St+Edmunds' },
  { name: 'Blend Coffee & Wine', rating: '4.8★', note: 'All-day', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blend+Coffee+Wine+Bury+St+Edmunds' },
  { name: 'The Suffolk Carver', rating: '4.7★', note: 'Café & deli', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Suffolk+Carver+Bury+St+Edmunds' },
];

const EXPLORE = [
  { name: 'Abbey Gardens & Ruins', note: 'Historic abbey, botanical gardens', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Abbey+Gardens+Bury+St+Edmunds' },
  { name: 'Arc Shopping Centre', note: 'High street shopping', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Arc+Shopping+Centre+Bury+St+Edmunds' },
  { name: 'West Stow Anglo-Saxon Village', note: 'Living history, 15 min drive', mapsUrl: 'https://www.google.com/maps/search/?api=1&query=West+Stow+Anglo-Saxon+Village' },
];

const TRANSPORT = [
  { mode: 'Train', note: 'Bury St Edmunds station · 15 min walk to venue · Direct from Cambridge, Ipswich' },
  { mode: 'Bus', note: 'Suffolk County Council routes · Stop near STEM Centre' },
  { mode: 'Parking', note: 'On-site parking at West Suffolk College' },
];

const SPONSORS = [
  { name: 'BT', tier: 'Platinum' },
  { name: 'Orbital Global', tier: 'Platinum' },
  { name: 'VirtTuri', tier: 'Platinum' },
  { name: 'AWS', tier: 'Platinum' },
  { name: 'Barclays Eagle Labs', tier: 'Platinum' },
  { name: 'University of Essex', tier: 'Academic' },
  { name: 'UEA', tier: 'Academic' },
  { name: 'University of Suffolk', tier: 'Academic' },
  { name: 'Eastern Education Group', tier: 'Partner' },
  { name: 'Birketts', tier: 'Partner' },
  { name: 'Connected Innovation', tier: 'Partner' },
  { name: 'Creative East', tier: 'Partner' },
  { name: 'Health Innovation East', tier: 'Partner' },
  { name: 'Babergh Mid Suffolk', tier: 'Partner' },
  { name: 'Suffolk Economy', tier: 'Partner' },
  { name: 'Tech East', tier: 'Partner' },
];

const VENUE_GALLERY = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
];

type LocalTab = 'hotels' | 'dining' | 'coffee' | 'explore';

function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

export default function AIFestivalUK2026Page() {
  const [scheduleDay, setScheduleDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const [localTab, setLocalTab] = useState<LocalTab>('hotels');
  const [showPromo, setShowPromo] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const scheduleFiltered = SCHEDULE.filter((s) => s.day === scheduleDay);

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: 'AI Festival UK 2026',
      description: 'Two-day AI festival at West Suffolk College STEM Centre. PitchFest, keynotes, XR Lab demos, and 9 tracks including AI & Quantum, Cyber Security, Healthcare, and more.',
      startDate: '2026-05-27T09:00:00',
      endDate: '2026-05-28T16:00:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: VENUE.name,
        address: { '@type': 'PostalAddress', streetAddress: VENUE.address, addressLocality: 'Bury St Edmunds', addressCountry: 'GB' },
      },
      organizer: { '@type': 'Organization', name: 'Launchpad', url: 'https://launchpad-conference-platform.vercel.app' },
      offers: { '@type': 'Offer', url: 'https://launchpad-conference-platform.vercel.app/e/ai-festival-uk-2026', availability: 'https://schema.org/InStock' },
      performer: SPEAKERS.slice(0, 5).map((s) => ({ '@type': 'Person', name: s.name })),
    };
    let el = document.getElementById('event-schema');
    if (!el) {
      el = document.createElement('script');
      el.id = 'event-schema';
      el.setAttribute('type', 'application/ld+json');
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    document.title = 'AI Festival UK 2026 — Bury St Edmunds | Launchpad';
    return () => { el?.remove(); };
  }, []);

  return (
    <main className="min-h-screen relative" style={{ background: 'transparent' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(0,245,212,0.12)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00F5D4, #00D4AA)', color: '#0A0A0A', boxShadow: `0 0 15px ${accentColor}40` }}>L</div>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 500 }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <a href="#speakers" className="text-sm hover:text-[#00F5D4] transition-colors hidden sm:block font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>Speakers</a>
          <a href="#programme" className="text-sm hover:text-[#00F5D4] transition-colors hidden sm:block font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>Programme</a>
          <a href="#tickets" className="text-sm hover:text-[#00F5D4] transition-colors hidden sm:block font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>Tickets</a>
          <a href="#local-guide" className="text-sm hover:text-[#00F5D4] transition-colors hidden sm:block font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>Local Guide</a>
          <Link href="/checkout/ai-festival-uk-2026?tier=full&price=%C2%A389" className="text-sm font-medium px-5 py-2.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #00F5D4, #00D4AA)', color: '#0A0A0A', boxShadow: `0 0 20px ${accentColor}30` }}>Get Tickets</Link>
        </div>
      </nav>

      {/* World Fair 2090 — immersive hero with video */}
      <section className="relative px-6 pt-36 pb-28 min-h-[85vh] flex flex-col justify-center overflow-hidden isolate">
        <div className="absolute inset-0 z-0">
          <video
            src={HERO_VIDEO}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/hero-ai-festival-space.png"
          />
        </div>
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 25%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.98) 100%)' }} />
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 40%, ${accentColor}20 0%, transparent 50%)` }} />
        <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px', perspective: '1000px' }} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] mb-6 font-mono" style={{ color: accentColor, letterSpacing: '0.35em', textShadow: `0 0 20px ${accentColor}60` }}>West Suffolk College · Bury St Edmunds</p>
          <h1 className="mb-6 text-white" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.75rem, 7vw, 5rem)', lineHeight: 1, fontWeight: 400, letterSpacing: '-0.03em', textShadow: `0 0 60px ${accentColor}40, 0 2px 30px rgba(0,0,0,0.6)` }}>AI Festival UK 2026</h1>
          <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontFamily: 'var(--font-display)' }}>
            The UK&apos;s premier AI festival. Two days of keynotes, PitchFest, and 10 tracks — from Quantum & Cyber to Healthcare, XR, and AgriTech — at West Suffolk College&apos;s £2M XR Lab.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9375rem', fontFamily: 'var(--font-mono)' }}>
            <span>27–28 May 2026</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span>West Suffolk College STEM Centre</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>
            <span><LiveRegistrationCounter count={1247} max={2000} accentColor={accentColor} /> registered</span>
          </div>
          <div className="mb-10">
            <CountdownTimer endDate="2026-05-27T09:00:00" accentColor={accentColor} />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/checkout/ai-festival-uk-2026?tier=full&price=%C2%A389" className="px-10 py-4 text-base font-medium rounded-lg transition-all hover:opacity-95 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00F5D4 0%, #00D4AA 100%)', color: '#0A0A0A', boxShadow: `0 0 30px ${accentColor}50` }}>Get Tickets — £89</Link>
            <button onClick={() => setShowPromo(true)} className="px-6 py-4 text-sm font-medium rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,245,212,0.3)', color: accentColor }}>Promote</button>
            <button onClick={() => setShowCustomize(true)} className="px-6 py-4 text-sm font-medium rounded-lg transition-colors" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>Customize</button>
          </div>
          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>30% early bird · Full festival from £89</p>
        </div>
      </section>

      {/* Tracks — glassmorphism panel */}
      <section className="px-6 py-14" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,245,212,0.15)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] mb-6 font-mono" style={{ color: accentColor }}>10 tracks</p>
          <div className="flex flex-wrap justify-center gap-2">
            {TRACKS.map((track, i) => (
              <span key={track} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:scale-105" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,245,212,0.2)', color: TRACK_COLORS[i % TRACK_COLORS.length], boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>{track}</span>
            ))}
          </div>
        </div>
      </section>

      <PromoteModal
        open={showPromo}
        onClose={() => setShowPromo(false)}
        event={{
          name: 'AI Festival UK 2026',
          topic: 'AI & Machine Learning',
          city: 'Bury St Edmunds',
          date: '2026-05-27',
          description: "The UK's premier AI festival. Two days at West Suffolk College's STEM Centre (£2M XR Lab).",
          tagline: '10 tracks · 2 days · Bury St Edmunds',
          speakers: SPEAKERS.map((s) => ({ name: s.name, role: s.role })),
          tracks: TRACKS,
          pricing: { early_bird: '£49', regular: '£89', vip: '£89', currency: 'GBP' },
          venue: { name: VENUE.name, address: VENUE.address },
          slug: 'ai-festival-uk-2026',
        }}
        accentColor={accentColor}
      />
      <DemoCustomizeModal open={showCustomize} onClose={() => setShowCustomize(false)} accentColor={accentColor} />

      <WaveDivider colors={[accentColor]} />

      <section id="speakers" className="px-6 py-24" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(4,4,14,0.95) 100%)', borderTop: '1px solid rgba(0,245,212,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', textShadow: `0 0 30px ${accentColor}20` }}>Speakers</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Industry leaders from BT, AWS, NHS, BBC R&D, Barclays Eagle Labs, and more</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {SPEAKERS.map((speaker) => {
              const trackColor = TRACK_COLORS[TRACKS.indexOf(speaker.track) % TRACK_COLORS.length] || accentColor;
              const expanded = expandedSpeaker === speaker.id;
              return (
                <div key={speaker.id} className="group" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,245,212,0.15)', borderRadius: 16, padding: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                  <div className="relative w-full aspect-[4/5] rounded-xl mb-5 overflow-hidden" style={{ border: '1px solid rgba(0,245,212,0.2)', boxShadow: `0 0 20px ${accentColor}10` }}>
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" unoptimized />
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-16" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${trackColor}30`, color: trackColor }}>{speaker.track}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1 text-lg" style={{ fontFamily: 'var(--font-display)' }}>{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-3" style={{ color: accentColor, lineHeight: 1.4 }}>{speaker.talk}</p>
                  <button onClick={() => setExpandedSpeaker(expanded ? null : speaker.id)} className="text-sm hover:underline" style={{ color: accentColor }}>{expanded ? '− Less' : '+ Bio'}</button>
                  {expanded && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{speaker.bio}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', textShadow: `0 0 30px ${accentColor}20` }}>Programme</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Two days of keynotes, panels, PitchFest, and XR Lab demos</p>
          </div>
          <div className="flex justify-center mb-12">
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
                    <div className="flex-1 min-w-0 py-5 flex gap-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,245,212,0.1)' }}>
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
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', textShadow: `0 0 30px ${accentColor}20` }}>Partners & Sponsors</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Supported by leading organisations across tech, academia, and innovation</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-6">
            {SPONSORS.map((s) => (
              <div key={s.name} className="px-5 py-4 rounded-xl text-center flex flex-col justify-center min-h-[80px]" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,245,212,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                <span className="font-medium text-sm block" style={{ color: 'var(--color-text)' }}>{s.name}</span>
                <span className="text-[10px] uppercase tracking-wider mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.tier}</span>
              </div>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section className="px-6 py-24" style={{ background: 'linear-gradient(180deg, rgba(4,4,14,0.95) 0%, rgba(0,0,0,0.3) 100%)', borderTop: '1px solid rgba(0,245,212,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', textShadow: `0 0 30px ${accentColor}20` }}>Venue</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>West Suffolk College STEM Centre — £2M XR Lab, immersive tech, and spatial computing</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {VENUE_GALLERY.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden relative aspect-[4/3]" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <Image src={img} alt={`${VENUE.name} ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" unoptimized />
              </div>
            ))}
          </div>
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
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section id="local-guide" className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', textShadow: `0 0 30px ${accentColor}20` }}>Beyond the Festival</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Hotels, dining, coffee, and things to do near West Suffolk College in Bury St Edmunds</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {(['hotels', 'dining', 'coffee', 'explore'] as const).map((tab) => (
              <button key={tab} onClick={() => setLocalTab(tab)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors" style={{ background: localTab === tab ? accentColor : 'rgba(255,255,255,0.05)', color: localTab === tab ? 'var(--color-bg)' : 'var(--color-text-muted)', border: localTab === tab ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>{tab}</button>
            ))}
          </div>
          {localTab === 'hotels' && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HOTELS.map((h) => (
                  <a key={h.name} href={h.mapsUrl} target="_blank" rel="noopener noreferrer" className="card overflow-hidden block hover:opacity-90 transition-opacity">
                    <div className="relative h-32 -m-6 mb-4">
                      <Image src={h.img} alt={h.name} fill className="object-cover" unoptimized />
                    </div>
                    <h3 className="font-semibold mb-1">{h.name}</h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{h.distance} · {'★'.repeat(h.stars)}</p>
                    <p className="text-sm font-medium" style={{ color: accentColor }}>{h.price}/night · Map →</p>
                  </a>
                ))}
              </div>
              <a href="https://www.booking.com/searchresults.html?ss=Bury+St+Edmunds&checkin=2026-05-27&checkout=2026-05-29" target="_blank" rel="noopener noreferrer" className="inline-block mt-6 text-sm font-medium" style={{ color: accentColor }}>View all hotels in Bury St Edmunds →</a>
            </>
          )}
          {localTab === 'dining' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DINING.map((r) => (
                <a key={r.name} href={r.mapsUrl} target="_blank" rel="noopener noreferrer" className="card block hover:opacity-90 transition-opacity">
                  <h3 className="font-semibold mb-1">{r.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{r.cuisine} · {r.distance}</p>
                  <p className="text-xs mt-1" style={{ color: accentColor }}>{r.rating} · Map →</p>
                </a>
              ))}
            </div>
          )}
          {localTab === 'coffee' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COFFEE.map((c) => (
                <a key={c.name} href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="card block hover:opacity-90 transition-opacity">
                  <h3 className="font-semibold mb-1">{c.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{c.note}</p>
                  <p className="text-xs mt-1" style={{ color: accentColor }}>{c.rating} · Map →</p>
                </a>
              ))}
            </div>
          )}
          {localTab === 'explore' && (
            <div className="grid sm:grid-cols-3 gap-6">
              {EXPLORE.map((e) => (
                <a key={e.name} href={e.mapsUrl} target="_blank" rel="noopener noreferrer" className="card block hover:opacity-90 transition-opacity">
                  <h3 className="font-semibold mb-2">{e.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{e.note}</p>
                  <p className="text-xs mt-2" style={{ color: accentColor }}>View on map →</p>
                </a>
              ))}
            </div>
          )}
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider colors={[accentColor]} />

      <section id="tickets" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', textShadow: `0 0 30px ${accentColor}20` }}>Tickets</h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Early bird pricing — full festival access from £89</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'day1' as const, label: 'Day 1', price: '£49', desc: 'May 27 · All tracks' },
              { tier: 'full' as const, label: 'Full Festival', price: '£89', desc: 'May 27–28 · 30% early bird', featured: true },
              { tier: 'day2' as const, label: 'Day 2', price: '£49', desc: 'May 28 · All tracks' },
            ].map(({ tier, label, price, desc, featured }) => (
              <div key={tier} className={`text-center flex flex-col rounded-2xl p-6 ${featured ? '' : ''}`} style={featured ? { background: 'rgba(0,245,212,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,245,212,0.3)', boxShadow: `0 0 30px ${accentColor}20` } : { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,245,212,0.15)' }}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>{price}</div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
                <Link href={`/checkout/ai-festival-uk-2026?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">Buy Ticket</Link>
              </div>
            ))}
          </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 py-24" style={{ background: `linear-gradient(135deg, rgba(0,245,212,0.08) 0%, rgba(0,245,212,0.02) 50%, transparent 100%)`, borderTop: `1px solid rgba(0,245,212,0.25)`, borderBottom: '1px solid rgba(0,245,212,0.08)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6" style={{ fontFamily: 'Orbitron, sans-serif', color: 'var(--color-text)', lineHeight: 1.2, textShadow: `0 0 40px ${accentColor}25` }}>Join 1,200+ innovators at AI Festival UK 2026</h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>Two days of AI, quantum, robotics, cyber, healthcare, and PitchFest. Early bird pricing ends soon.</p>
          <Link href="/checkout/ai-festival-uk-2026?tier=full&price=%C2%A389" className="inline-block px-10 py-4 text-base font-medium rounded-lg transition-all hover:opacity-95 hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg, #00F5D4 0%, #00D4AA 100%)', color: '#0A0A0A', boxShadow: `0 0 30px ${accentColor}50` }}>Get Tickets — £89</Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation</p>
        <Link href="/affiliate" className="text-sm" style={{ color: accentColor }}>Earn 40% as affiliate →</Link>
      </footer>
    </main>
  );
}
