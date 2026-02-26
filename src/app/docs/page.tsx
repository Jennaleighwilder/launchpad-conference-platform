'use client';

import { useState } from 'react';
import Link from 'next/link';

const ENDPOINTS = [
  { method: 'POST', path: '/api/events/generate', title: 'Generate Event', params: 'topic, city, date, capacity, budget, vibe, speakers_hint?', notes: 'Creates a full conference. Uses OpenAI when configured, fallback otherwise.' },
  { method: 'POST', path: '/api/events/generate?mode=swarm', title: 'Swarm Generate', params: 'Same as generate', notes: '5 parallel AI agents. Faster, more diverse output.' },
  { method: 'GET', path: '/api/events', title: 'List Events', params: '-', notes: 'Returns all events.' },
  { method: 'GET', path: '/api/events/[slug]', title: 'Get Event', params: 'slug (path)', notes: 'Returns single event by slug.' },
  { method: 'POST', path: '/api/checkout', title: 'Create Checkout', params: 'eventSlug, ticketType, buyerEmail?, buyerName?', notes: 'Returns Stripe Checkout URL when configured.' },
  { method: 'GET', path: '/api/attendees/qr', title: 'Get QR Code', params: 'slug, email', notes: 'Returns QR code image for check-in.' },
  { method: 'GET', path: '/api/attendees/checkin', title: 'Check In', params: 'slug, code', notes: 'Marks attendee as checked in.' },
];

export default function DocsPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>API Documentation</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)' }}>REST API for event generation, ticketing, and check-in.</p>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
          <pre className="p-6 rounded-xl overflow-x-auto text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-mono)' }}>
{`curl -X POST https://your-app.vercel.app/api/events/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "AI",
    "city": "San Francisco",
    "date": "2026-06-15",
    "capacity": 500,
    "budget": "growth",
    "vibe": "professional"
  }'`}
          </pre>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Endpoints</h2>
          <div className="space-y-2">
            {ENDPOINTS.map((ep, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ background: ep.method === 'GET' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)', color: ep.method === 'GET' ? '#22c55e' : '#3b82f6' }}>{ep.method}</span>
                    <span className="font-mono text-sm">{ep.path}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{ep.title}</span>
                  </div>
                  <span style={{ color: 'var(--color-accent)' }}>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div className="px-6 pb-6 pt-0 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p><strong>Params:</strong> <code className="text-sm" style={{ color: 'var(--color-accent)' }}>{ep.params}</code></p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{ep.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="px-6 py-3 text-left font-medium">Variable</th>
                  <th className="px-6 py-3 text-left font-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}><td className="px-6 py-3 font-mono">OPENAI_API_KEY</td><td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>AI generation (fallback if missing)</td></tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}><td className="px-6 py-3 font-mono">STRIPE_SECRET_KEY</td><td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>Payments</td></tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}><td className="px-6 py-3 font-mono">NEXT_PUBLIC_SUPABASE_URL</td><td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>Database (in-memory if missing)</td></tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}><td className="px-6 py-3 font-mono">NEXT_PUBLIC_APP_URL</td><td className="px-6 py-3" style={{ color: 'var(--color-text-muted)' }}>Base URL for links</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-12 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">← Back to Launchpad</Link>
        </p>
      </div>
    </main>
  );
}
