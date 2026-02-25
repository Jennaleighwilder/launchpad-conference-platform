'use client';

import { useState } from 'react';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="flex items-center justify-center gap-4 py-2 px-4 text-sm font-medium"
      style={{ background: '#F59E0B', color: '#0A0A0A' }}
    >
      <span>🚀 Demo Mode — All transactions are simulated. No real payments are processed.</span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
