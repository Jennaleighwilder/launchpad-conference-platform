'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type EventSummary = {
  id: string;
  slug: string;
  name: string;
  topic: string;
  city: string;
  date: string;
  status: string;
  created_at?: string;
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
        } else {
          setError('Failed to load events');
        }
      } catch {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
            Dashboard
          </Link>
          <Link href="/affiliate" className="text-sm hover:text-[var(--color-accent)] transition-colors">
            Affiliate
          </Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            Create New Event
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            All your generated events
          </p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
              <svg className="w-6 h-6" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p style={{ color: 'var(--color-text-muted)' }}>Loading events...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg mb-6" style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)', color: 'var(--color-warm)' }}>
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="card text-center py-16">
            <p className="mb-4" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
              No events yet. Create your first conference!
            </p>
            <Link href="/create" className="btn-primary">
              Create New Event
            </Link>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="card group">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">{event.name}</h3>
                  <span className="text-xs px-2 py-1 rounded shrink-0"
                    style={{
                      background: event.status === 'live' ? 'rgba(79,255,223,0.15)' : 'rgba(255,255,255,0.06)',
                      color: event.status === 'live' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    }}>
                    {event.status}
                  </span>
                </div>
                <div className="space-y-1 mb-4" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  <div>📍 {event.city}</div>
                  <div>📅 {formatDate(event.date)}</div>
                  <div className="text-xs" style={{ opacity: 0.8 }}>{event.topic}</div>
                </div>
                <Link
                  href={`/e/${event.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
                  style={{ color: 'var(--color-accent)' }}
                >
                  View →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
