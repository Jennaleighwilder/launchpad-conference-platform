'use client';

import { useRef, useEffect, useState } from 'react';

const STATS: { label: string; value: number; prefix?: string; suffix?: string; divisor?: number; source: string; sourceUrl: string }[] = [
  { label: 'Event tech market by 2032', value: 21, prefix: '$', suffix: 'T', divisor: 10, source: 'Allied Market Research', sourceUrl: 'https://www.alliedmarketresearch.com' },
  { label: 'Events using AI in 2024', value: 67, suffix: '%', source: 'Bizzabo', sourceUrl: 'https://www.bizzabo.com' },
  { label: 'Prefer more in-person events', value: 54, suffix: '%', source: 'Eventgroove', sourceUrl: 'https://eventgroove.com' },
];

function AnimatedCounter({ target, prefix = '', suffix = '', divisor = 1, duration = 2000 }: { target: number; prefix?: string; suffix?: string; divisor?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current || !ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted.current) {
        counted.current = true;
        const steps = 60;
        const inc = target / steps;
        let n = 0;
        const iv = setInterval(() => {
          n += inc;
          if (n >= target) {
            setValue(target);
            clearInterval(iv);
          } else setValue(Math.floor(n));
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  const display = divisor > 1 ? (value / divisor).toFixed(1) : value.toLocaleString();
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

export function IndustryStats() {
  return (
    <section className="px-6 py-20" style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(79,255,223,0.1)', borderBottom: '1px solid rgba(79,255,223,0.1)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-xs uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Real Data</div>
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>The event industry is exploding</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
          Not made up. Cited. Verified.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-3xl md:text-4xl font-bold font-mono mb-2" style={{ color: 'var(--color-accent)' }}>
                <AnimatedCounter target={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} divisor={s.divisor ?? 1} />
              </div>
              <div className="text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>{s.label}</div>
              <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: 'var(--color-accent)', opacity: 0.8 }}>
                Source: {s.source} ↗
              </a>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <div className="h-1 rounded-full overflow-hidden w-64" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#A78BFA]" style={{ width: '78%', animation: 'pulse 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
