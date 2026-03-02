'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const DEMO_EVENTS = [
  { slug: 'ai-festival-uk-2026', name: 'AI Festival UK 2026', date: 'May 27-28', desc: 'Bury St Edmunds · £2M XR Lab', color: '#22C55E', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop', live: true },
  { slug: 'sifted-summit-2026', name: 'Sifted Summit', date: 'Sep 30 – Oct 1', desc: 'London · Founder £255', color: '#FF5733', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop', live: true },
  { slug: 'demo-conference', name: 'Demo Conference', date: 'Mar 25-26', desc: 'Amsterdam · Live graphs', color: '#4FFFDF', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop' },
  { slug: 'cybernova', name: 'CyberNova', date: 'Mar 24', desc: 'Berlin · Hacker vibes', color: '#EF4444', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop' },
];

const STEPS = [
  { emoji: '✍️', title: 'Describe', desc: 'Topic, city, date. Six fields.' },
  { emoji: '🤖', title: 'Generate', desc: 'AI builds it in 60 seconds.' },
  { emoji: '🚀', title: 'Share', desc: 'Live page, tickets ready.' },
];

export default function MobilePage() {
  const pathname = usePathname();
  const isHome = pathname === '/mobile';
  const isEvents = pathname?.startsWith('/e/');

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#050505' }}>
      {/* Top bar — minimal */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(5,5,5,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(79,255,223,0.15)',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #4FFFDF 0%, #22C55E 100%)', color: '#0A0A0A', boxShadow: '0 0 20px rgba(79,255,223,0.4)' }}
          >
            L
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '1.1rem' }}>Launchpad</span>
        </div>
        <Link
          href="/"
          className="text-xs px-3 py-1.5 rounded-full border"
          style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
        >
          Desktop →
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Hero — full bleed, punchy */}
        <section className="relative px-4 pt-8 pb-12 overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(79,255,223,0.25) 0%, transparent 60%)',
            }}
          />
          <div className="relative">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest mb-4"
              style={{ background: 'rgba(79,255,223,0.2)', color: '#4FFFDF', border: '1px solid rgba(79,255,223,0.4)' }}
            >
              AI-Powered · 60 sec
            </span>
            <h1
              className="text-3xl font-bold leading-tight mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 0 30px rgba(79,255,223,0.3)' }}
            >
              Conferences in seconds
            </h1>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Generate. Promote. Fill seats. AI builds your event.
            </p>
            <Link
              href="/create"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-semibold text-base"
              style={{
                background: 'linear-gradient(135deg, #4FFFDF 0%, #22C55E 100%)',
                color: '#0A0A0A',
                boxShadow: '0 0 30px rgba(79,255,223,0.4), 0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Create Event
              <span className="text-lg">→</span>
            </Link>
          </div>
        </section>

        {/* How it works — horizontal scroll cards */}
        <section className="px-4 py-6">
          <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#4FFFDF' }}>How it works</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="flex-shrink-0 w-[140px] snap-center rounded-2xl p-4"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(79,255,223,0.2)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <div className="text-2xl mb-2">{s.emoji}</div>
                <div className="text-[10px] font-mono mb-1" style={{ color: '#4FFFDF' }}>0{i + 1}</div>
                <div className="font-semibold text-sm">{s.title}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo events — swipeable cards */}
        <section className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest" style={{ color: '#4FFFDF' }}>Live events</h2>
            <Link href="/e/demo-conference" className="text-xs" style={{ color: '#4FFFDF' }}>See all →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {DEMO_EVENTS.map((e) => (
              <Link
                key={e.slug}
                href={`/e/${e.slug}`}
                className="flex-shrink-0 w-[72vw] max-w-[320px] snap-center rounded-2xl overflow-hidden block"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${e.live ? `${e.color}50` : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: `0 0 20px ${e.color}20`,
                }}
              >
                <div className="aspect-[4/3] relative">
                  <Image src={e.img} alt={e.name} fill className="object-cover" sizes="320px" />
                  {e.live && (
                    <div
                      className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase"
                      style={{ background: e.color, color: '#0A0A0A' }}
                    >
                      Live
                    </div>
                  )}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-24"
                    style={{ background: `linear-gradient(transparent, ${e.color}40)` }}
                  />
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{e.date}</div>
                  <h3 className="font-semibold text-base">{e.name}</h3>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{e.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA card */}
        <section className="px-4 py-6">
          <div
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(79,255,223,0.1) 0%, rgba(34,197,94,0.05) 100%)',
              border: '1px solid rgba(79,255,223,0.3)',
              boxShadow: '0 0 40px rgba(79,255,223,0.1)',
            }}
          >
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-2">Ready to launch?</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>Your conference in 60 seconds.</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold"
              style={{
                background: '#4FFFDF',
                color: '#0A0A0A',
                boxShadow: '0 0 20px rgba(79,255,223,0.4)',
              }}
            >
              Get Started Free
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Pricing teaser */}
        <section className="px-4 py-6">
          <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#4FFFDF' }}>Pricing</h2>
          <div className="space-y-3">
            {[
              { name: 'Free', price: '$0', desc: '1 event · AI generation' },
              { name: 'Pro', price: '$29/mo', desc: 'Unlimited · Custom branding', popular: true },
            ].map((t) => (
              <Link
                key={t.name}
                href="/pricing"
                className="flex items-center justify-between p-4 rounded-xl block"
                style={{
                  background: t.popular ? 'rgba(79,255,223,0.08)' : 'rgba(255,255,255,0.03)',
                  border: t.popular ? '1px solid rgba(79,255,223,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t.name}</span>
                    {t.popular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#4FFFDF', color: '#0A0A0A' }}>Popular</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.desc}</div>
                </div>
                <span className="font-bold" style={{ color: t.popular ? '#4FFFDF' : 'inherit' }}>{t.price}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-8" />
      </main>

      {/* Bottom nav — mobile native feel */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 z-50"
        style={{
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(79,255,223,0.15)',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        }}
      >
        <Link
          href="/mobile"
          className="flex flex-col items-center gap-1 py-2 px-6 rounded-xl min-w-[80px]"
          style={{
            background: isHome ? 'rgba(79,255,223,0.15)' : 'transparent',
            color: isHome ? '#4FFFDF' : 'rgba(255,255,255,0.5)',
          }}
        >
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          href="/e/demo-conference"
          className="flex flex-col items-center gap-1 py-2 px-6 rounded-xl min-w-[80px]"
          style={{
            background: isEvents ? 'rgba(79,255,223,0.15)' : 'transparent',
            color: isEvents ? '#4FFFDF' : 'rgba(255,255,255,0.5)',
          }}
        >
          <span className="text-lg">📅</span>
          <span className="text-[10px] font-medium">Events</span>
        </Link>
        <Link
          href="/create"
          className="flex flex-col items-center gap-1 py-3 px-8 rounded-2xl min-w-[90px]"
          style={{
            background: 'linear-gradient(135deg, #4FFFDF 0%, #22C55E 100%)',
            color: '#0A0A0A',
            boxShadow: '0 0 25px rgba(79,255,223,0.5)',
          }}
        >
          <span className="text-xl">✨</span>
          <span className="text-[10px] font-bold">Create</span>
        </Link>
      </nav>
    </div>
  );
}
