'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { EventData, SpeakerData, ScheduleItem, PricingData, VenueData } from '@/lib/types';
import { KenBurnsSlideshow, CountdownTimer } from '@/components/demo-event/DemoEventLayout';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&h=1080&fit=crop',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1920&h=1080&fit=crop',
];

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

const HOTEL_IMGS = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop',
];

const CITY_HOTELS: Record<string, { name: string; distance: string; price: string; stars: number }[]> = {
  amsterdam: [
    { name: 'NH Collection Grand Hotel Krasnapolsky', distance: '0.3 km', price: '€189', stars: 5 },
    { name: 'Hotel TwentySeven', distance: '0.5 km', price: '€450', stars: 5 },
    { name: 'Hotel Estheréa', distance: '0.7 km', price: '€165', stars: 4 },
  ],
  ghent: [
    { name: 'Hotel Harmony', distance: '0.2 km', price: '€145', stars: 4 },
    { name: 'Marriott Ghent', distance: '0.5 km', price: '€220', stars: 5 },
    { name: 'B&B The Verhaegen', distance: '0.8 km', price: '€95', stars: 4 },
  ],
  brussels: [
    { name: 'Hotel Amigo', distance: '0.3 km', price: '€320', stars: 5 },
    { name: 'The Dominican', distance: '0.5 km', price: '€195', stars: 5 },
    { name: 'Ibis Brussels Centre', distance: '0.6 km', price: '€89', stars: 3 },
  ],
  berlin: [
    { name: 'Hotel Adlon Kempinski', distance: '0.4 km', price: '€450', stars: 5 },
    { name: 'The Circus Hotel', distance: '0.6 km', price: '€120', stars: 4 },
    { name: 'Mitte Design Hotel', distance: '0.8 km', price: '€135', stars: 4 },
  ],
  london: [
    { name: 'The Savoy', distance: '0.3 km', price: '£520', stars: 5 },
    { name: 'Zedwell Piccadilly', distance: '0.5 km', price: '£145', stars: 4 },
    { name: 'Hub by Premier Inn', distance: '0.7 km', price: '£89', stars: 4 },
  ],
  paris: [
    { name: 'Le Meurice', distance: '0.3 km', price: '€680', stars: 5 },
    { name: 'Hôtel des Grands Boulevards', distance: '0.5 km', price: '€220', stars: 4 },
    { name: 'Ibis Paris Opéra', distance: '0.6 km', price: '€110', stars: 3 },
  ],
  stockholm: [
    { name: 'Grand Hôtel Stockholm', distance: '0.2 km', price: '€380', stars: 5 },
    { name: 'Clarion Hotel Stockholm', distance: '0.5 km', price: '€165', stars: 4 },
    { name: 'Scandic Klara', distance: '0.7 km', price: '€125', stars: 4 },
  ],
  copenhagen: [
    { name: 'Nimb Hotel', distance: '0.2 km', price: '€420', stars: 5 },
    { name: 'Hotel Sanders', distance: '0.4 km', price: '€280', stars: 5 },
    { name: 'Wakeup Copenhagen', distance: '0.6 km', price: '€95', stars: 3 },
  ],
};

const CITY_RESTAURANTS: Record<string, { name: string; cuisine: string; distance: string; price: string }[]> = {
  amsterdam: [
    { name: 'The Seafood Bar', cuisine: 'Seafood', distance: '0.2 km', price: '€€€' },
    { name: 'Café de Jaren', cuisine: 'Dutch', distance: '0.4 km', price: '€€' },
    { name: 'Restaurant Adam', cuisine: 'Fine Dining', distance: '0.6 km', price: '€€€€' },
    { name: 'Foodhallen', cuisine: 'Street Food', distance: '1.2 km', price: '€€' },
  ],
  ghent: [
    { name: 'Publiek', cuisine: 'Belgian', distance: '0.3 km', price: '€€€' },
    { name: 'Holy Food Market', cuisine: 'International', distance: '0.5 km', price: '€€' },
    { name: 'Greenway', cuisine: 'Vegetarian', distance: '0.4 km', price: '€€' },
    { name: 'Bar Bassie', cuisine: 'Cocktails & Bites', distance: '0.2 km', price: '€€' },
  ],
  brussels: [
    { name: 'Comme Chez Soi', cuisine: 'Belgian', distance: '0.4 km', price: '€€€€' },
    { name: 'Nüetnigenough', cuisine: 'Belgian', distance: '0.3 km', price: '€€' },
    { name: 'Le Cirio', cuisine: 'Brasserie', distance: '0.5 km', price: '€€' },
    { name: 'Tonton Garby', cuisine: 'Sandwiches', distance: '0.6 km', price: '€' },
  ],
  berlin: [
    { name: 'Katz Orange', cuisine: 'German', distance: '0.3 km', price: '€€€' },
    { name: 'Mustafa\'s Gemüse Kebap', cuisine: 'Street Food', distance: '0.8 km', price: '€' },
    { name: 'Coda Dessert Bar', cuisine: 'Desserts', distance: '0.5 km', price: '€€€' },
    { name: 'Markthalle Neun', cuisine: 'Food Hall', distance: '1.0 km', price: '€€' },
  ],
  london: [
    { name: 'Dishoom', cuisine: 'Indian', distance: '0.4 km', price: '€€€' },
    { name: 'The Wolseley', cuisine: 'Brasserie', distance: '0.3 km', price: '€€€€' },
    { name: 'Borough Market', cuisine: 'Street Food', distance: '1.2 km', price: '€€' },
    { name: 'Flat Iron', cuisine: 'Steakhouse', distance: '0.5 km', price: '€€' },
  ],
  paris: [
    { name: 'L\'Ambroisie', cuisine: 'French', distance: '0.3 km', price: '€€€€' },
    { name: 'Breizh Café', cuisine: 'Crêpes', distance: '0.5 km', price: '€€' },
    { name: 'Du Pain et des Idées', cuisine: 'Bakery', distance: '0.6 km', price: '€' },
    { name: 'Le Comptoir du Relais', cuisine: 'Bistro', distance: '0.4 km', price: '€€€' },
  ],
  stockholm: [
    { name: 'Frantzén', cuisine: 'Nordic', distance: '0.3 km', price: '€€€€' },
    { name: 'Meatballs for the People', cuisine: 'Swedish', distance: '0.7 km', price: '€€' },
    { name: 'Vete-Katten', cuisine: 'Café', distance: '0.4 km', price: '€€' },
    { name: 'Östermalms Saluhall', cuisine: 'Food Hall', distance: '0.8 km', price: '€€€' },
  ],
  copenhagen: [
    { name: 'Noma', cuisine: 'Nordic', distance: '0.5 km', price: '€€€€' },
    { name: 'Torvehallerne', cuisine: 'Food Hall', distance: '0.6 km', price: '€€' },
    { name: 'Reffen', cuisine: 'Street Food', distance: '1.5 km', price: '€€' },
    { name: 'Mad & Kaffe', cuisine: 'Brunch', distance: '0.4 km', price: '€€' },
  ],
};

const PHOTO_GALLERY = [
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', label: 'Main stage' },
  { src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop', label: 'Networking' },
  { src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop', label: 'Workshop' },
  { src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop', label: 'Exhibition' },
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop', label: 'Keynote' },
];

const DEFAULT_VIDEO_ID = 'f8DKD78BrQA';

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
    'speakers', 'schedule', 'venue', 'travel', 'gallery', 'video', 'engagement', 'pricing', 'sponsor', 'share', 'faq',
  ]);
  const [sectionVisible, setSectionVisible] = useState<Record<string, boolean>>({
    speakers: true, schedule: true, venue: true, travel: true, gallery: true, video: true, engagement: true, pricing: true, sponsor: true, share: true, faq: true,
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

  const heroBreadcrumb = `${venue.name}, ${event.city} · ${formattedDate}`;
  const countdownEnd = `${event.date}T09:00:00`;

  return (
    <main className="min-h-screen relative" style={{ background: 'var(--color-bg)' }}>
      {/* SuperNova hero — 85vh full-bleed Ken Burns (light gradient so images show) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <KenBurnsSlideshow images={HERO_IMAGES} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(5,5,8,0.4) 0%, rgba(5,5,8,0.5) 40%, rgba(5,5,8,0.92) 100%)',
        }} />
        <div className="absolute inset-0 opacity-20" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}30 0%, transparent 70%)`,
        }} />
      </div>

      {/* Hero — SuperNova style */}
      <section className="relative px-6 min-h-[85vh] flex flex-col justify-end pb-24 pt-32">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-accent)]"
              style={{ color: 'var(--color-text-muted)' }}>
              ← Back to Launchpad
            </Link>
            <button onClick={() => setCustomizeOpen(true)} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-text)' }}>
              ✏️ Customize Event
            </button>
          </div>

          <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {heroBreadcrumb}
          </p>

          <h1 className="mb-4" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}>
            {displayName}
          </h1>

          {displayTagline && (
            <p className="mb-8 max-w-2xl" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
              {displayTagline}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="#pricing" className="btn-primary inline-flex items-center gap-2">
              Get your ticket →
            </Link>
            <a href="#schedule" className="btn-secondary inline-flex items-center gap-2">
              Explore the program
            </a>
          </div>

          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Event starts in</p>
            <CountdownTimer endDate={countdownEnd} accentColor={accentColor} />
          </div>
        </div>
      </section>

      {/* Impact strip — SuperNova stats */}
      <section className="px-6 py-12" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.9) 100%)', borderTop: `1px solid ${accentColor}26` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>{speakers.length}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Speakers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>{tracks.length || 4}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Tracks</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>{event.capacity}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Attendees</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>{schedule.length}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Sessions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why you should attend — SuperNova */}
      {event.description && (
        <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              The stage for ambitious minds
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <p className="text-lg" style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                {event.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#schedule" className="card px-6 py-4 hover:border-[var(--color-accent)] transition-colors">
                  <span className="font-medium">Program</span>
                  <span className="block text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>View schedule</span>
                </a>
                <a href="#speakers" className="card px-6 py-4 hover:border-[var(--color-accent)] transition-colors">
                  <span className="font-medium">Speakers</span>
                  <span className="block text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Meet the lineup</span>
                </a>
                <a href="#pricing" className="card px-6 py-4 hover:border-[var(--color-accent)] transition-colors">
                  <span className="font-medium">Tickets</span>
                  <span className="block text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Get your ticket</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Speakers — SuperNova square cards */}
      {sectionVisible.speakers && speakers.length > 0 && (
        <section id="speakers" className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>Speakers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {speakers.map((speaker, i) => {
                const talk = speakerTalks[speaker.name];
                const trackColor = talk?.track ? TRACK_COLORS[tracks.indexOf(talk.track) % TRACK_COLORS.length] : accentColor;
                return (
                  <div key={i} className="card group transition-transform hover:-translate-y-1">
                    <div className="relative w-full aspect-[4/5] rounded-lg mb-4 overflow-hidden">
                      {speaker.photo_url ? (
                        <Image src={speaker.photo_url} alt={speaker.name} fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ background: `${accentColor}20`, color: accentColor }}>
                          {speaker.initials}
                        </div>
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

      {/* Schedule — SuperNova: JetBrains Mono + track-colored bars */}
      {sectionVisible.schedule && schedule.length > 0 && (
        <section id="schedule" className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Schedule</h2>
              <Link href={`/e/${slug}/agenda`} className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-accent)' }}>View full agenda →</Link>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="space-y-0">
                {schedule.map((item, i) => {
                  const trackIdx = item.track ? tracks.indexOf(item.track) : -1;
                  const barColor = trackIdx >= 0 ? TRACK_COLORS[trackIdx % TRACK_COLORS.length] : accentColor;
                  return (
                    <div key={i} className="relative flex items-start gap-6 py-5 pl-12">
                      <div className="absolute left-0 w-20 text-right">
                        <span className="text-sm font-medium" style={{ color: accentColor, fontFamily: 'var(--font-mono)' }}>
                          {item.time}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 card py-4 flex gap-4">
                        <div className="w-1 shrink-0 rounded-full self-stretch" style={{ background: item.track ? barColor : 'rgba(255,255,255,0.2)' }} />
                        <div>
                          <div className="font-medium mb-1">{item.title}</div>
                          <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{item.speaker}</div>
                          {item.track && (
                            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded"
                              style={{ background: `${barColor}20`, color: barColor }}>
                              {item.track}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          <div className="rounded-xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <Image src={HERO_IMAGES[0]} alt={venue.name} width={800} height={400} className="w-full h-48 object-cover" unoptimized />
          </div>
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
              style={{ border: 0, filter: 'invert(0.9) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      )}

      {/* Stay & Dine + Getting There */}
      {sectionVisible.travel && (
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Stay & Dine</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {(getHotelsForCity(event.city)).map((h, i) => (
              <a
                key={h.name}
                href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(event.city)}&checkin=${event.date}&checkout=${event.date}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card overflow-hidden hover:border-[var(--color-accent)] transition-colors block"
              >
                <div className="relative h-32 -m-6 mb-4">
                  <Image src={HOTEL_IMGS[i % HOTEL_IMGS.length]} alt={h.name} fill className="object-cover" unoptimized />
                </div>
                <h3 className="font-semibold mb-1">{h.name}</h3>
                <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>{h.distance} · {'★'.repeat(h.stars)}</p>
                <p className="text-sm font-medium" style={{ color: accentColor }}>{h.price}/night</p>
              </a>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {(getRestaurantsForCity(event.city)).map((r) => (
              <div key={r.name} className="card">
                <h3 className="font-semibold mb-1">{r.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{r.cuisine} · {r.distance} · {r.price}</p>
              </div>
            ))}
          </div>
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Getting There</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <a
              href={`https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(event.city)}%20on%20${event.date}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[var(--color-accent)] transition-colors group"
            >
              <span className="text-2xl">✈️</span>
              <div className="text-left">
                <div className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">Flights</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Google Flights → {event.city}</div>
              </div>
            </a>
            <a
              href={`https://www.thetrainline.com/trains/to/${encodeURIComponent(event.city.toLowerCase().replace(/\s/g, '-'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[var(--color-accent)] transition-colors group"
            >
              <span className="text-2xl">🚂</span>
              <div className="text-left">
                <div className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">Trains</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Trainline → {event.city}</div>
              </div>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[var(--color-accent)] transition-colors group"
            >
              <span className="text-2xl">🚇</span>
              <div className="text-left">
                <div className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">Local transport</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Directions to venue</div>
              </div>
            </a>
          </div>
        </div>
      </section>
      )}

      {/* Photo Gallery */}
      {sectionVisible.gallery && (
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>At the event</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PHOTO_GALLERY.map((p, i) => (
              <div key={i} className="card overflow-hidden p-0">
                <div className="relative aspect-[4/3]">
                  <Image src={p.src} alt={p.label} fill className="object-cover" unoptimized />
                </div>
                <div className="p-3">
                  <span className="text-xs font-medium" style={{ color: accentColor }}>{p.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Video Highlight */}
      {sectionVisible.video && (
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Watch</h2>
          <div className="card overflow-hidden p-0">
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${DEFAULT_VIDEO_ID}?rel=0`}
                title="Conference highlight"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-1">Conference highlight reel</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>See what past attendees experienced</p>
            </div>
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

      {/* Pricing — SuperNova: Choose your experience + X% sold out badges */}
      {sectionVisible.pricing && (
      <section id="pricing" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>Choose your experience</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Select the ticket that fits your goals</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center flex flex-col">
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Early Bird</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: accentColor }}>
                {pricing.early_bird}
              </div>
              <div className="text-xs mb-2 px-2 py-1 rounded inline-block" style={{ background: `${accentColor}20`, color: accentColor }}>
                {SOLD_PCT.early_bird}% sold out
              </div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.early_bird}%`, background: accentColor }} />
              </div>
              <button
                onClick={() => handleBuyTicket('early_bird', pricing.early_bird)}
                disabled={!!checkoutLoading || !ticketsAvailable}
                className="btn-primary w-full py-3 text-sm disabled:opacity-50"
              >
                {checkoutLoading === 'early_bird' ? 'Loading...' : ticketsAvailable ? 'Get your ticket' : 'Coming Soon'}
              </button>
            </div>
            <div className="card text-center flex flex-col" style={{ borderColor: 'rgba(79,255,223,0.3)', boxShadow: '0 0 20px rgba(79,255,223,0.05)' }}>
              <div className="text-sm uppercase tracking-wider mb-2" style={{ color: accentColor }}>Regular</div>
              <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                {pricing.regular}
              </div>
              <div className="text-xs mb-2 px-2 py-1 rounded inline-block" style={{ background: `${accentColor}20`, color: accentColor }}>
                {SOLD_PCT.regular}% sold out
              </div>
              <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.regular}%`, background: accentColor }} />
              </div>
              <button
                onClick={() => handleBuyTicket('regular', pricing.regular)}
                disabled={!!checkoutLoading || !ticketsAvailable}
                className="btn-primary w-full py-3 text-sm disabled:opacity-50"
              >
                {checkoutLoading === 'regular' ? 'Loading...' : ticketsAvailable ? 'Get your ticket' : 'Coming Soon'}
              </button>
            </div>
            {pricing.vip && (
              <div className="card text-center flex flex-col">
                <div className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--color-warm)' }}>VIP</div>
                <div className="text-3xl font-bold mb-2 flex-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warm)' }}>
                  {pricing.vip}
                </div>
                <div className="text-xs mb-2 px-2 py-1 rounded inline-block" style={{ background: 'var(--color-warm-dim)', color: 'var(--color-warm)' }}>
                  {SOLD_PCT.vip}% sold out
                </div>
                <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${SOLD_PCT.vip}%`, background: 'var(--color-warm)' }} />
                </div>
                <button
                  onClick={() => handleBuyTicket('vip', pricing.vip!)}
                  disabled={!!checkoutLoading || !ticketsAvailable}
                  className="btn-primary w-full py-3 text-sm disabled:opacity-50"
                >
                  {checkoutLoading === 'vip' ? 'Loading...' : ticketsAvailable ? 'Get your ticket' : 'Coming Soon'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* Sponsor & Affiliate CTA */}
      {sectionVisible.sponsor && (
      <section className="px-6 py-12" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto text-center flex flex-wrap justify-center gap-4">
          <Link href="/sponsor" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>
            Become a Sponsor →
          </Link>
          <Link href="/affiliate" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: 'rgba(79,255,223,0.08)', border: '1px solid rgba(79,255,223,0.25)', color: 'var(--color-accent)' }}>
            💰 Refer & Earn 40% →
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
            <Link
              href="/affiliate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:border-[var(--color-accent)]"
              style={{ background: 'rgba(79,255,223,0.08)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}
            >
              💰 Refer & Earn 40%
            </Link>
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
        <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Generated by <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Launchpad</Link> — AI-powered conference generation
        </p>
        <Link href="/affiliate" className="text-sm" style={{ color: 'var(--color-accent)' }}>Earn 40% as affiliate →</Link>
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
  speakers: 'Speakers', schedule: 'Schedule', venue: 'Venue + Map', travel: 'Stay & Dine',
  gallery: 'Photo Gallery', video: 'Video Highlight',
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

function getHotelsForCity(city: string): { name: string; distance: string; price: string; stars: number }[] {
  const key = city.toLowerCase().replace(/\s/g, '');
  const match = Object.keys(CITY_HOTELS).find((k) => key.includes(k) || k.includes(key));
  if (match) return CITY_HOTELS[match];
  return [
    { name: `${city} Grand Hotel`, distance: '0.3 km', price: '$189', stars: 5 },
    { name: `${city} Central Inn`, distance: '0.5 km', price: '$129', stars: 4 },
    { name: `${city} Boutique Stay`, distance: '0.8 km', price: '$95', stars: 4 },
  ];
}

function getRestaurantsForCity(city: string): { name: string; cuisine: string; distance: string; price: string }[] {
  const key = city.toLowerCase().replace(/\s/g, '');
  const match = Object.keys(CITY_RESTAURANTS).find((k) => key.includes(k) || k.includes(key));
  if (match) return CITY_RESTAURANTS[match];
  return [
    { name: 'The Local Bistro', cuisine: 'Local', distance: '0.2 km', price: '€€' },
    { name: 'Café Central', cuisine: 'Café', distance: '0.4 km', price: '€' },
    { name: 'Market Kitchen', cuisine: 'International', distance: '0.6 km', price: '€€€' },
    { name: 'Street Food Hall', cuisine: 'Street Food', distance: '1.0 km', price: '€€' },
  ];
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
