'use client';

import Link from 'next/link';
import Image from 'next/image';

const SPEAKERS = [
  { id: 'sarah-chen', name: 'Sarah Chen', role: 'CTO, TechForge', flag: '🇺🇸', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop' },
  { id: 'marcus-berg', name: 'Marcus Berg', role: 'CEO, EventScale', flag: '🇩🇪', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop' },
  { id: 'priya-sharma', name: 'Priya Sharma', role: 'VP Engineering, CloudNova', flag: '🇮🇳', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop' },
  { id: 'james-wright', name: 'James Wright', role: 'Founder, LaunchLab', flag: '🇬🇧', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop' },
  { id: 'ana-costa', name: 'Ana Costa', role: 'Director of AI, FutureConf', flag: '🇧🇷', img: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop' },
  { id: 'david-kim', name: 'David Kim', role: 'Head of Growth, ScaleUp', flag: '🇺🇸', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop' },
  { id: 'elena-vasquez', name: 'Elena Vasquez', role: 'Chief Product Officer, DataPulse', flag: '🇪🇸', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop' },
  { id: 'thomas-muller', name: 'Thomas Muller', role: 'VP Engineering, Innovate Corp', flag: '🇩🇪', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop' },
  { id: 'aisha-patel', name: 'Aisha Patel', role: 'Director of AI, StackAI', flag: '🇮🇳', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop' },
  { id: 'ryan-obrien', name: 'Ryan O\'Brien', role: 'Founder, GrowthHub', flag: '🇮🇪', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop' },
];

export default function SpeakersPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <Link href="/e/demo-conference" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Demo Event</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>All Speakers</h1>
          <p className="text-xl mb-12" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Meet the innovators and thought leaders speaking at Demo Conference 2026.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SPEAKERS.map((s) => (
              <Link key={s.id} href={`/speakers/${s.id}`} className="group">
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/5] relative">
                  <Image src={s.img} alt={s.name} fill className="object-cover transition-transform group-hover:scale-105" />
                </div>
                <h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">{s.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{s.role}</p>
                <span className="text-sm">{s.flag}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
