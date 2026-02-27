'use client';

import { useRef, useEffect, useState } from 'react';

const BOTS = [
  { name: 'Social Blitz', desc: 'A/B tests posts at peak windows', channels: ['LinkedIn', 'X', 'IG', 'TikTok'], color: '#EC4899', icon: '📢' },
  { name: 'Community Infiltrator', desc: 'Finds relevant groups, shares with context', channels: ['Slack', 'Discord', 'Reddit', 'FB'], color: '#3B82F6', icon: '🔍' },
  { name: 'Email Outreach', desc: 'Personalized, timezone-aware campaigns', channels: ['Email', 'Calendar invites'], color: '#34D399', icon: '✉️' },
  { name: 'Partner Network', desc: 'Cross-promotes with complementary events', channels: ['Newsletters', 'Co-marketing'], color: '#A78BFA', icon: '🤝' },
  { name: 'SEO & Content', desc: 'Speaker spotlights, schema-rich pages', channels: ['Google', 'Blogs', 'Directories'], color: '#F472B6', icon: '📝' },
  { name: 'Retargeting', desc: 'Dynamic ads to visitors who didn\'t register', channels: ['Meta', 'Google', 'LinkedIn Ads'], color: '#FBBF24', icon: '🎯' },
];

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
}

export function PromotionEngine() {
  return (
    <section className="px-6 py-24 relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, rgba(5,5,15,0.98) 0%, rgba(10,10,20,0.99) 100%)',
      borderTop: '1px solid rgba(79,255,223,0.15)',
      borderBottom: '1px solid rgba(79,255,223,0.15)',
    }}>
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'var(--color-accent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[100px]" style={{ background: '#A78BFA' }} />
      </div>
      <div className="max-w-6xl mx-auto relative">
        <Reveal>
          <div className="text-center text-xs uppercase tracking-[0.25em] mb-4" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Promotion Engine</div>
          <h2 className="text-center text-4xl md:text-5xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            AI street team. Your event, everywhere.
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
            Events need to be <em>shown</em> to people — not just generated. Six AI bots work like campus promoters: flyers on telephone poles, community infiltration, cross-promo. Guerrilla marketing at scale.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BOTS.map((bot) => (
            <Reveal key={bot.name}>
              <div
                className="rounded-xl p-6 h-full transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${bot.color}30`,
                  boxShadow: `0 0 24px ${bot.color}10`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${bot.color}20` }}>
                    {bot.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1" style={{ color: bot.color, fontFamily: 'var(--font-tech)' }}>{bot.name}</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{bot.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {bot.channels.map((ch) => (
                        <span key={ch} className="text-xs px-2 py-0.5 rounded" style={{ background: `${bot.color}15`, color: bot.color }}>
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
