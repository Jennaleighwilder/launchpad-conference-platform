'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getHeroImages, FALLBACK_HERO_POOL } from '@/lib/hero-images';

const TRACKS = [
  { name: 'Mainstage', desc: 'Keynotes and the most significant topics shaping the future.', color: '#4FFFDF' },
  { name: 'Innovation Stage', desc: 'Deep dives into emerging tech and startup trends.', color: '#A78BFA' },
  { name: 'Workshop Stage', desc: 'Hands-on sessions and practical workshops.', color: '#34D399' },
  { name: 'Networking Lounge', desc: 'Informal connections and 1:1 meetings.', color: '#F472B6' },
  { name: 'Hackathon', desc: 'Build, collaborate, and ship in 48 hours.', color: '#FBBF24' },
  { name: 'Frontier Stage', desc: 'Cutting-edge research and experimental sessions.', color: '#60A5FA' },
];

const STAGES = [
  { name: 'Mainstage', desc: 'Keynotes and the most significant topics.', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Innovation Stage', desc: 'Deep dives into emerging tech.', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Workshop Stage', desc: 'Hands-on sessions and workshops.', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Networking Lounge', desc: 'Informal connections and 1:1s.', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Hackathon Stage', desc: 'Build and ship in 48 hours.', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Frontier Stage', desc: 'Cutting-edge research sessions.', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
];

export default function AgendaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<{ name: string; topic?: string; date: string; hero_image_url?: string; schedule?: { time: string; title: string; track?: string }[] } | null>(null);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((r) => r.json())
      .then((d) => d.event && setEvent(d.event))
      .catch(() => {});
  }, [slug]);

  const heroImages = useMemo(() => getHeroImages(slug, event?.topic || ''), [slug, event?.topic]);
  const heroImage = event?.hero_image_url || heroImages[0] || FALLBACK_HERO_POOL[0];
  const trackImages = useMemo(() => {
    const pool = heroImages.length ? heroImages : FALLBACK_HERO_POOL;
    return TRACKS.map((_, i) => pool[i % pool.length]);
  }, [heroImages]);
  const stageImages = useMemo(() => {
    const pool = heroImages.length ? heroImages : FALLBACK_HERO_POOL;
    return STAGES.map((_, i) => pool[(i + 3) % pool.length]);
  }, [heroImages]);

  const schedule = event?.schedule || [];
  const _day1 = schedule.filter((s) => s.time?.startsWith('9') || s.time?.startsWith('10') || s.time?.startsWith('11'));
  const _day2 = schedule.filter((s) => s.time?.startsWith('1') || s.time?.startsWith('2') || s.time?.startsWith('3') || s.time?.startsWith('4') || s.time?.startsWith('5'));

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href={`/e/${slug}`} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <Link href={`/e/${slug}`} className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to event</Link>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Discover the Stages & Programming</h1>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
              {event?.name || 'Event'} brings together the best minds. Explore the full agenda below.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-64 min-h-[256px]">
            <Image src={heroImage} alt="" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Agenda grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-normal mb-8" style={{ fontFamily: 'var(--font-display)' }}>Agenda At a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Stage</th>
                  <th className="text-left py-4 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Day 1</th>
                  <th className="text-left py-4 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Day 2</th>
                </tr>
              </thead>
              <tbody>
                {TRACKS.slice(0, 5).map((t, i) => (
                  <tr key={t.name}>
                    <td className="py-4 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{t.name}</td>
                    <td className="py-4 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="px-3 py-1 rounded-full text-xs" style={{ background: t.color + '30', color: t.color }}>Session {i + 1}</span>
                    </td>
                    <td className="py-4 px-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="px-3 py-1 rounded-full text-xs" style={{ background: t.color + '30', color: t.color }}>Session {i + 2}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Content Tracks */}
      <section className="px-6 py-24" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-normal mb-16" style={{ fontFamily: 'var(--font-display)' }}>Content Tracks</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TRACKS.map((t, i) => (
              <div key={t.name} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative h-40">
                  <Image src={trackImages[i]} alt="" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{t.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-normal mb-16" style={{ fontFamily: 'var(--font-display)' }}>Stages</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STAGES.map((s, i) => (
              <div key={s.name} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative h-48">
                  <Image src={stageImages[i]} alt="" fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 opacity-80" style={{ background: s.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{s.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href={`/e/${slug}`} className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to event</Link>
      </footer>
    </main>
  );
}
