'use client';

const TOPICS = ['AI & Machine Learning', 'Startup & Venture', 'Cybersecurity', 'Climate & Sustainability', 'HealthTech', 'FinTech', 'Web3 & Crypto', 'DevOps & Cloud', 'Design & UX', 'EdTech'];

export function SocialProofTicker() {
  return (
    <div className="py-6 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex gap-16 marquee" style={{ width: 'max-content' }}>
        {[...TOPICS, ...TOPICS].map((name, i) => (
          <span key={`${name}-${i}`} className="whitespace-nowrap text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-tech)' }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
