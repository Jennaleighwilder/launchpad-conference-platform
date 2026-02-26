'use client';

const LOGOS = ['TechCrunch', 'Y Combinator', 'AWS', 'SXSW', 'Web Summit', 'Techstars', 'Product Hunt', 'Hacker News'];

export function SocialProofTicker() {
  return (
    <div className="py-6 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex gap-16 marquee" style={{ width: 'max-content' }}>
        {[...LOGOS, ...LOGOS].map((name, i) => (
          <span key={`${name}-${i}`} className="whitespace-nowrap text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-tech)' }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
