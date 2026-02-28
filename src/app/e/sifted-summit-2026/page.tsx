'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { KenBurnsSlideshow } from '@/components/demo-event/DemoEventLayout';
import { LiveChat } from '@/components/LiveChat';

const AC = '#FF5733'; const A2 = '#1E3A5F'; const A3 = '#FFB347';
const TRACKS = [
  { name: 'AI & Deep Tech', color: '#8B5CF6' },
  { name: 'Fintech & Blockchain', color: '#06B6D4' },
  { name: 'Climate & Sustainability', color: '#22C55E' },
  { name: 'Defence & Security', color: '#EF4444' },
  { name: 'Growth & Scaling', color: '#F59E0B' },
  { name: 'VC & Fundraising', color: '#EC4899' },
  { name: 'Founder Stories', color: '#FF5733' },
  { name: 'Future of Europe', color: '#3B82F6' },
];
const HERO_IMGS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587825140708-dfaf18c4c3d6?w=1920&h=1080&fit=crop&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=1080&fit=crop&q=80',
];
const SPEAKERS = [
  { name: 'Niklas Zennström', role: 'Founding Partner, Atomico', track: 'VC & Fundraising', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop', talk: 'European Tech: The $100B Opportunity' },
  { name: 'Melanie Perkins', role: 'CEO & Co-Founder, Canva', track: 'Founder Stories', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop', talk: 'From Startup to $40B: Lessons in Scale' },
  { name: 'Thomas Wolf', role: 'Co-Founder, Hugging Face', track: 'AI & Deep Tech', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop', talk: 'Open-Source AI: Europe\'s Secret Weapon' },
  { name: 'Laura Modiano', role: 'Head of Startups EMEA, OpenAI', track: 'AI & Deep Tech', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop', talk: 'Building AI-Native Companies in Europe' },
  { name: 'Markus Villig', role: 'Founder & CEO, Bolt', track: 'Growth & Scaling', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop', talk: 'Scaling to 200M Users from Tallinn' },
  { name: 'Eynat Guez', role: 'CEO, Papaya Global', track: 'Fintech & Blockchain', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop', talk: 'The Future of Global Payments' },
  { name: 'Hélène Huby', role: 'CEO, The Exploration Company', track: 'Defence & Security', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop', talk: 'Europe\'s New Space Race' },
  { name: 'Hendrik Brandis', role: 'Managing Partner, Earlybird', track: 'VC & Fundraising', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop', talk: 'Where European VCs Are Betting in 2027' },
  { name: 'Anton Osika', role: 'Founder, Lovable', track: 'AI & Deep Tech', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop', talk: 'Vibe Coding: The End of Traditional Development' },
  { name: 'Lucy Liu', role: 'President, Airwallex', track: 'Fintech & Blockchain', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop', talk: 'Cross-Border Finance at Global Scale' },
  { name: 'Sharon Zhou', role: 'CEO, Lamini', track: 'AI & Deep Tech', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=400&fit=crop', talk: 'Enterprise AI Fine-Tuning: What Actually Works' },
  { name: 'Yannis Assael', role: 'Staff Research Scientist, Google DeepMind', track: 'AI & Deep Tech', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop', talk: 'From Research to Product: DeepMind\'s Playbook' },
];
const SCHEDULE_D1 = [
  { time: '08:00', title: 'Registration & Breakfast', speaker: '', track: '', type: 'break' },
  { time: '09:00', title: 'Opening Keynote: The State of European Tech 2026', speaker: 'Sifted Editorial Team', track: 'Main Stage', type: 'keynote' },
  { time: '09:30', title: 'European Tech: The $100B Opportunity', speaker: 'Niklas Zennström', track: 'VC & Fundraising', type: 'keynote' },
  { time: '10:15', title: 'Open-Source AI: Europe\'s Secret Weapon', speaker: 'Thomas Wolf', track: 'AI & Deep Tech', type: 'talk' },
  { time: '10:45', title: 'Coffee & Exhibition', speaker: '', track: '', type: 'break' },
  { time: '11:15', title: 'Building AI-Native Companies in Europe', speaker: 'Laura Modiano', track: 'AI & Deep Tech', type: 'talk' },
  { time: '12:00', title: 'The Future of Global Payments', speaker: 'Eynat Guez', track: 'Fintech & Blockchain', type: 'talk' },
  { time: '12:45', title: 'Lunch & Networking', speaker: '', track: '', type: 'break' },
  { time: '14:00', title: 'Scaling to 200M Users from Tallinn', speaker: 'Markus Villig', track: 'Growth & Scaling', type: 'talk' },
  { time: '14:45', title: 'Panel: Where European VCs Are Betting in 2027', speaker: 'Hendrik Brandis, Niklas Zennström + guests', track: 'VC & Fundraising', type: 'panel' },
  { time: '15:30', title: 'Afternoon Break & Startup Expo', speaker: '', track: '', type: 'break' },
  { time: '16:00', title: 'Vibe Coding: The End of Traditional Development', speaker: 'Anton Osika', track: 'AI & Deep Tech', type: 'talk' },
  { time: '16:45', title: 'Europe\'s New Space Race', speaker: 'Hélène Huby', track: 'Defence & Security', type: 'talk' },
  { time: '17:30', title: 'Day 1 Closing & Networking Drinks', speaker: '', track: '', type: 'break' },
  { time: '19:00', title: 'VIP Dinner (invite-only)', speaker: '', track: '', type: 'break' },
];
const SCHEDULE_D2 = [
  { time: '09:00', title: 'Day 2 Opening: Tech for a Changing World', speaker: 'Sifted Editorial', track: 'Main Stage', type: 'keynote' },
  { time: '09:30', title: 'From Startup to $40B: Lessons in Scale', speaker: 'Melanie Perkins', track: 'Founder Stories', type: 'keynote' },
  { time: '10:15', title: 'Cross-Border Finance at Global Scale', speaker: 'Lucy Liu', track: 'Fintech & Blockchain', type: 'talk' },
  { time: '10:45', title: 'Coffee & Exhibition', speaker: '', track: '', type: 'break' },
  { time: '11:15', title: 'Enterprise AI Fine-Tuning: What Actually Works', speaker: 'Sharon Zhou', track: 'AI & Deep Tech', type: 'talk' },
  { time: '12:00', title: 'From Research to Product: DeepMind\'s Playbook', speaker: 'Yannis Assael', track: 'AI & Deep Tech', type: 'talk' },
  { time: '12:45', title: 'Lunch & Side Events', speaker: '', track: '', type: 'break' },
  { time: '14:00', title: 'Panel: Climate Tech — Scaling Green Innovation in Europe', speaker: 'Curated founders + investors', track: 'Climate & Sustainability', type: 'panel' },
  { time: '14:45', title: 'Panel: Defence Tech — Europe\'s Strategic Imperative', speaker: 'Hélène Huby + defence founders', track: 'Defence & Security', type: 'panel' },
  { time: '15:30', title: 'Break & Demo Pit', speaker: '', track: '', type: 'break' },
  { time: '16:00', title: 'Scaleup Stage: 10 Startups Pitch to Top European VCs', speaker: '10 Founders', track: 'Growth & Scaling', type: 'pitchfest' },
  { time: '17:00', title: 'Closing: What\'s Over the Horizon?', speaker: 'Special guest panel', track: 'Future of Europe', type: 'keynote' },
  { time: '17:45', title: 'Farewell Drinks', speaker: '', track: '', type: 'break' },
];

function Countdown({ target }: { target: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc(); const i = setInterval(calc, 1000); return () => clearInterval(i);
  }, [target]);
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {[['d', t.d, 'DAYS'], ['h', t.h, 'HRS'], ['m', t.m, 'MIN'], ['s', t.s, 'SEC']].map(([k, v, l]) => (
        <div key={k as string} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '2rem', fontWeight: 700, color: AC, lineHeight: 1 }}>{String(v).padStart(2, '0')}</div>
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 3, marginTop: 2 }}>{l as string}</div>
        </div>
      ))}
    </div>
  );
}

export default function SiftedSummit2026() {
  const [day, setDay] = useState<1 | 2>(1);
  const schedule = day === 1 ? SCHEDULE_D1 : SCHEDULE_D2;
  const glass: React.CSSProperties = { background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16 };

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0F', color: '#E8E8E8', fontFamily: "'DM Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '92vh', minHeight: 620, overflow: 'hidden' }}>
        <KenBurnsSlideshow images={HERO_IMGS} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.55) 40%, rgba(10,10,15,0.92) 75%, #0A0A0F 100%)', zIndex: 1 }} />
        <div className="relative z-10 px-6 pb-16 pt-8 max-w-6xl mx-auto w-full h-full flex flex-col justify-end">
          <Link href="/" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 16 }}>← Back to Launchpad</Link>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1.5, marginBottom: 10 }}>
            Magazine London, North Greenwich · 30 Sep – 1 Oct 2026
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1, color: '#fff', margin: '0 0 0.75rem', maxWidth: 850 }}>
            Sifted <span style={{ color: AC }}>Summit</span> 2026
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', maxWidth: 620, margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            The ultimate gathering for Europe's boldest founders, operators, and investors. 200+ speakers. 3,000+ attendees. 2 days of unfiltered conversations.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <a href="#tickets" style={{ display: 'inline-flex', padding: '0.85rem 2.2rem', borderRadius: 12, background: AC, color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>Get Tickets →</a>
            <a href="#schedule" style={{ display: 'inline-flex', padding: '0.85rem 2.2rem', borderRadius: 12, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>View Programme</a>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {TRACKS.map(t => (
              <span key={t.name} style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.6rem', background: `${t.color}12`, color: t.color, border: `1px solid ${t.color}22` }}>{t.name}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2 }}>Starts in</span>
            <Countdown target="2026-09-30T09:00:00" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: `linear-gradient(135deg, ${AC}06, ${A2}08)`, borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, textAlign: 'center' }}>
          {[{ v: '3,000+', l: 'Attendees' }, { v: '200+', l: 'Speakers' }, { v: '8', l: 'Tracks' }, { v: '2', l: 'Days' }, { v: '5,678', l: 'Companies' }].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{s.v}</div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: AC, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>About</div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: '2.2rem', fontWeight: 700, color: '#fff', margin: '0 0 1rem' }}>From the page to the stage</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 16, fontSize: '0.95rem' }}>
              Sifted Summit brings European tech together under one roof. Join founders, startup and scaleup operators and investors to celebrate the resilience of the ecosystem and how its leading players are preparing for the long-haul.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontSize: '0.85rem' }}>
              Unfiltered conversations and actionable strategies from the biggest names in European tech. Genuine connections and dedicated networking sessions. Invite-only sessions for senior operators at Europe's most ambitious scaleups.
            </p>
          </div>
          <div style={{ borderRadius: 16, overflow: 'hidden', height: 340, backgroundImage: 'url(https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(255,255,255,0.05)' }} />
        </div>
      </section>

      {/* ── SPEAKERS ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '0.6rem', color: AC, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Speakers</div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: '2rem', fontWeight: 700, color: '#fff' }}>The biggest names in European tech</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
          {SPEAKERS.map(s => {
            const tc = TRACKS.find(t => t.name === s.track)?.color || AC;
            return (
              <div key={s.name} style={{ ...glass, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1', backgroundImage: `url(${s.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '0.7rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{s.name}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{s.role}</div>
                  <div style={{ fontSize: '0.65rem', color: tc, fontWeight: 500 }}>{s.talk}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section id="schedule" className="max-w-6xl mx-auto px-6 py-16">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '0.6rem', color: AC, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Programme</div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0 0 1.5rem' }}>Two days of unfiltered conversations</h2>
          <div style={{ display: 'inline-flex', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[1, 2].map(d => (
              <button key={d} onClick={() => setDay(d as 1 | 2)} style={{ padding: '0.55rem 2rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: day === d ? AC : 'rgba(255,255,255,0.03)', color: day === d ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                Day {d} · {d === 1 ? 'Tue 30 Sep' : 'Wed 1 Oct'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 5 }}>
          {schedule.map((s, i) => {
            const isBreak = s.type === 'break';
            const tc = TRACKS.find(t => s.track?.includes(t.name.split(' ')[0]) || s.track === t.name)?.color || AC;
            return (
              <div key={i} style={{ ...glass, padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', gap: 14, opacity: isBreak ? 0.45 : 1 }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: AC, minWidth: 44 }}>{s.time}</div>
                {!isBreak && <div style={{ width: 3, height: 26, borderRadius: 2, background: tc }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{s.title}</div>
                  {s.speaker && <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>{s.speaker} · <span style={{ color: tc }}>{s.track}</span></div>}
                </div>
                {s.type === 'keynote' && <span style={{ fontSize: '0.5rem', padding: '2px 7px', borderRadius: 4, background: `${AC}18`, color: AC, fontWeight: 600 }}>KEYNOTE</span>}
                {s.type === 'panel' && <span style={{ fontSize: '0.5rem', padding: '2px 7px', borderRadius: 4, background: `${A2}30`, color: '#60A5FA', fontWeight: 600 }}>PANEL</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── VENUE ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div style={{ ...glass, padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: AC, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Venue</div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 0.75rem' }}>Magazine London</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: 12 }}>
              A state-of-the-art events venue on the Greenwich Peninsula. Fully accessible with platform lifts, dedicated exhibition halls, networking spaces, and London's iconic skyline as the backdrop.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>📍 11 Ordnance Crescent, London SE10 0JH</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: 4 }}>🚇 North Greenwich (Jubilee Line) — 5 min walk</p>
          </div>
          <div style={{ borderRadius: 12, overflow: 'hidden', minHeight: 200 }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.3!2d0.0042!3d51.4996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487602ba1fe0bd53%3A0x2e!2sMagazine%20London!5e0!3m2!1sen!2suk!4v1" width="100%" height="100%" style={{ border: 0, minHeight: 200, filter: 'invert(0.9) hue-rotate(180deg) saturate(0.3)' }} loading="lazy" />
          </div>
        </div>
      </section>

      {/* ── TICKETS ── */}
      <section id="tickets" className="max-w-6xl mx-auto px-6 py-16">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: '0.6rem', color: AC, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Tickets</div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: '2rem', fontWeight: 700, color: '#fff' }}>Get your ticket</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {[
            { name: 'Founder / Operator', tier: 'founder-operator', desc: 'For Series A+ founders and operators. Full access to all stages, networking, app, and side events.', price: '£255', orig: '£399', badge: 'EARLY BIRD', color: '#22C55E' },
            { name: 'Investor', tier: 'investor', desc: 'For VCs, LPs, angels and all investor types. Full access plus curated founder meetups.', price: '£399', orig: '£599', badge: 'EARLY BIRD', color: '#8B5CF6' },
            { name: 'Corporate / Service', tier: 'corporate-service', desc: 'For service providers, law firms, banks, consultancies, PR, and tech companies.', price: '£599', orig: '£849', badge: 'EARLY BIRD', color: AC },
          ].map(tier => (
            <div key={tier.name} style={{ ...glass, padding: '1.5rem', position: 'relative', borderTop: `3px solid ${tier.color}` }}>
              <span style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.55rem', padding: '2px 8px', borderRadius: 4, background: `${tier.color}18`, color: tier.color, fontWeight: 700 }}>{tier.badge}</span>
              <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>{tier.name}</h3>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: 16, lineHeight: 1.5 }}>{tier.desc}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Space Grotesk'", fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{tier.price}</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)', textDecoration: 'line-through' }}>{tier.orig}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>+ VAT</span>
              </div>
              <Link href={`/checkout/sifted-summit-2026?tier=${tier.tier}&price=${encodeURIComponent(tier.price)}`} style={{ display: 'block', width: '100%', padding: '0.65rem', borderRadius: 10, background: tier.color, color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.8rem', marginTop: 8, textAlign: 'center', textDecoration: 'none' }}>Register Now →</Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>All tickets include: 2 stages of content · 200+ speakers · Event app · Side events · Networking sessions</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '2rem 0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>
          Powered by <Link href="/" style={{ color: AC, textDecoration: 'none' }}>Launchpad</Link> — AI-powered conference generation
        </p>
        <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.12)', marginTop: 4 }}>Demo page generated in 15 seconds by AI agents</p>
      </footer>
      <LiveChat />
    </main>
  );
}
