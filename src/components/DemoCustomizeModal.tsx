'use client';

import Link from 'next/link';

export function DemoCustomizeModal({
  open,
  onClose,
  accentColor = '#4FFFDF',
}: {
  open: boolean;
  onClose: () => void;
  accentColor?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="demo-customize-title">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className="relative max-w-md w-full rounded-2xl p-6 shadow-2xl"
        style={{
          background: 'rgba(15,15,15,0.98)',
          border: `1px solid ${accentColor}30`,
          boxShadow: `0 0 40px ${accentColor}15`,
        }}
      >
        <h2 id="demo-customize-title" className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          ✏️ Customize Event
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          This is a demo event. To customize name, tagline, branding, and more, create your own event.
        </p>
        <div className="flex gap-3">
          <Link
            href="/create"
            className="flex-1 py-3 rounded-lg font-semibold text-center transition-all"
            style={{ background: accentColor, color: '#0a0a0a' }}
          >
            Create Event →
          </Link>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-semibold"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--color-text)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
