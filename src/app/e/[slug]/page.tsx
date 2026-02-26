'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { EventData, SpeakerData, ScheduleItem, PricingData, VenueData } from '@/lib/types';

const TRACK_COLORS = ['#4FFFDF', '#A78BFA', '#34D399', '#F472B6', '#FBBF24', '#60A5FA'];

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
const SOLD_PCT = { early_bird: 78, regular: 45, vip: 23 };

const EVENT_FAQ = [
  { q: 'How do I get my ticket?', a: 'After purchase you\'ll receive a confirmation email with your ticket and QR code. Present the QR code at check-in.' },
  { q: 'Is there a virtual attendance option?', a: 'Yes. Registered attendees receive a livestream link before the event. Sessions are also recorded and shared post-event.' },
  { q: 'What\'s your refund policy?', a: 'Full refunds up to 14 days before the event. After that, we offer 50% refund or transfer to a future event.' },
  { q: 'Where should I stay?', a: 'We\'ve partnered with local hotels — use the accommodation links above for discounted rates near the venue.' },
  { q: 'Is parking available?', a: 'Yes. The venue offers on-site parking. Electric vehicle charging stations are available. Carpooling is encouraged.' },
];

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [customAccent, setCustomAccent] = useState<string | null>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'speakers', 'schedule', 'venue', 'travel', 'engagement', 'pricing', 'sponsor', 'share', 'faq',
  ]);
  const [sectionVisible, setSectionVisible] = useState<Record<string, boolean>>({
    speakers: true, schedule: true, venue: true, travel: true, engagement: true, pricing: true, sponsor: true, share: true, faq: true,
  });
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/e/${slug}`;

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
  const accentColor = customAccent || getTopicColor(event.topic_key);
  const displayName = customName || event.name;
  const displayTagline = customTagline !== undefined ? customTagline : event.tagline;
  const ticketsAvailable = event.status === 'ticket_sales' || event.status === 'live';
  const formattedDate = formatDate(event.date);

  // Map speaker names to their talks from schedule
  const speakerTalks = schedule.reduce<Record<string, { title: string; track?: string }>>((acc, item) => {
    if (!acc[item.speaker]) acc[item.speaker] = { title: item.title, track: item.track };
    return acc;
  }, {});

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      {/* Cinematic hero background — same premium treatment as landing & demo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          animation: 'kenBurns 20s ease-in-out infinite',
          willChange: 'transform',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.95) 100%)',
        }} />
        <div className="absolute inset-0 opacity-30" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}26 0%, transparent 70%)`,
        }} />
        {[...Array(25)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${(i * 7) % 100}%`,
            bottom: 0,
            opacity: 0.1 + (i % 4) * 0.1,
            animation: `floatUp ${15 + (i % 15)}s linear infinite`,
            animationDelay: `${i * 0.8}s`,
            zIndex: 1,
          }} />
        ))}
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-accent)]"
              style={{ color: 'var(--color-text-muted)' }}>
              ← Back to Launchpad
            </Link>
            <button onClick={() => setCustomizeOpen(true)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-text)' }}>
              ✏️ Customize Event
            </button>
          </div>

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
            {displayName}
          </h1>

          {displayTagline && (
            <p className="mb-6" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              {displayTagline}
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
      {sectionVisible.speakers && speakers.length > 0 && (
        <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Speakers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {speakers.map((speaker, i) => {
                const talk = speakerTalks[speaker.name];
                const trackColor = talk?.track ? TRACK_COLORS[tracks.indexOf(talk.track) % TRACK_COLORS.length] : accentColor;
                return (
                  <div key={i} className="card group">
                    <div className="w-14 h-14 rounded-full mb-4 flex items-center justify-center text-lg font-bold overflow-hidden shrink-0"
                      style={speaker.photo_url ? {} : { background: `${accentColor}20`, color: accentColor }}>
                      {speaker.photo_url ? (
                        <Image src={speaker.photo_url} alt={speaker.name} width={56} height={56} className="w-full h-full object-cover" />
                      ) : (
                        speaker.initials
                      )}
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
      {sectionVisible.schedule && schedule.length > 0 && (
        <section className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
              <Link href={`/e/${slug}/agenda`} className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-accent)' }}>View full agenda →</Link>
            </div>
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

      {/* Venue + Map */}
      {sectionVisible.venue && (
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Venue</h2>
          <div className="card mb-6">
            <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
            <p className="mb-2" style={{ color: 'var(--color-text-muted)' }}>{venue.address}</p>
            {venue.capacity_note && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)', opacity: 0.8 }}>{venue.capacity_note}</p>
            )}
          </div>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)', height: 280 }}>
            <iframe
              title="Venue map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      )}

      {/* Travel & Accommodation */}
      {sectionVisible.travel && (
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Travel & Accommodation</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(event.city)}&checkin=${event.date}&checkout=${event.date}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[var(--color-accent)] transition-colors group"
            >
              <span className="text-2xl">🏨</span>
              <div className="text-left">
                <div className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">Hotels</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Book stays in {event.city}</div>
              </div>
            </a>
            <a
              href={`https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(event.city)}%20on%20${event.date}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[var(--color-accent)] transition-colors group"
            >
              <span className="text-2xl">✈️</span>
              <div className="text-left">
                <div className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">Flights</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Find flights to {event.city}</div>
              </div>
            </a>
            <a
              href={`https://www.google.com/maps/search/restaurants+near+${encodeURIComponent(venue.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[var(--color-accent)] transition-colors group"
            >
              <span className="text-2xl">🍽️</span>
              <div className="text-left">
                <div className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">Dining</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Restaurants near venue</div>
              </div>
            </a>
          </div>
        </div>
      </section>
      )}

      {/* Networking & Live Engagement */}
      {sectionVisible.engagement && (
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Networking & Live Engagement</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">Live Q&A</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Submit and upvote questions for speakers in real time</p>
            </div>
            <div className="card">
              <div className="text-xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Live Polls</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Real-time voting and audience insights during sessions</p>
            </div>
            <div className="card">
              <div className="text-xl mb-2">🤝</div>
              <h3 className="font-semibold mb-1">AI Matchmaking</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Get matched with attendees who share your interests</p>
            </div>
            <div className="card">
              <div className="text-xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">Event App</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Personal agenda, session alerts, venue maps, and chat</p>
            </div>
            <div className="card">
              <div className="text-xl mb-2">🎥</div>
              <h3 className="font-semibold mb-1">Live Stream</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Virtual attendance via YouTube, Zoom, or Vimeo</p>
            </div>
            <div className="card">
              <div className="text-xl mb-2">🏆</div>
              <h3 className="font-semibold mb-1">Gamification</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Earn points, climb the leaderboard, VIP 2x multiplier</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Pricing */}
      {sectionVisible.pricing && (
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
      )}

      {/* Sponsor CTA */}
      {sectionVisible.sponsor && (
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center mb-8">
          <Link href="/sponsor" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>
            Become a Sponsor →
          </Link>
        </div>
      </section>
      )}

      {/* Share & Calendar */}
      {sectionVisible.share && (
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="mb-4 text-center" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Share & Add to Calendar</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                const url = typeof window !== 'undefined' ? window.location.origin : '';
                const ics = [
                  'BEGIN:VCALENDAR',
                  'VERSION:2.0',
                  'BEGIN:VEVENT',
                  `DTSTART:${event.date.replace(/-/g, '')}T090000`,
                  `DTEND:${event.date.replace(/-/g, '')}T180000`,
                  `SUMMARY:${event.name.replace(/,/g, '\\,')}`,
                  `LOCATION:${venue.address.replace(/,/g, '\\,')}`,
                  `DESCRIPTION:${(event.description || '').replace(/,/g, '\\,').slice(0, 200)}`,
                  'END:VEVENT',
                  'END:VCALENDAR',
                ].join('\r\n');
                const blob = new Blob([ics], { type: 'text/calendar' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${event.slug}.ics`;
                a.click();
                URL.revokeObjectURL(a.href);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              📅 Add to Calendar
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${event.name} — ${formattedDate} in ${event.city}`)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              𝕏 Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              Share on LinkedIn
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </section>
      )}

      {/* Event FAQ */}
      {sectionVisible.faq && (
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>FAQ</h2>
          <div className="space-y-2">
            {EVENT_FAQ.map((item, i) => (
              <div key={i} className="card">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full text-left flex items-center justify-between gap-4 py-1"
                >
                  <span className="font-medium">{item.q}</span>
                  <span style={{ color: accentColor, transform: faqOpen === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {faqOpen === i && (
                  <p className="mt-2 pt-2 text-sm" style={{ color: 'var(--color-text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation
        </p>
      </footer>

      {customizeOpen && (
        <CustomizeModal
          event={event}
          initialName={customName || event.name}
          initialTagline={customTagline !== undefined ? customTagline : (event.tagline || '')}
          initialAccent={customAccent}
          sectionOrder={sectionOrder}
          sectionVisible={sectionVisible}
          onClose={() => setCustomizeOpen(false)}
          onSave={(name, tagline, accent, order, visible) => {
            setCustomName(name);
            setCustomTagline(tagline);
            setCustomAccent(accent);
            setSectionOrder(order);
            setSectionVisible(visible);
            setCustomizeOpen(false);
          }}
        />
      )}
    </main>
  );
}

const ACCENT_COLORS = ['#4FFFDF', '#A78BFA', '#34D399', '#F472B6', '#FBBF24', '#60A5FA', '#EF4444', '#22C55E'];

const SECTION_LABELS: Record<string, string> = {
  speakers: 'Speakers', schedule: 'Schedule', venue: 'Venue + Map', travel: 'Travel & Accommodation',
  engagement: 'Networking & Live Engagement', pricing: 'Tickets', sponsor: 'Sponsor CTA', share: 'Share & Calendar', faq: 'Event FAQ',
};

function CustomizeModal({
  event,
  initialName,
  initialTagline,
  initialAccent,
  sectionOrder,
  sectionVisible,
  onClose,
  onSave,
}: {
  event: EventData;
  initialName: string;
  initialTagline: string;
  initialAccent: string | null;
  sectionOrder: string[];
  sectionVisible: Record<string, boolean>;
  onClose: () => void;
  onSave: (name: string, tagline: string, accent: string | null, order: string[], visible: Record<string, boolean>) => void;
}) {
  const [name, setName] = useState(initialName);
  const [tagline, setTagline] = useState(initialTagline);
  const [accent, setAccent] = useState<string | null>(initialAccent);
  const [order, setOrder] = useState(sectionOrder);
  const [visible, setVisible] = useState(sectionVisible);
  const [dragged, setDragged] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragged(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (targetId: string) => {
    if (!dragged) return;
    const idx = order.indexOf(dragged);
    const targetIdx = order.indexOf(targetId);
    if (idx === -1 || targetIdx === -1) return;
    const next = [...order];
    next.splice(idx, 1);
    next.splice(targetIdx, 0, dragged);
    setOrder(next);
    setDragged(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'var(--color-bg)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Customize Event</h3>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Event name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }} />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Tagline</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-transparent border" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }} />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Accent color</label>
            <div className="flex gap-2 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button key={c} onClick={() => setAccent(accent === c ? null : c)} className="w-10 h-10 rounded-full border-2 transition-transform" style={{ background: c, borderColor: accent === c ? '#fff' : 'transparent', transform: accent === c ? 'scale(1.1)' : 'scale(1)' }} />
              ))}
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Section order (drag to reorder)</label>
          <div className="space-y-2">
            {order.map((id) => (
              <div
                key={id}
                draggable
                onDragStart={() => handleDragStart(id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(id)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-gray-500">⋮⋮</span>
                <span className="flex-1">{SECTION_LABELS[id] || id}</span>
                <button onClick={() => setVisible((v) => ({ ...v, [id]: !v[id] }))} className="text-sm" style={{ color: visible[id] ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                  {visible[id] ? 'Visible' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onSave(name, tagline, accent, order, visible)} className="flex-1 py-3 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>Save</button>
          <button onClick={onClose} className="flex-1 py-3 rounded-lg font-semibold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
        </div>
      </div>
    </div>
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
