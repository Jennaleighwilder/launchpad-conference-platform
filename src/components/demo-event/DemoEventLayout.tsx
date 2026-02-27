'use client';

import { useState, useEffect, useRef } from 'react';
import { FALLBACK_HERO_POOL, getHeroImages } from '@/lib/hero-images';

/** Resolve hero images from event — handles hero_image_url, hero_assets (array/object), theme, fallback */
export function resolveHeroImages(
  event: Record<string, unknown>,
  options: {
    customImages?: string[];
    themeImages?: string[];
    slug?: string;
    topic?: string;
  }
): string[] {
  if (options.customImages?.length) return options.customImages;
  if ((event.hero_style === 'abstract' || event.hero_style === 'minimal') && !event.hero_image_url) return [];
  if (event.hero_image_url) return [event.hero_image_url as string];
  const ha = event.hero_assets;
  if (Array.isArray(ha) && ha[0]) {
    const img = (ha[0] as Record<string, unknown>).image_url;
    if (img) return [img as string];
  }
  if (ha && typeof ha === 'object' && !Array.isArray(ha)) {
    const img = (ha as Record<string, unknown>).image_url;
    if (img) return [img as string];
  }
  if (options.slug && options.topic) return getHeroImages(options.slug, options.topic);
  if (options.themeImages?.length) return options.themeImages;
  return FALLBACK_HERO_POOL;
}

/** Resolve hero video from event — only returns video if explicitly set by user (customize modal).
 * Generated events NEVER get random videos from the pool. */
export function resolveHeroVideo(
  event: Record<string, unknown>,
  customVideoUrl?: string
): string | null {
  if (customVideoUrl) return customVideoUrl;
  if (event.hero_video_url) return event.hero_video_url as string;
  const ha = event.hero_assets;
  if (Array.isArray(ha) && ha[0]) return (ha[0] as Record<string, unknown>).video_url as string | null;
  if (ha && typeof ha === 'object') return (ha as Record<string, unknown>).video_url as string | null;
  return null;
}

export function ScanlineOverlay({ color = '79,255,223' }: { color?: string }) {
  return (
    <div
      className="scanline"
      style={{ background: `linear-gradient(to bottom, transparent, rgba(${color},0.04), transparent)` }}
      aria-hidden
    />
  );
}

export function KenBurnsSlideshow({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  // Filter falsy URLs — [undefined] or [''] would render broken <img> elements
  const filtered = (images ?? []).filter((u): u is string => !!u && typeof u === 'string');
  const pool = filtered.length > 0 ? filtered : FALLBACK_HERO_POOL;

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % pool.length), 6000);
    return () => clearInterval(id);
  }, [pool.length]);

  const fallbackBg = pool[0] ? `url(${pool[0]})` : undefined;
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ background: fallbackBg ? `${fallbackBg} no-repeat center/cover, #0a0a0a` : '#0a0a0a' }}
    >
      {pool.map((src, i) => {
        const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov'));
        return (
          <div
            key={`${src}-${i}`}
            className="absolute inset-0"
            style={{
              opacity: i === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              animation: i === idx && !isVideo ? 'kenBurns 20s ease-in-out infinite' : 'none',
              willChange: i === idx ? 'transform' : 'auto',
            }}
          >
            {isVideo ? (
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scale(1)' }}
              />
            ) : (
        <img
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: 'scale(1)' }}
                loading="eager"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function WaveDivider({ colors }: { colors: string[] }) {
  return (
    <div className="w-full h-16 relative overflow-hidden" style={{ background: 'transparent' }}>
      {colors.map((c, i) => (
        <svg key={i} className="absolute inset-0 w-[200%] h-full wave-flow" viewBox="0 0 800 120" preserveAspectRatio="none" style={{ animationDelay: `${i}s` }}>
          <path fill="none" stroke={c} strokeWidth="1" opacity="0.15" d="M0,60 C100,20 200,100 300,60 C400,20 500,100 600,60 C700,20 800,100 800,60" />
        </svg>
      ))}
    </div>
  );
}

export function LiveRegistrationCounter({ count: initialCount = 1847, max = 2500, accentColor }: { count?: number; max?: number; accentColor: string }) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => Math.min(c + Math.floor(Math.random() * 3) + 1, max)), 3000);
    return () => clearInterval(id);
  }, [max]);
  return <span className="font-mono text-lg" style={{ color: accentColor }}>{count.toLocaleString()}</span>;
}

export function CountdownTimer({ endDate, accentColor }: { endDate: string; accentColor: string }) {
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const end = new Date(endDate);
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
  }, [endDate]);
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

export function TicketBarChart({ soldPct, accentColor, colors }: { soldPct: Record<string, number>; accentColor: string; colors?: string[] }) {
  const tiers = ['Early Bird', 'Regular', 'VIP'] as const;
  const pcts = [soldPct.early_bird ?? 0, soldPct.regular ?? 0, soldPct.vip ?? 0];
  const barColors = colors ?? [accentColor, '#A78BFA', 'var(--color-warm)'];
  return (
    <div className="relative" style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${accentColor}33`, borderRadius: 8, padding: 16 }}>
      <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>Tickets sold by tier</div>
      <div className="flex gap-4 items-end h-24">
        {tiers.map((t, i) => (
          <div key={t} className="flex-1 flex flex-col items-center">
            <div className="w-full h-16 rounded-t overflow-hidden flex flex-col justify-end" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="w-full rounded-t transition-all duration-1000" style={{ height: `${pcts[i]}%`, minHeight: 4, background: barColors[i], boxShadow: `0 0 12px ${barColors[i]}40` }} />
            </div>
            <span className="text-[10px] mt-2" style={{ color: 'var(--color-text-muted)' }}>{t}</span>
            <span className="text-xs font-mono" style={{ color: barColors[i] }}>{pcts[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegistrationLineChart({ accentColor, initialBase = 1200 }: { accentColor: string; initialBase?: number }) {
  const [points, setPoints] = useState<number[]>(() =>
    Array.from({ length: 14 }, (_, i) => initialBase + i * 45)
  );
  const countRef = useRef(initialBase);
  useEffect(() => {
    const id = setInterval(() => {
      countRef.current = Math.min(countRef.current + Math.floor(Math.random() * 4) + 1, 2500);
      setPoints((p) => (p.length >= 20 ? [...p.slice(1), countRef.current] : [...p, countRef.current]));
    }, 2500);
    return () => clearInterval(id);
  }, [initialBase]);
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
    <div className="relative" style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${accentColor}33`, borderRadius: 8, padding: 16 }}>
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
        <polyline fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} style={{ filter: `drop-shadow(0 0 6px ${accentColor}80)` }} />
      </svg>
      <div className="absolute bottom-4 right-4 text-lg font-mono" style={{ color: accentColor }}>{points[points.length - 1]?.toLocaleString()}</div>
    </div>
  );
}

export function ticketsRemaining(soldPct: number, cap: number) {
  const sold = Math.round((cap / 3) * (soldPct / 100));
  return Math.max(0, Math.round(cap / 3) - sold);
}
