'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STANDARD_STEPS = [
  'Researching speakers...',
  'Building schedule...',
  'Matching venue...',
  'Setting pricing...',
  'Generating event page...',
];

const SWARM_AGENTS = [
  { id: 'branding', emoji: '✍️', label: 'Branding Agent', desc: 'Name, tagline, description' },
  { id: 'speakers', emoji: '🎤', label: 'Speaker Agent', desc: 'Curating diverse speakers' },
  { id: 'venue', emoji: '🏛️', label: 'Venue Agent', desc: 'City-matched venue selection' },
  { id: 'schedule', emoji: '📋', label: 'Schedule Agent', desc: 'Full-day program builder' },
  { id: 'pricing', emoji: '💰', label: 'Pricing Agent', desc: 'Market-appropriate tiers' },
];

const CAPACITY_OPTIONS = [50, 100, 250, 500, 1000, 2500, 5000];

const BUDGET_OPTIONS = [
  { value: 'starter', label: 'Starter', desc: '$99–$149 tickets' },
  { value: 'growth', label: 'Growth', desc: '$249–$399 tickets' },
  { value: 'premium', label: 'Premium', desc: '$499–$799 tickets' },
  { value: 'enterprise', label: 'Enterprise', desc: '$999–$1,499 tickets' },
];

const VIBE_OPTIONS = [
  { value: 'professional', label: 'Professional', desc: 'Corporate / polished' },
  { value: 'builder', label: 'Builder', desc: 'Hackathon / hands-on' },
  { value: 'academic', label: 'Academic', desc: 'Research-focused' },
  { value: 'festival', label: 'Festival', desc: 'Creative / experiential' },
];

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [useSwarm, setUseSwarm] = useState(false);
  const [agentStatus, setAgentStatus] = useState<Record<string, 'pending' | 'running' | 'done' | 'error'>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    topic: '',
    city: '',
    date: '',
    capacity: 500,
    budget: 'growth',
    vibe: 'professional',
    speakers_hint: '',
  });

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.topic.trim()) errs.topic = 'Topic is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.date) errs.date = 'Date is required';
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    setStep(0);

    if (useSwarm) {
      const initial: Record<string, 'pending' | 'running' | 'done' | 'error'> = {};
      SWARM_AGENTS.forEach(a => initial[a.id] = 'pending');
      setAgentStatus(initial);
      setTimeout(() => setAgentStatus(s => ({ ...s, branding: 'running', speakers: 'running', venue: 'running' })), 300);
      setTimeout(() => setAgentStatus(s => ({ ...s, schedule: 'running', pricing: 'running' })), 600);
      setTimeout(() => setAgentStatus(s => ({ ...s, venue: 'done' })), 2000);
      setTimeout(() => setAgentStatus(s => ({ ...s, branding: 'done', pricing: 'done' })), 3000);
      setTimeout(() => setAgentStatus(s => ({ ...s, speakers: 'done' })), 4500);
      setTimeout(() => setAgentStatus(s => ({ ...s, schedule: 'done' })), 5500);
    }

    const stepInterval = !useSwarm ? setInterval(() => {
      setStep((s) => (s < STANDARD_STEPS.length - 1 ? s + 1 : s));
    }, 800) : null;

    try {
      const url = useSwarm ? '/api/events/generate?mode=swarm' : '/api/events/generate';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, capacity: form.capacity }),
      });

      const data = await res.json();
      if (stepInterval) clearInterval(stepInterval);

      if (data.success && data.event?.slug) {
        if (useSwarm) {
          const allDone: Record<string, 'done'> = {};
          SWARM_AGENTS.forEach(a => allDone[a.id] = 'done');
          setAgentStatus(allDone);
          await new Promise(r => setTimeout(r, 500));
        }
        router.push(`/e/${data.event.slug}`);
      } else {
        setError(data.error || 'Something went wrong. Try again.');
        setLoading(false);
      }
    } catch (err) {
      if (stepInterval) clearInterval(stepInterval);
      setError('Network error. Check your connection and try again.');
      setLoading(false);
    }
  };

  // ── SWARM LOADING ────────────────────────────────────────────────
  if (loading && useSwarm) {
    return (
      <main className="min-h-screen flex items-center justify-center transition-opacity duration-300" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center max-w-md mx-auto px-6 animate-[fadeUp_0.4s_ease-out]">
          <div className="mb-8">
            <div className="text-4xl mb-4">🐝</div>
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Swarm Generation
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              5 AI agents working in parallel
            </p>
          </div>
          <div className="space-y-3 text-left">
            {SWARM_AGENTS.map((agent) => {
              const status = agentStatus[agent.id] || 'pending';
              return (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg transition-all duration-300"
                  style={{
                    background: status === 'done' ? 'rgba(79,255,223,0.08)' : status === 'running' ? 'rgba(79,255,223,0.04)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${status === 'done' ? 'rgba(79,255,223,0.3)' : status === 'running' ? 'rgba(79,255,223,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                  <div className="text-xl w-8 text-center">
                    {status === 'done' ? '✅' : status === 'running' ? (
                      <span style={{ animation: 'pulse 1s infinite' }}>{agent.emoji}</span>
                    ) : agent.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{agent.label}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{agent.desc}</div>
                  </div>
                  <div className="text-xs font-mono" style={{
                    color: status === 'done' ? 'var(--color-accent)' : status === 'running' ? 'var(--color-warm)' : 'var(--color-text-muted)',
                  }}>
                    {status === 'done' ? 'DONE' : status === 'running' ? 'RUNNING' : 'QUEUED'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                background: 'var(--color-accent)',
                width: `${(Object.values(agentStatus).filter(s => s === 'done').length / 5) * 100}%`,
              }} />
          </div>
        </div>
      </main>
    );
  }

  // ── STANDARD LOADING ─────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center transition-opacity duration-300" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center animate-[fadeUp_0.4s_ease-out]">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              <svg className="w-8 h-8" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Building your conference...
            </h2>
          </div>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {STANDARD_STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-3 transition-all duration-300">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: i <= step ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                    color: i <= step ? 'var(--color-bg)' : 'var(--color-text-muted)',
                    transition: 'all 0.3s',
                  }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{
                  color: i <= step ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s',
                }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-3xl mb-3" style={{ fontFamily: 'var(--font-display)' }}>Create your conference</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
            Fill in the basics. AI handles the rest.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', color: 'var(--color-warm)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Topic / Trend *</label>
            <input type="text" className="input-field" placeholder="e.g. AI Agents, Web3 Gaming, Climate Tech..."
              value={form.topic} onChange={(e) => update('topic', e.target.value)}
              style={{ borderColor: validationErrors.topic ? 'var(--color-warm)' : undefined }} />
            {validationErrors.topic && (
              <p className="mt-1 text-sm" style={{ color: 'var(--color-warm)' }}>{validationErrors.topic}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City *</label>
              <input type="text" className="input-field" placeholder="e.g. Amsterdam, Berlin, NYC..."
                value={form.city} onChange={(e) => update('city', e.target.value)}
                style={{ borderColor: validationErrors.city ? 'var(--color-warm)' : undefined }} />
              {validationErrors.city && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-warm)' }}>{validationErrors.city}</p>
              )}
            </div>
            <div>
              <label className="label">Date *</label>
              <input type="date" className="input-field" value={form.date}
                onChange={(e) => update('date', e.target.value)}
                style={{ borderColor: validationErrors.date ? 'var(--color-warm)' : undefined }} />
              {validationErrors.date && (
                <p className="mt-1 text-sm" style={{ color: 'var(--color-warm)' }}>{validationErrors.date}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Capacity</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CAPACITY_OPTIONS.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => update('capacity', cap)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: form.capacity === cap ? 'var(--color-accent)' : 'rgba(255,255,255,0.03)',
                    color: form.capacity === cap ? 'var(--color-bg)' : 'var(--color-text)',
                    border: `1px solid ${form.capacity === cap ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {cap.toLocaleString()}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>Selected: {form.capacity.toLocaleString()} attendees</p>
          </div>

          <div>
            <label className="label">Budget Range</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('budget', opt.value)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: form.budget === opt.value ? 'rgba(79,255,223,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.budget === opt.value ? 'rgba(79,255,223,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Event Vibe</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {VIBE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('vibe', opt.value)}
                  className="p-4 rounded-xl text-left transition-all"
                  style={{
                    background: form.vibe === opt.value ? 'rgba(79,255,223,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${form.vibe === opt.value ? 'rgba(79,255,223,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Preferred Speakers (optional)</label>
            <input type="text" className="input-field" placeholder="Names, companies, or types of speakers you'd like..."
              value={form.speakers_hint} onChange={(e) => update('speakers_hint', e.target.value)} />
          </div>

          {/* Swarm Toggle */}
          <div className="p-4 rounded-xl transition-all duration-300"
            style={{
              background: useSwarm ? 'rgba(79,255,223,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${useSwarm ? 'rgba(79,255,223,0.3)' : 'rgba(255,255,255,0.06)'}`,
            }}>
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">🐝</span>
                <div>
                  <div className="text-sm font-semibold">Swarm Mode</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    5 AI agents work in parallel for richer results (requires OpenAI key)
                  </div>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={useSwarm}
                  onChange={(e) => setUseSwarm(e.target.checked)} />
                <div className="relative w-11 h-6 rounded-full transition-colors"
                  style={{ background: useSwarm ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)' }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ left: useSwarm ? '22px' : '2px' }} />
                </div>
              </div>
            </label>
          </div>

          <button type="submit" className="btn-primary w-full" style={{ marginTop: '2rem', padding: '1.25rem' }}>
            {useSwarm ? '🐝 Generate with Swarm' : '🚀 Generate Conference'}
          </button>

          <p className="text-center" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            {useSwarm ? '5 agents work simultaneously — ~10-15s' : 'Takes about 10-30 seconds depending on AI generation'}
          </p>
        </form>
      </div>
    </main>
  );
}
