'use client';

import { useState, useEffect } from 'react';

const LINES = [
  '[09:00:01] Initializing Swarm AI...',
  '[09:00:02] Dispatching 5 parallel agents',
  '[09:00:03] 🎤 Speaker Agent: Curating 8 diverse speakers',
  '[09:00:05] 🏛️ Venue Agent: Selecting venue in Amsterdam',
  '[09:00:06] 📋 Schedule Agent: Building 12-session program',
  '[09:00:07] 🎤 Speaker Agent: Complete (2.1s)',
  '[09:00:08] 💰 Pricing Agent: Setting tier pricing',
  '[09:00:09] 🏛️ Venue Agent: Complete (3.2s)',
  '[09:00:10] ✍️ Branding Agent: Generating name & tagline',
  '[09:00:11] 📋 Schedule Agent: Complete (4.0s)',
  '[09:00:12] 💰 Pricing Agent: Complete (3.5s)',
  '[09:00:13] ✍️ Branding Agent: Complete (2.8s)',
  '[09:00:14] Merging results...',
  '[09:00:15] ✓ Conference generated in 14.2s',
];

export function AnimatedTerminal({ autoPlay = true, speed = 600 }: { autoPlay?: boolean; speed?: number }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!playing || idx >= LINES.length) return;
    const id = setInterval(() => setIdx((i) => Math.min(i + 1, LINES.length)), speed);
    return () => clearInterval(id);
  }, [playing, idx, speed]);

  return (
    <div className="rounded-xl overflow-hidden font-mono text-sm" style={{ background: '#0d1117', border: '1px solid rgba(79,255,223,0.2)', boxShadow: '0 0 40px rgba(79,255,223,0.08)' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>Swarm AI — building conference</span>
      </div>
      <div className="p-4 h-64 overflow-y-auto">
        {LINES.slice(0, idx).map((line, i) => (
          <div key={i} className="mb-1" style={{ color: line.includes('✓') ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
            {line}
          </div>
        ))}
        {playing && idx < LINES.length && <span className="animate-pulse" style={{ color: 'var(--color-accent)' }}>▌</span>}
      </div>
      <div className="px-4 py-2 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => { setPlaying(!playing); if (!playing && idx >= LINES.length) setIdx(0); }}
          className="text-xs px-3 py-1 rounded"
          style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}
        >
          {playing ? 'Pause' : 'Replay'}
        </button>
      </div>
    </div>
  );
}
