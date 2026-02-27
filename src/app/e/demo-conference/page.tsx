'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSpeakerPhoto } from '@/lib/speaker-photos';
import { PrisonerDilemmaKaleidoscope } from '@/components/event-viz';
import { KenBurnsSlideshow } from '@/components/demo-event/DemoEventLayout';
import { FALLBACK_HERO_POOL } from '@/lib/hero-images';

const TRACK_COLORS = ['#4FFFDF', '#A78BFA', '#34D399', '#F472B6', '#FBBF24', '#60A5FA'];
const SOLD_PCT = { early_bird: 78, regular: 45, vip: 12 };
const accentColor = '#4FFFDF';

const SLIDESHOW_IMAGES = FALLBACK_HERO_POOL.slice(60, 72);

const VENUE = {
  name: 'Beurs van Berlage',
  address: 'Damrak 243, 1012 ZJ Amsterdam',
  capacity_note: 'Historic venue in the heart of Amsterdam. A landmark building originally built as a commodities exchange, now a premier event space.',
  photo: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
  amenities: ['Wi-Fi', 'A/V', 'Green Room', 'Press Room', 'Expo Hall', 'Catering'],
};

const HOTELS = [
  { name: 'NH Collection Grand Hotel Krasnapolsky', distance: '0.3 km', price: '€189', stars: 5, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop' },
  { name: 'Hotel TwentySeven', distance: '0.5 km', price: '€450', stars: 5, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop' },
  { name: 'Hotel Estheréa', distance: '0.7 km', price: '€165', stars: 4, img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop' },
];

const RESTAURANTS = [
  { name: 'The Seafood Bar', cuisine: 'Seafood', distance: '0.2 km', price: '€€€' },
  { name: 'Café de Jaren', cuisine: 'Dutch', distance: '0.4 km', price: '€€' },
  { name: 'Restaurant Adam', cuisine: 'Fine Dining', distance: '0.6 km', price: '€€€€' },
  { name: 'Foodhallen', cuisine: 'Street Food', distance: '1.2 km', price: '€€' },
];

const TRACKS = ['AI & Machine Learning', 'Startup Growth', 'Enterprise Innovation'];

const SPEAKERS = [
  { id: 'nina-vorster', name: 'Nina Vorster', role: 'CTO, Nordic AI Labs', img: getSpeakerPhoto(12), talk: 'Edge AI in European Manufacturing', track: 'AI & Machine Learning', bio: 'Led AI at Siemens Munich. 12 years in industrial ML. Advisor to EU AI Act working groups.' },
  { id: 'lars-lindqvist', name: 'Lars Lindqvist', role: 'CEO, EventScale Nordic', img: getSpeakerPhoto(13), talk: 'Scaling European Tech Events', track: 'Startup Growth', bio: 'Founded 3 event platforms. Grew Nordic Startup Week to 8K attendees. Based in Stockholm.' },
  { id: 'eva-bergstrom', name: 'Eva Bergström', role: 'VP Engineering, Klarna', img: getSpeakerPhoto(14), talk: 'ML at Fintech Scale', track: 'Enterprise Innovation', bio: 'Built Klarna\'s recommendation engine. Ex-Spotify. PhD KTH Stockholm. 40+ patents.' },
  { id: 'johan-de-vries', name: 'Johan de Vries', role: 'Founder, Dutch Ventures', img: getSpeakerPhoto(15), talk: 'European VC Landscape 2026', track: 'Startup Growth', bio: '€200M AUM. Backed Adyen, Mollie. Angel in 60+ Dutch startups.' },
  { id: 'sofia-andersson', name: 'Sofia Andersson', role: 'Director of AI, Volvo Cars', img: getSpeakerPhoto(16), talk: 'AI in Autonomous Driving', track: 'AI & Machine Learning', bio: 'Led perception systems at Waymo. Now heading Volvo\'s AI research. IEEE Fellow.' },
  { id: 'pieter-van-der-berg', name: 'Pieter van der Berg', role: 'Head of Growth, Mollie', img: getSpeakerPhoto(17), talk: 'Payments & Growth at Scale', track: 'Startup Growth', bio: 'Scaled Mollie to €100B TPV. Ex-Adyen. Growth advisor to European fintechs.' },
  { id: 'ingrid-nielsen', name: 'Ingrid Nielsen', role: 'Chief Product Officer, Trustpilot', img: getSpeakerPhoto(18), talk: 'Product-Led Growth in B2B', track: 'Enterprise Innovation', bio: 'Led product at Zendesk and Intercom. Copenhagen-based. Board member at 4 scale-ups.' },
  { id: 'henrik-malm', name: 'Henrik Malm', role: 'VP Engineering, Spotify', img: getSpeakerPhoto(19), talk: 'Recommendation Systems at 600M Users', track: 'AI & Machine Learning', bio: 'Core team on Discover Weekly. 15 years at Spotify. RecSys conference keynote.' },
  { id: 'clara-van-amsterdam', name: 'Clara van Amsterdam', role: 'Director of AI, Booking.com', img: getSpeakerPhoto(20), talk: 'Personalization at Travel Scale', track: 'Enterprise Innovation', bio: 'Built Booking\'s ML stack. Amsterdam native. 50+ papers on recommender systems.' },
  { id: 'willem-janssen', name: 'Willem Janssen', role: 'Founder, DevTools.io', img: getSpeakerPhoto(21), talk: 'Developer Experience in 2026', track: 'Enterprise Innovation', bio: 'Built DevTools from 0 to 50K users. Ex-GitLab. Open-source advocate.' },
  { id: 'margreet-bakker', name: 'Margreet Bakker', role: 'Chief AI Officer, ING', img: getSpeakerPhoto(22), talk: 'AI in European Banking', track: 'AI & Machine Learning', bio: 'Led ING\'s AI transformation. ECB advisor. Focus on responsible AI in finance.' },
  { id: 'anton-schmidt', name: 'Anton Schmidt', role: 'Head of Platform, Zalando', img: getSpeakerPhoto(23), talk: 'Platform Engineering at Zalando', track: 'Enterprise Innovation', bio: 'Built Zalando\'s platform for 50M customers. Berlin-based. KubeCon speaker.' },
];

const SCHEDULE = [
  { time: '09:00', title: 'Opening Keynote: European AI in 2026', speaker: 'Nina Vorster', track: 'AI & Machine Learning', day: 'Day 1', keynote: true },
  { time: '09:45', title: 'Scaling European Tech Events', speaker: 'Lars Lindqvist', track: 'Startup Growth', day: 'Day 1' },
  { time: '10:30', title: 'Coffee & Networking', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '11:00', title: 'ML at Fintech Scale', speaker: 'Eva Bergström', track: 'Enterprise Innovation', day: 'Day 1' },
  { time: '11:45', title: 'European VC Landscape 2026', speaker: 'Johan de Vries', track: 'Startup Growth', day: 'Day 1' },
  { time: '12:30', title: 'Lunch & Exhibition', speaker: '-', track: 'All', day: 'Day 1' },
  { time: '14:00', title: 'AI in Autonomous Driving', speaker: 'Sofia Andersson', track: 'AI & Machine Learning', day: 'Day 1' },
  { time: '14:45', title: 'Payments & Growth at Scale', speaker: 'Pieter van der Berg', track: 'Startup Growth', day: 'Day 1' },
  { time: '15:30', title: 'Product-Led Growth in B2B', speaker: 'Ingrid Nielsen', track: 'Enterprise Innovation', day: 'Day 1' },
  { time: '09:00', title: 'Day 2 Keynote: AI in European Banking', speaker: 'Margreet Bakker', track: 'AI & Machine Learning', day: 'Day 2', keynote: true },
  { time: '09:45', title: 'Recommendation Systems at 600M Users', speaker: 'Henrik Malm', track: 'AI & Machine Learning', day: 'Day 2' },
  { time: '10:30', title: 'Personalization at Travel Scale', speaker: 'Clara van Amsterdam', track: 'Enterprise Innovation', day: 'Day 2' },
  { time: '11:00', title: 'Developer Experience in 2026', speaker: 'Willem Janssen', track: 'Enterprise Innovation', day: 'Day 2' },
  { time: '11:45', title: 'Platform Engineering at Zalando', speaker: 'Anton Schmidt', track: 'Enterprise Innovation', day: 'Day 2' },
  { time: '12:30', title: 'Lunch & Demos', speaker: '-', track: 'All', day: 'Day 2' },
  { time: '14:00', title: 'Panel: European AI Leadership', speaker: 'Nina Vorster, Margreet Bakker, Sofia Andersson', track: 'AI & Machine Learning', day: 'Day 2' },
  { time: '15:00', title: 'Closing Remarks', speaker: 'Lars Lindqvist', track: 'All', day: 'Day 2' },
  { time: '16:00', title: 'Networking Reception', speaker: '-', track: 'All', day: 'Day 2' },
];

const PRICING = { early_bird: '€299', regular: '€499', vip: '€999' };

const YOUTUBE_VIDEOS = [
  { id: 'f8DKD78BrQA', title: 'Nvidia GTC 2024 Keynote', event: 'Nvidia GTC' },
  { id: 'uFroTufv6es', title: 'Google I/O 2024 Keynote', event: 'Google I/O' },
  { id: 'pRAhO8piBtw', title: 'RailsConf 2024 Highlights', event: 'RailsConf' },
];

function WaveDivider() {
  const waves = [
    { color: '#4FFFDF', delay: 0 },
    { color: '#A78BFA', delay: 1 },
    { color: '#F472B6', delay: 2 },
  ];
  return (
    <div className="w-full h-16 relative overflow-hidden" style={{ background: 'transparent' }}>
      {waves.map((w, i) => (
        <svg key={i} className="absolute inset-0 w-[200%] h-full wave-flow" viewBox="0 0 800 120" preserveAspectRatio="none"
          style={{ animationDelay: `${w.delay}s` }}>
          <path fill="none" stroke={w.color} strokeWidth="1" opacity="0.15"
            d="M0,60 C100,20 200,100 300,60 C400,20 500,100 600,60 C700,20 800,100 800,60" />
        </svg>
      ))}
    </div>
  );
}

function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    if (nodesRef.current.length === 0) {
      const colors = ['#4FFFDF', '#A78BFA', '#F472B6'];
      for (let i = 0; i < 45; i++) {
        nodesRef.current.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          color: colors[i % 3],
        });
      }
    }

    let raf: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10,10,10,0.03)';
      ctx.fillRect(0, 0, W, H);

      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = m.x - n.x;
          const dy = m.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.globalAlpha = 0.15 * (1 - dist / 120);
            ctx.strokeStyle = n.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />;
}

function LiveRegistrationCounter() {
  const [count, setCount] = useState(1847);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => Math.min(c + Math.floor(Math.random() * 3) + 1, 2500)), 3000);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-lg" style={{ color: accentColor }}>{count.toLocaleString()}</span>;
}

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
    <div className="flex gap-3">
      {[diff.d, diff.h, diff.m, diff.s].map((v, i) => (
        <div key={i} className="w-14 h-14 rounded-xl flex flex-col items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <span className="text-xl font-bold font-mono" style={{ color: accentColor }}>{String(v).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase" style={{ color: 'var(--color-text-muted)' }}>{['Days', 'Hrs', 'Min', 'Sec'][i]}</span>
        </div>
      ))}
    </div>
  );
}

function ticketsRemaining(tier: keyof typeof SOLD_PCT) {
  const pct = SOLD_PCT[tier] ?? 0;
  const cap = 2500;
  const sold = Math.round((cap / 3) * (pct / 100));
  return Math.max(0, Math.round(cap / 3) - sold);
}

function RegistrationLineChart() {
  const [points, setPoints] = useState<number[]>([]);
  const countRef = useRef(1200);
  useEffect(() => {
    const base = [1200, 1250, 1320, 1380, 1420, 1480, 1520, 1580, 1620, 1680, 1720, 1780, 1820, 1847];
    setPoints(base);
    const id = setInterval(() => {
      countRef.current = Math.min(countRef.current + Math.floor(Math.random() * 4) + 1, 2500);
      setPoints((p) => (p.length >= 20 ? [...p.slice(1), countRef.current] : [...p, countRef.current]));
    }, 2500);
    return () => clearInterval(id);
  }, []);
  if (points.length < 2) return null;
  const w = 400; const h = 120; const max = Math.max(...points); const min = Math.min(...points);
  const pad = 20; const chartW = w - pad * 2; const chartH = h - pad * 2;
  const pts = points.map((v, i) => {
    const x = pad + (i / Math.max(points.length - 1, 1)) * chartW;
    const y = pad + chartH - ((v - min) / (max - min || 1)) * chartH;
    return `${x},${y}`;
  }).join(' ');
  const polyPts = `${pad},${h - pad} ${pts} ${w - pad},${h - pad}`;
  return (
    <div className="relative" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(79,255,223,0.2)', borderRadius: 8, padding: 16 }}>
      <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>Registration over time</div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <line key={i} x1={pad} y1={pad + (i * chartH) / 4} x2={w - pad} y2={pad + (i * chartH) / 4} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        ))}
        <polygon fill="url(#lineGrad)" points={polyPts} />
        <polyline fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} style={{ filter: 'drop-shadow(0 0 6px rgba(79,255,223,0.5))' }} />
      </svg>
      <div className="absolute bottom-4 right-4 text-lg font-mono" style={{ color: accentColor }}>{points[points.length - 1]?.toLocaleString()}</div>
    </div>
  );
}

function TicketBarChart() {
  const tiers = ['Early Bird', 'Regular', 'VIP'] as const;
  const pcts = [SOLD_PCT.early_bird, SOLD_PCT.regular, SOLD_PCT.vip];
  const colors = [accentColor, '#A78BFA', 'var(--color-warm)'];
  return (
    <div className="relative" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(79,255,223,0.2)', borderRadius: 8, padding: 16 }}>
      <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>Tickets sold by tier</div>
      <div className="flex gap-4 items-end h-24">
        {tiers.map((t, i) => (
          <div key={t} className="flex-1 flex flex-col items-center">
            <div className="w-full h-16 rounded-t overflow-hidden flex flex-col justify-end" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="w-full rounded-t transition-all duration-1000" style={{ height: `${pcts[i]}%`, minHeight: 4, background: colors[i], boxShadow: `0 0 12px ${colors[i]}40` }} />
            </div>
            <span className="text-[10px] mt-2" style={{ color: 'var(--color-text-muted)' }}>{t}</span>
            <span className="text-xs font-mono" style={{ color: colors[i] }}>{pcts[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveConnectionsPulse() {
  const [n, setN] = useState(47);
  useEffect(() => {
    const id = setInterval(() => setN((c) => Math.min(c + Math.floor(Math.random() * 3), 89)), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(79,255,223,0.2)', borderRadius: 8, padding: 16 }}>
      <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}` }} />
      <div>
        <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>Live connections</div>
        <div className="text-2xl font-mono font-bold" style={{ color: accentColor }}>{n}</div>
      </div>
    </div>
  );
}

export default function DemoConferencePage() {
  const [scheduleDay, setScheduleDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);

  const scheduleFiltered = SCHEDULE.filter((s) => s.day === scheduleDay);

  return (
    <main className="min-h-screen relative" style={{ background: 'transparent' }}>
      <div className="scanline" style={{ background: 'linear-gradient(to bottom, transparent, rgba(79,255,223,0.04), transparent)' }} aria-hidden />

      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: accentColor, color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/demo" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>All Demos</Link>
          <Link href="/speakers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Speakers</Link>
          <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-24 min-h-[70vh] flex flex-col justify-end overflow-hidden isolate">
        <div className="absolute inset-0 z-0">
          <KenBurnsSlideshow images={SLIDESHOW_IMAGES} />
        </div>
        <div className="absolute inset-0 z-[1]" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,0.75) 60%, rgba(4,4,14,0.95) 85%, #04040E 100%)',
        }} />
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}26 0%, transparent 70%)`,
        }} />
        {[...Array(45)].map((_, i) => (
          <div key={i} className="absolute rounded-full z-[1]" style={{
            width: 3 + (i % 3),
            height: 3 + (i % 3),
            left: `${(i * 5) % 100}%`,
            bottom: 0,
            background: [accentColor, '#A78BFA', '#F472B6', '#34D399'][i % 4],
            opacity: 0.3 + (i % 3) * 0.1,
            boxShadow: `0 0 10px ${[accentColor, '#A78BFA', '#F472B6', '#34D399'][i % 4]}`,
            animation: `floatUp ${10 + (i % 12)}s linear infinite`,
            animationDelay: `${(i * 0.4) % 6}s`,
            zIndex: 1,
          }} />
        ))}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <NetworkGraph />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
            <span style={{ color: accentColor, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tickets Available
            </span>
          </div>

          <h1 className="mb-4" style={{ fontFamily: 'var(--font-tech)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.3)' }}>
            SuperNova AI Summit 2026
          </h1>

          <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
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
              <span>👥</span><span><LiveRegistrationCounter /> registered</span>
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

      {/* EXHIBIT: Live Data — science museum style */}
      <section className="px-6 py-12" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.9) 100%)',
        borderTop: '1px solid rgba(79,255,223,0.15)',
        borderBottom: '1px solid rgba(79,255,223,0.15)',
        backgroundImage: 'linear-gradient(rgba(79,255,223,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,223,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 20px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</div>
              <div className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Live registration & ticket flow</div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RegistrationLineChart />
            </div>
            <div className="space-y-4">
              <TicketBarChart />
              <LiveConnectionsPulse />
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* EXHIBIT: Game Theory — Prisoner's Kaleidoscope (museum-style) */}
      <section className="px-6 py-16" style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(5,5,15,0.99) 100%)',
        borderTop: '1px solid rgba(79,255,223,0.2)',
        borderBottom: '1px solid rgba(79,255,223,0.2)',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(79,255,223,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(167,123,250,0.04) 0%, transparent 50%)',
      }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 rounded-full" style={{ background: accentColor, boxShadow: `0 0 24px ${accentColor}` }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Interactive Exhibit</div>
              <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Prisoner&apos;s Kaleidoscope</h2>
            </div>
          </div>
          <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Cooperation vs. defection on a lattice. Each cell adopts its neighbor&apos;s strategy based on payoff. Teal = cooperate, dark = defect. Watch emergent patterns evolve in real time — inspired by Complexity Explorables and spatial game theory.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(79,255,223,0.2)', boxShadow: '0 0 40px rgba(79,255,223,0.08)' }}>
            <PrisonerDilemmaKaleidoscope size={80} cellSize={5} speed={100} colors={{ cooperator: accentColor, defector: '#0f172a', flipToC: '#7dd3fc', flipToD: '#f472b6' }} />
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* EXHIBIT: Speakers */}
      <section className="px-6 py-16" style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        backgroundImage: 'linear-gradient(rgba(79,255,223,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,223,0.02) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}>
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
                    <Image src={speaker.img} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" sizes="25vw" unoptimized />
                  </div>
                  <h3 className="font-semibold mb-1">{speaker.name}</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{speaker.role}</p>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{speaker.talk}</p>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${trackColor}20`, color: trackColor }}>{speaker.track}</span>
                  <button onClick={() => setExpandedSpeaker(expanded ? null : speaker.id)} className="mt-3 text-xs" style={{ color: accentColor }}>
                    {expanded ? '− Less' : '+ Bio'}
                  </button>
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

      <WaveDivider />

      {/* Featured Videos */}
      <section className="px-6 py-16" style={{
        background: 'linear-gradient(180deg, rgba(79,255,223,0.03) 0%, transparent 100%)',
        borderTop: '1px solid rgba(79,255,223,0.1)',
        borderBottom: '1px solid rgba(79,255,223,0.1)',
      }}>
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
              <div key={v.id} className="card overflow-hidden group" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}?rel=0`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }} />
                </div>
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{v.event}</p>
              </div>
            ))}
          </div>
          {/* Audio: Keynote replays */}
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(79,255,223,0.15)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 rounded-full" style={{ background: '#EC4899', boxShadow: '0 0 20px #EC4899' }} />
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#EC4899', fontFamily: 'var(--font-mono)' }}>Listen</div>
                <h2 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Keynote audio replays</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-4" style={{ borderColor: 'rgba(236,72,153,0.2)', boxShadow: '0 0 20px rgba(236,72,153,0.1)' }}>
                <div className="text-sm font-medium mb-2" style={{ color: '#EC4899' }}>🎧 Opening Keynote — European AI in 2026</div>
                <audio controls className="w-full" style={{ borderRadius: 8, height: 40 }}>
                  <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                </audio>
              </div>
              <div className="card p-4" style={{ borderColor: 'rgba(236,72,153,0.2)', boxShadow: '0 0 20px rgba(236,72,153,0.1)' }}>
                <div className="text-sm font-medium mb-2" style={{ color: '#EC4899' }}>🎧 Day 2 Keynote — AI in European Banking</div>
                <audio controls className="w-full" style={{ borderRadius: 8, height: 40 }}>
                  <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" type="audio/mpeg" />
                </audio>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* EXHIBIT: Schedule */}
      <section className="px-6 py-16" style={{
        backgroundImage: 'linear-gradient(rgba(79,255,223,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(79,255,223,0.02) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 rounded-full" style={{ background: accentColor }} />
              <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>Exhibit</span>
              <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
            </div>
            <div className="flex gap-2">
              {(['Day 1', 'Day 2'] as const).map((d) => (
                <button key={d} onClick={() => setScheduleDay(d)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: scheduleDay === d ? accentColor : 'rgba(255,255,255,0.05)',
                    color: scheduleDay === d ? 'var(--color-bg)' : 'var(--color-text-muted)',
                    border: scheduleDay === d ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  {d}
                </button>
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
                        {item.track !== 'All' && (
                          <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded"
                            style={{ background: `${barColor}20`, color: barColor }}>
                            {item.track}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      {/* Venue — map + photo + amenities */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Venue</h2>
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image src={VENUE.photo} alt={VENUE.name} width={800} height={400} className="w-full h-48 object-cover" />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {VENUE.amenities.map((a) => (
              <span key={a} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {a}
              </span>
            ))}
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{VENUE.capacity_note}</p>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)', height: 280 }}>
            <iframe
              title="Venue map"
              src={`https://www.google.com/maps?q=${encodeURIComponent('Beurs van Berlage Amsterdam')}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Hotels & Restaurants */}
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

      <WaveDivider />

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Tickets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'early_bird' as const, label: 'Early Bird', price: PRICING.early_bird },
              { tier: 'regular' as const, label: 'Regular', price: PRICING.regular, featured: true },
              { tier: 'vip' as const, label: 'VIP', price: PRICING.vip },
            ].map(({ tier, label, price, featured }) => (
              <div key={tier} className={`card text-center flex flex-col ${featured ? 'border-[rgba(79,255,223,0.3)] border-glow' : ''}`} style={featured ? {} : {}}>
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: featured ? accentColor : 'var(--color-text-muted)' }}>{label}</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: tier === 'vip' ? 'var(--color-warm)' : accentColor }}>{price}</div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT[tier]}%`, background: tier === 'vip' ? 'var(--color-warm)' : accentColor }} />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining(tier)} remaining</p>
                <Link href={`/checkout/demo-conference?tier=${tier}&price=${encodeURIComponent(price)}`} className="btn-primary w-full py-3 text-sm text-center">
                  Buy Ticket
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-4">
          <Link href="/sponsor" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>
            Become a Sponsor →
          </Link>
          <Link href="/affiliate" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'rgba(79,255,223,0.08)', border: '1px solid rgba(79,255,223,0.25)', color: 'var(--color-accent)' }}>
            💰 Refer & Earn 40% →
          </Link>
        </div>
      </section>

      <WaveDivider />

      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation
        </p>
        <Link href="/affiliate" className="text-sm" style={{ color: 'var(--color-accent)' }}>Earn 40% as affiliate →</Link>
      </footer>
    </main>
  );
}
