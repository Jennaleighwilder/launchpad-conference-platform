'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { EventData, SpeakerData, ScheduleItem, PricingData, VenueData } from '@/lib/types';

const TRACK_COLORS = ['#4FFFDF', '#A78BFA', '#34D399', '#F472B6', '#FBBF24', '#60A5FA'];

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
const SOLD_PCT = { early_bird: 78, regular: 45, vip: 23 };

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [bgVideoReady, setBgVideoReady] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (data.event) {
          setEvent(data.event);
        } else {
          setError('Event not found');
        }
      } catch {
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  const handleBuyTicket = (tier: string, price: string) => {
    if (!event) return;
    if (DEMO_MODE) {
      router.push(`/checkout/${event.slug}?tier=${tier}&price=${encodeURIComponent(price)}`);
      return;
    }
    setCheckoutLoading(tier);
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketType: tier,
        eventSlug: event.slug,
        buyerEmail: '',
        buyerName: '',
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.url) window.location.href = data.url;
        else alert(data.error || 'Checkout not configured.');
      })
      .catch(() => alert('Failed to start checkout'))
      .finally(() => setCheckoutLoading(null));
  };

  const ticketsRemaining = (tier: keyof typeof SOLD_PCT) => {
    const pct = SOLD_PCT[tier] ?? 0;
    const cap = event?.capacity ?? 500;
    const sold = Math.round((cap / 3) * (pct / 100));
    return Math.max(0, Math.round(cap / 3) - sold);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            <svg className="w-6 h-6" style={{ animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading event...</p>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <h1 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>Event not found</h1>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>This event may have expired or doesn&apos;t exist.</p>
          <Link href="/" className="btn-primary">← Back to Launchpad</Link>
        </div>
      </main>
    );
  }

  const venue = event.venue as VenueData;
  const speakers = (event.speakers || []) as SpeakerData[];
  const schedule = (event.schedule || []) as ScheduleItem[];
  const pricing = event.pricing as PricingData;
  const tracks = (event.tracks || []) as string[];
  const accentColor = getTopicColor(event.topic_key);
  const ticketsAvailable = event.status === 'ticket_sales' || event.status === 'live';
  const formattedDate = formatDate(event.date);

  // Map speaker names to their talks from schedule
  const speakerTalks = schedule.reduce<Record<string, { title: string; track?: string }>>((acc, item) => {
    if (!acc[item.speaker]) acc[item.speaker] = { title: item.title, track: item.track };
    return acc;
  }, {});

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      {/* Conference background reel — add /public/conference-bg.mp4 for full effect */}
      {bgVideoReady && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-30"
            onError={() => setBgVideoReady(false)}
          >
            <source src="/conference-bg.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Hero */}
      <section className="relative px-6 pt-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-[var(--color-accent)]"
            style={{ color: 'var(--color-text-muted)' }}>
            ← Back to Launchpad
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }}></span>
            <span style={{ color: accentColor, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {event.status === 'ticket_sales' || event.status === 'live' ? 'Tickets Available' : event.status === 'draft' ? 'Draft' : event.status === 'planning' ? 'Planning' : event.status === 'announcing' ? 'Coming Soon' : event.status === 'completed' ? 'Completed' : event.status}
            </span>
          </div>

          <h1 className="mb-4" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            lineHeight: 1.1,
          }}>
            {event.name}
          </h1>

          {event.tagline && (
            <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              {event.tagline}
            </p>
          )}

          <div className="flex flex-wrap gap-6 mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            <div className="flex items-center gap-2">
              <span>📍</span><span>{event.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span><span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span><span>{event.capacity} attendees</span>
            </div>
          </div>

          {event.description && (
            <p className="max-w-3xl mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', lineHeight: 1.7 }}>
              {event.description}
            </p>
          )}

          {tracks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tracks.map((track, i) => (
                <span key={track} className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    background: `${TRACK_COLORS[i % TRACK_COLORS.length]}20`,
                    border: `1px solid ${TRACK_COLORS[i % TRACK_COLORS.length]}50`,
                    color: TRACK_COLORS[i % TRACK_COLORS.length],
                  }}>
                  {track}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Speakers */}
      {speakers.length > 0 && (
        <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Speakers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {speakers.map((speaker, i) => {
                const talk = speakerTalks[speaker.name];
                const trackColor = talk?.track ? TRACK_COLORS[tracks.indexOf(talk.track) % TRACK_COLORS.length] : accentColor;
                return (
                  <div key={i} className="card group">
                    <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center text-lg font-bold"
                      style={{ background: `${accentColor}20`, color: accentColor }}>
                      {speaker.initials}
                    </div>
                    <h3 className="font-semibold mb-1">{speaker.name}</h3>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{speaker.role}</p>
                    {talk && (
                      <>
                        <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{talk.title}</p>
                        {talk.track && (
                          <span className="text-xs px-2 py-0.5 rounded"
                            style={{ background: `${trackColor}20`, color: trackColor }}>
                            {talk.track}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Schedule */}
      {schedule.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="space-y-0">
                {schedule.map((item, i) => (
                  <div key={i} className="relative flex items-start gap-6 py-5 pl-12">
                    <div className="absolute left-0 w-20 text-right">
                      <span className="text-sm font-medium" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>
                        {item.time}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 card py-4">
                      <div className="font-medium mb-1">{item.title}</div>
                      <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.speaker}</div>
                      {item.track && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded"
                          style={{ background: `${accentColor}15`, color: accentColor }}>
                          {item.track}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Venue</h2>
          <div className="card">
            <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
            <p className="mb-2" style={{ color: 'var(--color-text-muted)' }}>{venue.address}</p>
            {venue.capacity_note && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>{venue.capacity_note}</p>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Tickets</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center flex flex-col">
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Early Bird</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>
                {pricing.early_bird}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Limited availability</div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.early_bird}%`, background: accentColor }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining('early_bird')} tickets remaining</p>
              <button
                onClick={() => handleBuyTicket('early_bird', pricing.early_bird)}
                disabled={!!checkoutLoading || !ticketsAvailable}
                className="btn-primary w-full py-3 text-sm disabled:opacity-50"
              >
                {checkoutLoading === 'early_bird' ? 'Loading...' : ticketsAvailable ? 'Buy Ticket' : 'Coming Soon'}
              </button>
            </div>
            <div className="card text-center flex flex-col" style={{ borderColor: 'rgba(79,255,223,0.3)', boxShadow: '0 0 20px rgba(79,255,223,0.05)' }}>
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: accentColor }}>Regular</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                {pricing.regular}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Standard admission</div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.regular}%`, background: accentColor }} />
              </div>
              <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining('regular')} tickets remaining</p>
              <button
                onClick={() => handleBuyTicket('regular', pricing.regular)}
                disabled={!!checkoutLoading || !ticketsAvailable}
                className="btn-primary w-full py-3 text-sm disabled:opacity-50"
              >
                {checkoutLoading === 'regular' ? 'Loading...' : ticketsAvailable ? 'Buy Ticket' : 'Coming Soon'}
              </button>
            </div>
            {pricing.vip && (
              <div className="card text-center flex flex-col">
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-warm)' }}>VIP</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm)' }}>
                  {pricing.vip}
                </div>
                <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>Premium access + perks</div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.vip}%`, background: 'var(--color-warm)' }} />
                </div>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>🎫 {ticketsRemaining('vip')} tickets remaining</p>
                <button
                  onClick={() => handleBuyTicket('vip', pricing.vip!)}
                  disabled={!!checkoutLoading || !ticketsAvailable}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-50"
                >
                  {checkoutLoading === 'vip' ? 'Loading...' : ticketsAvailable ? 'Buy Ticket' : 'Coming Soon'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Share this event</p>
          <button
            onClick={() => navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : `/e/${slug}`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
          >
            {typeof window !== 'undefined' ? window.location.href : `/e/${slug}`}
            <span style={{ color: 'var(--color-accent)' }}>📋</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation
        </p>
      </footer>
    </main>
  );
}

function getTopicColor(topicKey: string | null): string {
  const colors: Record<string, string> = {
    ai: '#4FFFDF', web3: '#A78BFA', climate: '#34D399',
    health: '#F472B6', fintech: '#FBBF24', general: '#4FFFDF',
  };
  return colors[topicKey || 'general'] || '#4FFFDF';
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
