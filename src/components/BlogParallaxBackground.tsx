'use client';

import { useEffect, useRef } from 'react';

/** Parallax moving screen / grid effect behind blog content */
export function BlogParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const rect = el.getBoundingClientRect();
      const offset = rect.top + scrollY;
      const progress = (scrollY - offset + window.innerHeight) / (rect.height + window.innerHeight);
      el.style.setProperty('--scroll-progress', String(Math.max(0, Math.min(1, progress))));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Moving grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,255,223,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,255,223,0.15) 1px, transparent 1px),
            linear-gradient(rgba(236,72,153,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(236,72,153,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px',
          animation: 'gridDrift 20s linear infinite',
        }}
      />
      {/* Second layer — opposite direction */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(167,123,250,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(167,123,250,0.2) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          animation: 'gridDriftReverse 25s linear infinite',
        }}
      />
      {/* Neon scanline — moves down the screen */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          top: 0,
          background: 'linear-gradient(90deg, transparent, rgba(79,255,223,0.8), transparent)',
          boxShadow: '0 0 30px rgba(79,255,223,0.9)',
          animation: 'scanlineVertical 8s linear infinite',
        }}
      />
      {/* Floating orbs */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 4) * 2,
            height: 6 + (i % 4) * 2,
            left: `${(i * 13) % 100}%`,
            top: `${(i * 11) % 100}%`,
            background: ['#4FFFDF', '#EC4899', '#A78BFA', '#34D399'][i % 4],
            opacity: 0.2 + (i % 3) * 0.1,
            boxShadow: `0 0 30px ${['#4FFFDF', '#EC4899', '#A78BFA', '#34D399'][i % 4]}`,
            animation: `float-slow ${10 + (i % 6)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.3) % 5}s`,
          }}
        />
      ))}
    </div>
  );
}
