'use client';

import { useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { AccessibilityPrefs } from '@/contexts/AccessibilityContext';

export function AccessibilityToggle() {
  const { prefs, setPref, togglePref } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[9998] w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-lg transition-all hover:scale-110"
        style={{
          background: 'var(--color-accent)',
          color: 'var(--color-bg)',
          border: '2px solid rgba(255,255,255,0.3)',
        }}
        title="Accessibility options"
        aria-label="Open accessibility options"
      >
        ♿
      </button>

      {open && (
        <div
          className="fixed bottom-20 right-6 z-[9999] w-80 rounded-xl p-4 shadow-2xl"
          style={{
            background: 'rgba(15,15,20,0.98)',
            border: '1px solid rgba(79,255,223,0.3)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>Accessibility</span>
            <button onClick={() => setOpen(false)} className="text-sm" style={{ color: 'var(--color-text-muted)' }}>✕</button>
          </div>
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={prefs.dyslexia} onChange={() => togglePref('dyslexia')} className="rounded" />
              <span>Dyslexia Mode</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>OpenDyslexic, wider spacing</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={prefs.adhdFocus} onChange={() => togglePref('adhdFocus')} className="rounded" />
              <span>ADHD Focus</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>No animations, narrow text</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={prefs.highContrast} onChange={() => togglePref('highContrast')} className="rounded" />
              <span>High Contrast</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={prefs.reducedMotion} onChange={() => togglePref('reducedMotion')} className="rounded" />
              <span>Reduced Motion</span>
            </label>
            <div>
              <span className="block mb-1">Text size</span>
              <select
                value={prefs.textSize}
                onChange={(e) => setPref('textSize', e.target.value as AccessibilityPrefs['textSize'])}
                className="w-full rounded px-2 py-1"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
