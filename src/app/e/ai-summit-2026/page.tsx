'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NetworkGraph, GameOfLife } from '@/components/event-viz';
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

const TRACK_COLORS = ['#A78BFA', '#C4B5FD', '#DDD6FE', '#E9D5FF', '#EDE9FE'];
const SOLD_PCT = { early_bird: 85, regular: 62, vip: 28 };
const accentColor = '#A78BFA';
const SLIDESHOW_IMAGES = [
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7115?w=1920&h=1080&fit=crop',
];

const VENUE = {
  name: 'Moscone Center',
  address: '747 Howard St, San Francisco, CA 94103',
  capacity_note: 'Premier tech venue. Home to Apple WWDC, Google I/O. 12 AI leaders. 2 days of keynotes and workshops.',
  photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
  amenities: ['Wi-Fi', 'A/V', 'Green Room', 'Expo Hall', 'Catering', 'Recording'],
};

const HOTELS = [
  { name: 'The St. Regis San Francisco', distance: '0.3 km', price: '$450', stars: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Hotel Nikko San Francisco', distance: '0.5 km', price: '$289', stars: 4, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { name: 'The Proper Hotel', distance: '0.4 km', price: '$320', stars: 4, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
];

const RESTAURANTS = [
  { name: 'State Bird Provisions', cuisine: 'California', distance: '0.6 km', price: '$$$$' },
  { name: 'Swan Oyster Depot', cuisine: 'Seafood', distance: '0.8 km', price: '$$' },
  { name: 'Tartine Bakery', cuisine: 'Bakery', distance: '1.2 km', price: '$$' },
  { name: 'Zuni Café', cuisine: 'American', distance: '0.5 km', price: '$$$' },
];

const TRACKS = ['Foundation Models', 'AI Safety', 'Agentic AI', 'Enterprise AI'];

const SPEAKERS = [
  { id: 'sarah-chen', name: 'Sarah Chen', role: 'VP AI, Anthropic', img: getSpeakerPhoto(0), talk: 'Constitutional AI in Production', track: 'AI Safety', bio: 'Led safety at Anthropic. PhD MIT. 50+ papers on AI alignment.' },
  { id: 'marcus-berg', name: 'Marcus Berg', role: 'Director, OpenAI', img: getSpeakerPhoto(1), talk: 'GPT-6 and Beyond', track: 'Foundation Models', bio: 'Core team on GPT-5/6. Scaling laws researcher. Ex-DeepMind.' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'CTO, Cohere', img: getSpeakerPhoto(2), talk: 'Enterprise LLMs', track: 'Enterprise AI', bio: 'Built Cohere\'s enterprise stack. Ex-Google Brain. RAG pioneer.' },
  { id: 'james-wright', name: 'James Wright', role: 'Head of Agents, Google', img: getSpeakerPhoto(3), talk: 'Autonomous AI Agents', track: 'Agentic AI', bio: 'Led Gemini agents. 20+ years in AI. Stanford advisor.' },
  { id: 'ana-costa', name: 'Ana Costa', role: 'Chief Scientist, Mistral', img: getSpeakerPhoto(4), talk: 'Open Models at Scale', track: 'Foundation Models', bio: 'Core team Mistral. Open-source advocate. NeurIPS best paper.' },
  { id: 'david-kim', name: 'David Kim', role: 'VP Engineering, Scale AI', img: getSpeakerPhoto(5), talk: 'Data for Frontier Models', track: 'Foundation Models', bio: 'Scales data pipelines for GPT-class models. Ex-Meta.' },
  { id: 'elena-vasquez', name: 'Elena Vasquez', role: 'Director, OpenAI Safety', img: getSpeakerPhoto(6), talk: 'Superalignment Progress', track: 'AI Safety', bio: 'Superalignment team. Interpretability researcher. LessWrong founder.' },
  { id: 'thomas-muller', name: 'Thomas Muller', role: 'CEO, Adept', img: getSpeakerPhoto(7), talk: 'AI That Uses Your Tools', track: 'Agentic AI', bio: 'Founded Adept. Ex-Google. Action models pioneer.' },
  { id: 'aisha-patel', name: 'Aisha Patel', role: 'VP AI, Salesforce', img: getSpeakerPhoto(8), talk: 'Einstein GPT', track: 'Enterprise AI', bio: 'Built Salesforce AI. CRM + LLMs. $2B ARR from AI features.' },
  { id: 'ryan-obrien', name: 'Ryan O\'Brien', role: 'Founder, LangChain', img: getSpeakerPhoto(9), talk: 'The LLM App Stack', track: 'Agentic AI', bio: 'LangChain creator. 50M+ downloads. Defining the agent framework.' },
  { id: 'maya-johnson', name: 'Maya Johnson', role: 'Chief AI Officer, Microsoft', img: getSpeakerPhoto(10), talk: 'Copilot at Scale', track: 'Enterprise AI', bio: 'Led Copilot rollout. 400M users. Enterprise AI adoption.' },
  { id: 'chen-wei', name: 'Chen Wei', role: 'Head of AI, Meta', img: getSpeakerPhoto(11), talk: 'Llama and Open AI', track: 'Foundation Models', bio: 'Led Llama 3/4. Open-weight advocate. 1B+ downloads.' },
];

const SCHEDULE = [
  { time: '09:00', title: 'Opening: The State of AI 2026', speaker: 'Marcus Berg', track: 'Foundation Models', day: 'Day 1', keynote: true },
  { time: '09:45', title: 'Constitutional AI in Production', speaker: 'Sarah Chen', track: 'AI Safety', day: 'Day 1' },
  { time: '10:30', title: 'Coffee & Networking', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '11:00', title: 'Enterprise LLMs', speaker: 'Priya Sharma', track: 'Enterprise AI', day: 'Day 1' },
  { time: '11:45', title: 'Autonomous AI Agents', speaker: 'James Wright', track: 'Agentic AI', day: 'Day 1' },
  { time: '12:30', title: 'Lunch & Exhibition', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '14:00', title: 'Open Models at Scale', speaker: 'Ana Costa', track: 'Foundation Models', day: 'Day 1' },
  { time: '14:45', title: 'Data for Frontier Models', speaker: 'David Kim', track: 'Foundation Models', day: 'Day 1' },
  { time: '15:30', title: 'Superalignment Progress', speaker: 'Elena Vasquez', track: 'AI Safety', day: 'Day 1' },
  { time: '09:00', title: 'Day 2 Keynote: AI That Uses Your Tools', speaker: 'Thomas Muller', track: 'Agentic AI', day: 'Day 2', keynote: true },
  { time: '09:45', title: 'Einstein GPT', speaker: 'Aisha Patel', track: 'Enterprise AI', day: 'Day 2' },
  { time: '10:30', title: 'The LLM App Stack', speaker: 'Ryan O\'Brien', track: 'Agentic AI', day: 'Day 2' },
  { time: '11:15', title: 'Copilot at Scale', speaker: 'Maya Johnson', track: 'Enterprise AI', day: 'Day 2' },
  { time: '12:00', title: 'Llama and Open AI', speaker: 'Chen Wei', track: 'Foundation Models', day: 'Day 2' },
  { time: '12:45', title: 'Lunch & Demos', speaker: '-', track: 'All', day: 'Day 2' },
  { time: '14:00', title: 'Panel: The Future of AI', speaker: 'Sarah Chen, Ana Costa, Maya Johnson', track: 'AI Safety', day: 'Day 2' },
  { time: '15:00', title: 'Closing Remarks', speaker: 'Marcus Berg', track: 'All', day: 'Day 2' },
  { time: '16:00', title: 'Networking Reception', speaker: '-', track: 'All', day: 'Day 2' },
];

const PRICING = { early_bird: '$499', regular: '$799', vip: '$1,999' };

const YOUTUBE_VIDEOS = [
  { id: 'f8DKD78BrQA', title: 'Nvidia GTC 2024 Keynote', event: 'Nvidia GTC' },
  { id: 'uFroTufv6es', title: 'Google I/O 2024 Keynote', event: 'Google I/O' },
  { id: 'pRAhO8piBtw', title: 'RailsConf 2024 Highlights', event: 'RailsConf' },
];

export default function AISummit2026Page() {
  const [scheduleDay, setScheduleDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const scheduleFiltered = SCHEDULE.filter((s) => s.day === scheduleDay);

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      <ScanlineOverlay color="167,139,250" />
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <KenBurnsSlideshow images={SLIDESHOW_IMAGES} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}26 0%, transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none">
          <NetworkGraph nodeCount={50} colors={['#A78BFA', '#C4B5FD', '#DDD6FE']} />
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
          <h1 className="mb-4" style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}>AI Summit 2026</h1>
          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>12 AI leaders · 2 days · San Francisco</p>
          <div className="flex flex-wrap gap-6 mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2"><span>📍</span><span>San Francisco, CA</span></div>
            <div className="flex items-center gap-2"><span>📅</span><span>July 22-23, 2026</span></div>
            <div className="flex items-center gap-2"><span>👥</span><span><LiveRegistrationCounter count={2847} max={3500} accentColor={accentColor} /> registered</span></div>
          </div>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Event starts in</p>
            <CountdownTimer endDate="2026-07-22T09:00:00" accentColor={accentColor} />
          </div>
          <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            Where AI meets ambition. Two days with 12 leaders from OpenAI, Anthropic, Google, Meta, and more. Foundation models, AI safety, agentic AI, enterprise deployment.
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
            <div className="md:col-span-2"><RegistrationLineChart accentColor={accentColor} initialBase={2000} /></div>
            <div className="space-y-4"><TicketBarChart soldPct={SOLD_PCT} accentColor={accentColor} colors={[accentColor, '#C4B5FD', 'var(--color-warm)']} /></div>
          </div>
        </div>
      </section>

      <WaveDivider colors={[accentColor, '#C4B5FD']} />

      {/* Interactive Exhibit: Conway's Game of Life */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(180deg, rgba(15,15,25,0.98) 0%, rgba(5,5,15,0.99) 100%)', borderTop: `1px solid ${accentColor}30`, borderBottom: `1px solid ${accentColor}30` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 24px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Interactive Exhibit</div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Conway&apos;s Game of Life</h2>
            </div>
          </div>
          <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Cellular automata from 1970. Each cell lives or dies by its neighbors. Gliders, oscillators, and infinite complexity from four simple rules. A cornerstone of artificial life and emergent computation.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${accentColor}30`, boxShadow: `0 0 40px ${accentColor}15` }}>
            <GameOfLife width={100} height={75} cellSize={6} color={accentColor} speed={60} />
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
            {SPEAKERS.map((speaker, i) => {
              const trackColor = TRACK_COLORS[TRACKS.indexOf(speaker.track) % TRACK_COLORS.length] || accentColor;
              const expanded = expandedSpeaker === speaker.id;
              return (
                <div key={speaker.id} className="card group float-slow" style={{ animationDelay: `${(i % 6) * 0.5}s`, animationDuration: `${6 + (i % 3)}s` }}>
                  <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="25vw" />
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

      {/* Featured Videos */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(180deg, rgba(167,139,250,0.03) 0%, transparent 100%)', borderTop: `1px solid ${accentColor}26`, borderBottom: `1px solid ${accentColor}26` }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Watch</div>
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Featured conference talks</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {YOUTUBE_VIDEOS.map((v, i) => (
              <div key={v.id} className="card overflow-hidden group">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{v.event}</p>
              </div>
            ))}
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
            <iframe title="Venue map" src="https://www.google.com/maps?q=Moscone+Center+San+Francisco&z=15&output=embed" width="100%" height="100%" style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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
              <div key={tier} className={`card text-center flex flex-col ${featured ? 'border-[rgba(167,139,250,0.3)]' : ''}`} style={featured ? { boxShadow: `0 0 20px ${accentColor}14` } : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: tier === 'vip' ? 'var(--color-warm)' : accentColor }}>{price}</div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT[tier]}%`, background: tier === 'vip' ? 'var(--color-warm)' : accentColor }} />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining(SOLD_PCT[tier], 3500)} remaining</p>
                <Link href={`/checkout/ai-summit-2026?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">Buy Ticket</Link>
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
