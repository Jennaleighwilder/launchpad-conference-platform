'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AffiliatePage() {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const affiliateLink = code.trim()
    ? `${baseUrl}/create?ref=${encodeURIComponent(code.trim().toLowerCase().replace(/[^a-z0-9_-]/g, ''))}`
    : '';

  const handleCopy = async () => {
    if (!affiliateLink) return;
    await navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex gap-4">
          <Link href="/create" className="text-sm hover:text-[var(--color-accent)] transition-colors">Create Event</Link>
          <Link href="/dashboard" className="text-sm hover:text-[var(--color-accent)] transition-colors">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-16">
        <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>Affiliate Program</h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Share your link. When someone creates an event through it, you earn commission.
        </p>

        <div className="card mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Your affiliate code
          </label>
          <input
            type="text"
            placeholder="e.g. twanshow"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-[var(--color-accent)] focus:outline-none transition-colors"
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>

        {affiliateLink && (
          <div className="card mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
              Your affiliate link
            </label>
            <div className="flex gap-2">
              <input
                readOnly
                value={affiliateLink}
                className="flex-1 px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-sm"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}
              />
              <button
                onClick={handleCopy}
                className="btn-primary px-4 py-3 whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Share this link. Anyone who creates an event through it is attributed to you.
            </p>
          </div>
        )}

        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <p className="mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 opacity-90">
            <li>Enter your code above and copy your link</li>
            <li>Share it (Twitter, newsletter, etc.)</li>
            <li>When someone clicks and creates an event, it counts as a conversion</li>
          </ol>
        </div>

        <Link href="/" className="inline-block mt-8 text-sm hover:text-[var(--color-accent)] transition-colors">
          ← Back to Launchpad
        </Link>
      </div>
    </main>
  );
}
