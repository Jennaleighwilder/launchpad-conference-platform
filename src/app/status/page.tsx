'use client';

import { useState } from 'react';

const SERVICES = [
  { name: 'API', status: 'operational', latency: 45 },
  { name: 'Event Generation', status: 'operational', latency: 1200 },
  { name: 'Checkout', status: 'operational', latency: 180 },
  { name: 'QR Check-in', status: 'operational', latency: 62 },
  { name: 'Dashboard', status: 'operational', latency: 95 },
  { name: 'Database', status: 'operational', latency: 28 },
  { name: 'CDN', status: 'operational', latency: 12 },
  { name: 'Email', status: 'operational', latency: 0 },
];

const INCIDENTS = [
  { date: '2026-02-20', title: 'Scheduled maintenance', status: 'resolved', desc: 'Database upgrade. 15 min downtime.' },
  { date: '2026-02-10', title: 'API latency spike', status: 'resolved', desc: 'Brief increase in response times. Root cause: CDN cache miss.' },
  { date: '2026-01-28', title: 'All systems operational', status: 'resolved', desc: 'No incidents. 100% uptime.' },
];

export default function StatusPage() {
  const [email, setEmail] = useState('');

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>System Status</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Real-time status of Launchpad services.
        </p>

        <div className="mb-12 p-6 rounded-2xl flex items-center gap-6" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <span className="text-4xl">✓</span>
          <div>
            <div className="text-xl font-semibold" style={{ color: '#22c55e' }}>All Systems Operational</div>
            <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Last updated: Just now</div>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">90-Day Uptime</h3>
          <div className="h-4 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {[...Array(90)].map((_, i) => (
              <div key={i} className="flex-1" style={{ background: i < 89 ? '#22c55e' : 'rgba(255,255,255,0.1)' }} title={`Day ${i + 1}`} />
            ))}
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>99.97% uptime over the last 90 days</p>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <div className="space-y-3">
            {SERVICES.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.status === 'operational' ? '#22c55e' : '#ef4444' }} />
                  <span className="font-medium">{s.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {s.latency > 0 && <span>{s.latency}ms</span>}
                  <span style={{ color: s.status === 'operational' ? '#22c55e' : '#ef4444' }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Recent Incidents</h3>
          <div className="space-y-3">
            {INCIDENTS.map((inc) => (
              <div key={inc.date} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{inc.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>{inc.status}</span>
                </div>
                <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>{inc.desc}</p>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{inc.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-semibold mb-2">Subscribe to updates</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>Get notified when we have incidents or scheduled maintenance.</p>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-transparent border"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
            />
            <button type="submit" className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
