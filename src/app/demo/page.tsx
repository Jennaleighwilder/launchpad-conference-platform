'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STEPS = [
  { id: 'speakers', label: 'Speaker Agent', icon: '🎤', done: false },
  { id: 'venue', label: 'Venue Agent', icon: '🏛️', done: false },
  { id: 'schedule', label: 'Schedule Agent', icon: '📋', done: false },
  { id: 'pricing', label: 'Pricing Agent', icon: '💰', done: false },
  { id: 'branding', label: 'Branding Agent', icon: '✍️', done: false },
];

const LOG_LINES = [
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

export default function DemoPage() {
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (!running) return;
    const stepTimer = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length));
    }, 1200);
    return () => clearInterval(stepTimer);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    const logTimer = setInterval(() => {
      setLogIndex((i) => Math.min(i + 1, LOG_LINES.length));
    }, 800);
    return () => clearInterval(logTimer);
  }, [running]);

  const reset = () => {
    setRunning(false);
    setStepIndex(0);
    setLogIndex(0);
  };

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Live Demo</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Watch 5 AI agents build a complete conference in real-time.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>Swarm AI Terminal</span>
              </div>
              <div className="p-4 font-mono text-sm h-64 overflow-y-auto">
                {LOG_LINES.slice(0, logIndex).map((line, i) => (
                  <div key={i} className="mb-1" style={{ color: line.includes('✓') ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                    {line}
                  </div>
                ))}
                {running && logIndex < LOG_LINES.length && <span className="animate-pulse">▌</span>}
              </div>
            </div>

            <div className="flex gap-4">
              {!running ? (
                <button onClick={() => setRunning(true)} className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                  Run Demo
                </button>
              ) : (
                <button onClick={reset} className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  Reset
                </button>
              )}
              <Link href="/create" className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'rgba(79,255,223,0.15)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>
                Try It Yourself →
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Agent Progress</h3>
            <div className="space-y-3">
              {STEPS.map((step, i) => (
                <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: i < stepIndex ? 'rgba(79,255,223,0.08)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-2xl">{step.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{step.label}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {i < stepIndex ? 'Complete' : i === stepIndex && running ? 'Running...' : 'Pending'}
                    </div>
                  </div>
                  {i < stepIndex && <span style={{ color: 'var(--color-accent)' }}>✓</span>}
                </div>
              ))}
            </div>

            <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 className="font-semibold mb-2">Architecture</h4>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                5 specialized agents run in parallel. Each owns one domain. Results merge in under 30 seconds.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div style={{ color: 'var(--color-accent)' }}>speakerAgent</div>
                <div style={{ color: 'var(--color-text-muted)' }}>→ 8 speakers</div>
                <div style={{ color: 'var(--color-accent)' }}>venueAgent</div>
                <div style={{ color: 'var(--color-text-muted)' }}>→ venue + address</div>
                <div style={{ color: 'var(--color-accent)' }}>scheduleAgent</div>
                <div style={{ color: 'var(--color-text-muted)' }}>→ 12 sessions</div>
                <div style={{ color: 'var(--color-accent)' }}>pricingAgent</div>
                <div style={{ color: 'var(--color-text-muted)' }}>→ 3 tiers</div>
                <div style={{ color: 'var(--color-accent)' }}>brandingAgent</div>
                <div style={{ color: 'var(--color-text-muted)' }}>→ name, tagline</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
