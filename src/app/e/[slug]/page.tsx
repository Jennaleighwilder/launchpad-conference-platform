'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { EventData, SpeakerData, ScheduleItem, PricingData, VenueData } from '@/lib/types';
import { KenBurnsSlideshow, CountdownTimer, resolveHeroImages, resolveHeroVideo } from '@/components/demo-event/DemoEventLayout';
import { getEventTheme, type EventTheme } from '@/lib/event-themes';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import type { AccessibilityPrefs } from '@/contexts/AccessibilityContext';

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
  const [showPromo, setShowPromo] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [customAccent, setCustomAccent] = useState<string | null>(null);
  const [customHeroImages, setCustomHeroImages] = useState<string[]>([]);
  const [customHeroVideoUrl, setCustomHeroVideoUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [blocks, setBlocks] = useState<{ id: string; type: string; data: Record<string, unknown> }[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'speakers', 'schedule', 'venue', 'travel', 'gallery', 'video', 'engagement', 'pricing', 'sponsor', 'share', 'faq',
  ]);
  const [sectionVisible, setSectionVisible] = useState<Record<string, boolean>>({
    speakers: true, schedule: true, venue: true, travel: true, gallery: true, video: true, engagement: true, pricing: true, sponsor: true, share: true, faq: true,
  });
  const [customLang, setCustomLang] = useState('en');
  const [customTranslations, setCustomTranslations] = useState<Record<string, { name: string; tagline: string; description: string }>>({});
  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/e/${slug}`;

  useEffect(() => {
    async function fetchEvent() {
      try {
        // Check sessionStorage first — in-memory events (no Supabase) are stashed by create page
        const stashed = typeof window !== 'undefined' ? sessionStorage.getItem(`event-${slug}`) : null;
        if (stashed) {
          try {
            const parsed = JSON.parse(stashed);
            if (parsed?.slug === slug) {
              setEvent(parsed);
              sessionStorage.removeItem(`event-${slug}`);
              if (/^[0-9a-f-]{36}$/i.test(parsed.id)) {
                fetch(`/api/events/${parsed.id}/blocks`)
                  .then((r) => r.json())
                  .then((d) => setBlocks(d.blocks || []))
                  .catch(() => {});
              }
              try {
                const key = `event-customize-${slug}`;
                const saved = localStorage.getItem(key);
                if (saved) {
                  const cust = JSON.parse(saved);
                  if (cust.name) setCustomName(cust.name);
                  if (cust.tagline) setCustomTagline(cust.tagline);
                  if (cust.accent) setCustomAccent(cust.accent);
                  if (cust.heroImages?.length) setCustomHeroImages(cust.heroImages);
                  if (cust.heroVideoUrl) setCustomHeroVideoUrl(cust.heroVideoUrl);
                  if (cust.videoUrl) setCustomVideoUrl(cust.videoUrl);
                  if (cust.description) setCustomDescription(cust.description);
                  if (cust.sectionOrder?.length) setSectionOrder(cust.sectionOrder);
                  if (cust.sectionVisible) setSectionVisible((v) => ({ ...v, ...cust.sectionVisible }));
                  if (cust.lang) setCustomLang(cust.lang);
                  if (cust.translations) setCustomTranslations(cust.translations);
                }
              } catch { /* ignore */ }
              return;
            }
          } catch { /* fall through to API */ }
        }
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (data.event) {
          setEvent(data.event);
          if (/^[0-9a-f-]{36}$/i.test(data.event.id)) {
            fetch(`/api/events/${data.event.id}/blocks`)
              .then((r) => r.json())
              .then((d) => setBlocks(d.blocks || []))
              .catch(() => {});
          }
          // Load saved customizations from localStorage
          try {
            const key = `event-customize-${slug}`;
            const saved = localStorage.getItem(key);
            if (saved) {
              const parsed = JSON.parse(saved);
              if (parsed.name) setCustomName(parsed.name);
              if (parsed.tagline) setCustomTagline(parsed.tagline);
              if (parsed.accent) setCustomAccent(parsed.accent);
              if (parsed.heroImages?.length) setCustomHeroImages(parsed.heroImages);
              if (parsed.heroVideoUrl) setCustomHeroVideoUrl(parsed.heroVideoUrl);
              if (parsed.videoUrl) setCustomVideoUrl(parsed.videoUrl);
              if (parsed.description) setCustomDescription(parsed.description);
              if (parsed.sectionOrder?.length) setSectionOrder(parsed.sectionOrder);
              if (parsed.sectionVisible) setSectionVisible((v) => ({ ...v, ...parsed.sectionVisible }));
              if (parsed.lang) setCustomLang(parsed.lang);
              if (parsed.translations) setCustomTranslations(parsed.translations);
            }
          } catch { /* ignore */ }
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
  const theme = getEventTheme(event.topic, event.vibe, event.slug);
  const accentColor = customAccent || theme.accent;
  const baseName = customName || event.name;
  const baseTagline = customTagline !== undefined ? customTagline : event.tagline;
  const t = customLang && customLang !== 'en' ? customTranslations[customLang] : null;
  const displayName = t?.name || baseName;
  const displayTagline = t?.tagline ?? baseTagline;
  const ev = event as unknown as Record<string, unknown>;
  const heroImages = resolveHeroImages(ev, {
    customImages: customHeroImages,
    themeImages: theme.heroImages,
    slug,
    topic: event.topic,
  });
  const heroVideoUrl = resolveHeroVideo(ev, customHeroVideoUrl, { slug: event.slug, topic: event.topic, city: event.city });
  const useVideoHero = !customHeroImages.length && !!heroVideoUrl;
  const displayDescription = (t?.description || customDescription || event.description || '');
  const videoEmbedId = (() => {
    if (!customVideoUrl.trim()) return DEFAULT_VIDEO_ID;
    const yt = customVideoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (yt) return yt[1];
    const vimeo = customVideoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeo) return `vimeo:${vimeo[1]}`;
    return DEFAULT_VIDEO_ID;
  })();
  const ticketsAvailable = event.status === 'ticket_sales' || event.status === 'live';
  const displayDate = sanitizeDateForCountdown(event.date);
  const formattedDate = formatDate(displayDate);

  // Map speaker names to their talks from schedule
  const speakerTalks = schedule.reduce<Record<string, { title: string; track?: string }>>((acc, item) => {
    if (!acc[item.speaker]) acc[item.speaker] = { title: item.title, track: item.track };
    return acc;
  }, {});

  const heroBreadcrumb = `${venue.name}, ${event.city} · ${formattedDate}`;
  const countdownEnd = `${displayDate}T09:00:00-04:00`;

  useEffect(() => {
    if (!event) return;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.description || event.tagline || '',
      startDate: event.date,
      endDate: event.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: venue?.name || '',
        address: { '@type': 'PostalAddress', addressLocality: event.city },
      },
      organizer: { '@type': 'Organization', name: 'Launchpad', url: 'https://launchpad-conference-platform.vercel.app' },
      offers: pricing ? {
        '@type': 'AggregateOffer',
        lowPrice: String(pricing.early_bird || '').replace(/[^0-9.]/g, '') || '0',
        highPrice: String(pricing.vip || '').replace(/[^0-9.]/g, '') || '0',
        priceCurrency: pricing.currency || 'USD',
        availability: 'https://schema.org/InStock',
      } : undefined,
      performer: speakers.slice(0, 5).map((s) => ({ '@type': 'Person', name: s.name })),
    };
    let el = document.getElementById('event-schema');
    if (!el) {
      el = document.createElement('script');
      el.id = 'event-schema';
      el.setAttribute('type', 'application/ld+json');
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    document.title = `${event.name} — ${event.city} | Launchpad`;
    return () => {
      el?.remove();
    };
  }, [event, venue, speakers, pricing]);

  const themeVars = {
    '--color-bg': theme.bg,
    '--color-text': theme.text,
    '--color-text-muted': theme.textMuted,
    '--color-accent': accentColor,
    '--font-display': theme.fontDisplay,
    '--font-mono': theme.fontMono,
    '--color-card-bg': theme.cardBg,
    '--color-card-border': theme.cardBorder,
    '--card-radius': theme.buttonRadius === '0' ? '0' : '16px',
    '--color-warm': theme.accentSecondary || accentColor,
    '--color-warm-dim': `${accentColor}20`,
  } as React.CSSProperties;

  const hasTranslations = Object.keys(customTranslations).length > 0;

  return (
    <main className="min-h-screen relative" style={{ ...themeVars, background: 'transparent', color: theme.text }} lang={customLang || undefined}>
      {/* Hero — media layer inside section so it always fills */}
      <section className="relative isolate min-h-[85vh] flex flex-col justify-end pb-24 pt-32 px-6 overflow-hidden">
        {/* HERO MEDIA LAYER — z-0 so visible above body, below overlays */}
        {useVideoHero && heroVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={heroVideoUrl}
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 z-0">
            <KenBurnsSlideshow images={heroImages} />
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 z-[1]" style={{ background: theme.heroOverlay }} />
        <div className="absolute inset-0 z-[1] opacity-20" style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${accentColor}30 0%, transparent 70%)`,
        }} />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <Link href="/" className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: theme.textMuted }}>
              ← Back to Launchpad
            </Link>
            <div className="flex items-center gap-2">
              {hasTranslations && (
                <select value={customLang} onChange={(e) => {
                  const next = e.target.value;
                  setCustomLang(next);
                  try {
                    const key = `event-customize-${slug}`;
                    const saved = localStorage.getItem(key);
                    if (saved) {
                      const cust = JSON.parse(saved);
                      localStorage.setItem(key, JSON.stringify({ ...cust, lang: next }));
                    }
                  } catch { /* ignore */ }
                }}
                  className="px-3 py-2 text-sm rounded-lg"
                  style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.text, borderRadius: theme.buttonRadius }}>
                  <option value="en">English</option>
                  {Object.keys(customTranslations).map((code) => (
                    <option key={code} value={code}>{LANGUAGES.find((l) => l.code === code)?.label || code}</option>
                  ))}
                </select>
              )}
              <button onClick={() => setShowPromo(true)} className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#FBBF24', borderRadius: theme.buttonRadius }}>
                📣 Promote This Event
              </button>
              <button onClick={() => setCustomizeOpen(true)} className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, color: theme.text, borderRadius: theme.buttonRadius }}>
                ✏️ Customize Event
              </button>
            </div>
          </div>

          <p className="mb-4 text-sm" style={{ color: theme.textMuted, fontFamily: theme.fontMono, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
            {heroBreadcrumb}
          </p>

          <h1 className="mb-4" style={{
            fontFamily: theme.fontDisplay,
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: theme.text,
            textShadow: '0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.3)',
          }}>
            {displayName}
          </h1>

          {displayTagline && (
            <p className="mb-8 max-w-2xl" style={{ color: accentColor, fontSize: '1.25rem', fontFamily: theme.fontMono, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
              {displayTagline}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="#pricing" className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all"
              style={{ background: accentColor, color: (theme.bg === '#FFFFFF' || theme.bg === '#FAFAF8') ? '#0a0a0a' : theme.bg, borderRadius: theme.buttonRadius }}>
              Get your ticket →
            </Link>
            <a href="#schedule" className="inline-flex items-center gap-2 px-6 py-3 font-semibold transition-all border"
              style={{ borderColor: theme.cardBorder, color: theme.text, borderRadius: theme.buttonRadius }}>
              Explore the program
            </a>
          </div>

          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: theme.textMuted, textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>Event starts in</p>
            <CountdownTimer endDate={countdownEnd} accentColor={accentColor} />
          </div>
        </div>
      </section>

      {/* Impact strip — theme stats */}
      <section className="px-6 py-12" style={{ background: theme.bgGradient || `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, ${theme.bg} 100%)`, borderTop: `1px solid ${accentColor}26` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: theme.fontDisplay, color: accentColor }}>{speakers.length}</div>
              <div className="text-sm" style={{ color: theme.textMuted }}>Speakers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: theme.fontDisplay, color: accentColor }}>{tracks.length || 4}</div>
              <div className="text-sm" style={{ color: theme.textMuted }}>Tracks</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: theme.fontDisplay, color: accentColor }}>{event.capacity}</div>
              <div className="text-sm" style={{ color: theme.textMuted }}>Attendees</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: theme.fontDisplay, color: accentColor }}>{schedule.length}</div>
              <div className="text-sm" style={{ color: theme.textMuted }}>Sessions</div>
            </div>
          </div>
        </div>
      </section>

      {/* User content blocks */}
      {blocks.length > 0 && (
        <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-5xl mx-auto space-y-8">
            {blocks.map((block) => (
              <EventBlock key={block.id} block={block} accentColor={accentColor} />
            ))}
          </div>
        </section>
      )}

      {/* Why you should attend */}
      {displayDescription && (
        <section className="px-6 py-16" style={{ background: theme.cardBg, borderTop: `1px solid ${theme.cardBorder}` }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6" style={{ fontFamily: theme.fontDisplay, color: theme.text }}>
              The stage for ambitious minds
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <p className="text-lg" style={{ color: theme.textMuted, lineHeight: 1.7 }}>
                {displayDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#schedule" className="px-6 py-4 transition-colors" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.buttonRadius }}>
                  <span className="font-medium" style={{ color: theme.text }}>Program</span>
                  <span className="block text-sm mt-1" style={{ color: theme.textMuted }}>View schedule</span>
                </a>
                <a href="#speakers" className="px-6 py-4 transition-colors" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.buttonRadius }}>
                  <span className="font-medium" style={{ color: theme.text }}>Speakers</span>
                  <span className="block text-sm mt-1" style={{ color: theme.textMuted }}>Meet the lineup</span>
                </a>
                <a href="#pricing" className="px-6 py-4 transition-colors" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.buttonRadius }}>
                  <span className="font-medium" style={{ color: theme.text }}>Tickets</span>
                  <span className="block text-sm mt-1" style={{ color: theme.textMuted }}>Get your ticket</span>
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
            <Image src={heroImages[0]} alt={venue.name} width={800} height={400} className="w-full h-48 object-cover" unoptimized />
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
                src={videoEmbedId.startsWith('vimeo:') ? `https://player.vimeo.com/video/${videoEmbedId.slice(6)}` : `https://www.youtube.com/embed/${videoEmbedId}?rel=0`}
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
            <div className="card text-center flex flex-col" style={{ borderColor: `${accentColor}4D`, boxShadow: `0 0 20px ${accentColor}0D` }}>
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

      {showPromo && (
        <PromoteModal
          event={event}
          venue={venue}
          speakers={speakers}
          pricing={pricing}
          tracks={tracks}
          theme={theme}
          accentColor={accentColor}
          promoData={promoData}
          promoLoading={promoLoading}
          onClose={() => { setShowPromo(false); setPromoData(null); }}
          onGenerate={async () => {
            setPromoLoading(true);
            try {
              const res = await fetch('/api/events/promote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: event.name,
                  topic: event.topic || 'Tech',
                  city: event.city,
                  date: event.date,
                  description: event.description || event.tagline || '',
                  tagline: event.tagline || '',
                  speakers: speakers.map((s) => ({ name: s.name, role: s.role || '' })),
                  tracks: tracks.length ? tracks : ['Main'],
                  pricing: pricing ? {
                    early_bird: String(pricing.early_bird || ''),
                    regular: String(pricing.regular || ''),
                    vip: String(pricing.vip || ''),
                    currency: pricing.currency || 'USD',
                  } : { early_bird: '0', regular: '0', vip: '0', currency: 'USD' },
                  venue: venue ? { name: venue.name, address: venue.address || '' } : { name: '', address: '' },
                  slug: event.slug,
                }),
              });
              const data = await res.json();
              if (data.promo) setPromoData(data.promo);
              else setPromoData({ social: {}, communities: [], emails: { emails: [] }, partners: [], seo: {}, ads: {}, agentTimings: {}, errors: data.errors || [] });
            } catch {
              setPromoData({ social: {}, communities: [], emails: { emails: [] }, partners: [], seo: {}, ads: {}, agentTimings: {}, errors: ['Failed to generate'] });
            } finally {
              setPromoLoading(false);
            }
          }}
        />
      )}

      {customizeOpen && (
        <CustomizeModal
          event={event}
          initialName={customName || event.name}
          initialTagline={customTagline !== undefined ? customTagline : (event.tagline || '')}
          initialAccent={customAccent}
          initialHeroImages={customHeroImages}
          initialHeroVideoUrl={customHeroVideoUrl}
          initialVideoUrl={customVideoUrl}
          initialDescription={customDescription || event.description || ''}
          initialLang={customLang}
          initialTranslations={customTranslations}
          sectionOrder={sectionOrder}
          sectionVisible={sectionVisible}
          onClose={() => setCustomizeOpen(false)}
          onSave={async (name, tagline, accent, heroImages, heroVidUrl, videoUrl, description, order, visible, lang, translations) => {
            setCustomName(name);
            setCustomTagline(tagline);
            setCustomAccent(accent);
            setCustomHeroImages(heroImages);
            setCustomHeroVideoUrl(heroVidUrl);
            setCustomVideoUrl(videoUrl);
            setCustomDescription(description);
            setSectionOrder(order);
            setSectionVisible(visible);
            if (lang) setCustomLang(lang);
            if (translations) setCustomTranslations(translations);

            const isDbEvent = /^[0-9a-f-]{36}$/i.test(event.id);
            if (isDbEvent) {
              try {
                const r = await fetch(`/api/events/${event.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name,
                    tagline,
                    description,
                    heroImages: heroImages.length ? heroImages : undefined,
                    heroVideoUrl: heroVidUrl || undefined,
                  }),
                });
                if (r.ok) {
                  try { localStorage.removeItem(`event-customize-${slug}`); } catch { /* ignore */ }
                }
              } catch { /* ignore */ }
            } else {
              try {
                localStorage.setItem(`event-customize-${slug}`, JSON.stringify({ name, tagline, accent, heroImages, heroVideoUrl: heroVidUrl, videoUrl, description, sectionOrder: order, sectionVisible: visible, lang, translations }));
              } catch { /* ignore */ }
            }
            setCustomizeOpen(false);
          }}
        />
      )}
    </main>
  );
}

const ACCENT_COLORS = ['#4FFFDF', '#A78BFA', '#34D399', '#F472B6', '#FBBF24', '#60A5FA', '#EF4444', '#22C55E'];

const PROMO_TABS = [
  { id: 'social', label: 'Social', icon: '📱' },
  { id: 'communities', label: 'Communities', icon: '👥' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'partners', label: 'Partners', icon: '🤝' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
  { id: 'ads', label: 'Ads', icon: '📢' },
] as const;

const PROMO_AGENTS = ['socialBlitzBot', 'communityBot', 'emailBot', 'partnerBot', 'seoBot', 'retargetBot'];

function PromoteModal({
  event,
  venue,
  speakers,
  pricing,
  tracks,
  theme,
  accentColor,
  promoData,
  promoLoading,
  onClose,
  onGenerate,
}: {
  event: EventData;
  venue: VenueData;
  speakers: SpeakerData[];
  pricing: PricingData;
  tracks: string[];
  theme: EventTheme;
  accentColor: string;
  promoData: any;
  promoLoading: boolean;
  onClose: () => void;
  onGenerate: () => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<string>('social');
  const [agentStates, setAgentStates] = useState<Record<string, 'pending' | 'running' | 'done'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (!promoLoading) return;
    setAgentStates(Object.fromEntries(PROMO_AGENTS.map((n) => [n, 'pending'])));
    const delays = [0, 400, 800, 1200, 1600, 2000];
    PROMO_AGENTS.forEach((name, i) => {
      setTimeout(() => setAgentStates((s) => ({ ...s, [name]: 'running' })), delays[i]);
    });
  }, [promoLoading]);

  useEffect(() => {
    if (!promoLoading && promoData) {
      PROMO_AGENTS.forEach((name) => setAgentStates((s) => ({ ...s, [name]: 'done' })));
    }
  }, [promoLoading, promoData]);

  const cardStyle = { background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: theme.buttonRadius };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.9)' }}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl" style={{ ...cardStyle, borderColor: `${accentColor}40` }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.cardBorder }}>
          <h2 className="text-xl font-semibold" style={{ fontFamily: theme.fontDisplay, color: theme.text }}>Promotion Kit</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-80" style={{ color: theme.textMuted }} aria-label="Close">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {!promoData && !promoLoading && (
            <div className="text-center py-12">
              <p className="mb-6" style={{ color: theme.textMuted }}>Generate social posts, email drafts, SEO content, and ad copy in one click.</p>
              <button onClick={onGenerate} className="px-8 py-4 font-semibold rounded-xl inline-flex items-center gap-2" style={{ background: accentColor, color: theme.bg }}>
                🚀 Generate Promotion Kit
              </button>
            </div>
          )}
          {promoLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PROMO_AGENTS.map((name) => (
                <div key={name} className="p-4 rounded-xl flex items-center gap-3" style={cardStyle}>
                  <span className="text-2xl">{agentStates[name] === 'done' ? '✅' : agentStates[name] === 'running' ? '⚡' : '⏳'}</span>
                  <span className="text-sm" style={{ color: theme.text }}>{name.replace(/Bot$/, '')}</span>
                </div>
              ))}
            </div>
          )}
          {promoData && !promoLoading && (
            <>
              <div className="flex gap-2 flex-wrap mb-6">
                {PROMO_TABS.map((t) => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className="px-4 py-2 text-sm rounded-lg transition-colors"
                    style={{ background: activeTab === t.id ? `${accentColor}30` : theme.cardBg, border: `1px solid ${activeTab === t.id ? accentColor : theme.cardBorder}`, color: activeTab === t.id ? accentColor : theme.text }}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {activeTab === 'social' && promoData.social && (
                  <div className="space-y-4">
                    {['linkedin', 'twitter', 'instagram'].map((platform) => (
                      <div key={platform}>
                        <h3 className="text-sm font-semibold mb-2 uppercase" style={{ color: accentColor }}>{platform}</h3>
                        {(promoData.social[platform] || []).map((post: any, i: number) => (
                          <div key={i} className="p-4 rounded-xl mb-3 relative" style={cardStyle}>
                            <p className="text-sm mb-2" style={{ color: theme.text }}>{post.text}</p>
                            {post.hashtags && <p className="text-xs mb-2" style={{ color: theme.textMuted }}>{post.hashtags}</p>}
                            <button onClick={() => copyText(post.text + (post.hashtags ? '\n' + post.hashtags : ''), `s-${platform}-${i}`)} className="absolute top-2 right-2 px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                              {copiedId === `s-${platform}-${i}` ? 'Copied!' : '📋 Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'communities' && promoData.communities && (
                  <div className="space-y-3">
                    {(promoData.communities || []).map((c: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl relative" style={cardStyle}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium" style={{ color: theme.text }}>{c.platform}: {c.name}</span>
                          <span className="text-xs" style={{ color: accentColor }}>{c.relevance}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{c.draft_post}</p>
                        <button onClick={() => copyText(c.draft_post, `c-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                          {copiedId === `c-${i}` ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'email' && promoData.emails?.emails && (
                  <div className="space-y-4">
                    {(promoData.emails.emails || []).map((e: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl relative" style={cardStyle}>
                        <h3 className="font-medium mb-2" style={{ color: accentColor }}>{e.name} (Day {e.send_day})</h3>
                        <p className="text-sm mb-1" style={{ color: theme.text }}>A: {e.subject_a}</p>
                        <p className="text-sm mb-2" style={{ color: theme.text }}>B: {e.subject_b}</p>
                        <pre className="text-xs whitespace-pre-wrap mb-2 p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: theme.textMuted }}>{e.body_text}</pre>
                        <button onClick={() => copyText(`${e.subject_a}\n\n${e.body_text}`, `e-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                          {copiedId === `e-${i}` ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'partners' && promoData.partners && (
                  <div className="space-y-3">
                    {(promoData.partners || []).map((p: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl relative" style={cardStyle}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium" style={{ color: theme.text }}>{p.name}</span>
                          <span className="text-xs" style={{ color: accentColor }}>{p.partnership_type}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{p.outreach_email_draft}</p>
                        <button onClick={() => copyText(p.outreach_email_draft, `p-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                          {copiedId === `p-${i}` ? 'Copied!' : '📋 Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'seo' && promoData.seo && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl" style={cardStyle}>
                      <h3 className="font-medium mb-2" style={{ color: accentColor }}>Meta</h3>
                      <p className="text-sm mb-1" style={{ color: theme.text }}>{promoData.seo.meta_title}</p>
                      <p className="text-sm mb-2" style={{ color: theme.textMuted }}>{promoData.seo.meta_description}</p>
                      <button onClick={() => copyText(promoData.seo.meta_title + '\n' + promoData.seo.meta_description, 'seo-meta')} className="px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                        {copiedId === 'seo-meta' ? 'Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl" style={cardStyle}>
                      <h3 className="font-medium mb-2" style={{ color: accentColor }}>Schema.org JSON-LD</h3>
                      <pre className="text-xs overflow-x-auto p-2 rounded mb-2" style={{ background: 'rgba(0,0,0,0.3)', color: theme.textMuted }}>{JSON.stringify(promoData.seo.schema_json || {}, null, 2)}</pre>
                      <button onClick={() => copyText(JSON.stringify(promoData.seo.schema_json || {}, null, 2), 'seo-schema')} className="px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                        {copiedId === 'seo-schema' ? 'Copied!' : '📋 Copy'}
                      </button>
                    </div>
                    <div className="p-4 rounded-xl" style={cardStyle}>
                      <h3 className="font-medium mb-2" style={{ color: accentColor }}>Blog outlines</h3>
                      {(promoData.seo.blog_outlines || []).map((b: any, i: number) => (
                        <p key={i} className="text-sm mb-1" style={{ color: theme.text }}>• {b.title}</p>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'ads' && promoData.ads && (
                  <div className="space-y-4">
                    {['meta', 'google', 'linkedin'].map((platform) => (
                      <div key={platform}>
                        <h3 className="text-sm font-semibold mb-2 uppercase" style={{ color: accentColor }}>{platform}</h3>
                        {(promoData.ads[platform] || []).map((ad: any, i: number) => (
                          <div key={`${platform}-${i}`} className="p-4 rounded-xl mb-3 relative" style={cardStyle}>
                            <p className="font-medium text-sm mb-1" style={{ color: theme.text }}>{ad.headline}</p>
                            <p className="text-sm mb-1" style={{ color: theme.textMuted }}>{ad.body}</p>
                            <p className="text-xs mb-2" style={{ color: theme.textMuted }}>Audience: {ad.audience_targeting} · Budget: {ad.suggested_daily_budget}</p>
                            <button onClick={() => copyText(`${ad.headline}\n${ad.body}`, `ad-${platform}-${i}`)} className="px-2 py-1 text-xs rounded" style={{ background: `${accentColor}20`, color: accentColor }}>
                              {copiedId === `ad-${platform}-${i}` ? 'Copied!' : '📋 Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const SECTION_LABELS: Record<string, string> = {
  speakers: 'Speakers', schedule: 'Schedule', venue: 'Venue + Map', travel: 'Stay & Dine',
  gallery: 'Photo Gallery', video: 'Video Highlight',
  engagement: 'Networking & Live Engagement', pricing: 'Tickets', sponsor: 'Sponsor CTA', share: 'Share & Calendar', faq: 'Event FAQ',
};

const TABS = [
  { id: 'content', label: 'Content', icon: '✏️' },
  { id: 'media', label: 'Media', icon: '🖼️' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿' },
  { id: 'language', label: 'Language', icon: '🌐' },
] as const;

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
];

function CustomizeModal({
  event,
  initialName,
  initialTagline,
  initialAccent,
  initialHeroImages,
  initialHeroVideoUrl,
  initialVideoUrl,
  initialDescription,
  initialLang,
  initialTranslations,
  sectionOrder,
  sectionVisible,
  onClose,
  onSave,
}: {
  event: EventData;
  initialName: string;
  initialTagline: string;
  initialAccent: string | null;
  initialHeroImages: string[];
  initialHeroVideoUrl: string;
  initialVideoUrl: string;
  initialDescription: string;
  initialLang?: string;
  initialTranslations?: Record<string, { name: string; tagline: string; description: string }>;
  sectionOrder: string[];
  sectionVisible: Record<string, boolean>;
  onClose: () => void;
  onSave: (name: string, tagline: string, accent: string | null, heroImages: string[], heroVideoUrl: string, videoUrl: string, description: string, order: string[], visible: Record<string, boolean>, lang?: string, translations?: Record<string, { name: string; tagline: string; description: string }>) => void;
}) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('content');
  const [name, setName] = useState(initialName);
  const [tagline, setTagline] = useState(initialTagline);
  const [accent, setAccent] = useState<string | null>(initialAccent);
  const [heroImagesText, setHeroImagesText] = useState(initialHeroImages.join('\n'));
  const [heroVideoUrl, setHeroVideoUrl] = useState(initialHeroVideoUrl);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [uploading, setUploading] = useState<'image' | 'video' | null>(null);
  const [description, setDescription] = useState(initialDescription);
  const [order, setOrder] = useState(sectionOrder);
  const [visible, setVisible] = useState(sectionVisible);
  const [dragged, setDragged] = useState<string | null>(null);
  const [lang, setLang] = useState(initialLang || 'en');
  const [translations, setTranslations] = useState<Record<string, { name: string; tagline: string; description: string }>>(initialTranslations || {});

  const { prefs, setPref, togglePref } = useAccessibility();

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

  const handleSave = () => {
    const heroImages = heroImagesText.split('\n').map((u) => u.trim()).filter(Boolean);
    const hasTranslations = Object.keys(translations).some((code) => {
      const t = translations[code];
      return t?.name || t?.tagline || t?.description;
    });
    onSave(name, tagline, accent, heroImages, heroVideoUrl.trim(), videoUrl.trim(), description.trim(), order, visible, lang, hasTranslations ? translations : undefined);
  };

  const inputStyle = { borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' };
  const labelStyle = { color: 'var(--color-text-muted)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose}>
      <div className="max-w-xl w-full max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--color-bg)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Edit Event</h3>
          <button onClick={onClose} className="text-sm p-2 -m-2 rounded-lg hover:bg-white/5" style={labelStyle}>✕</button>
        </div>
        <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex-1 px-4 py-3 text-sm font-medium transition-colors"
              style={{
                color: activeTab === t.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
                borderBottom: activeTab === t.id ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Event name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-transparent border" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Tagline</label>
                <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-transparent border" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Event description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Why attend section" className="w-full px-4 py-3 rounded-lg bg-transparent border text-sm" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Accent color</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENT_COLORS.map((c) => (
                    <button key={c} onClick={() => setAccent(accent === c ? null : c)} className="w-10 h-10 rounded-full border-2 transition-transform" style={{ background: c, borderColor: accent === c ? '#fff' : 'transparent', transform: accent === c ? 'scale(1.1)' : 'scale(1)' }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Section order (drag to reorder)</label>
                <div className="space-y-2">
                  {order.map((id) => (
                    <div key={id} draggable onDragStart={() => handleDragStart(id)} onDragOver={handleDragOver} onDrop={() => handleDrop(id)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="text-gray-500">⋮⋮</span>
                      <span className="flex-1">{SECTION_LABELS[id] || id}</span>
                      <button onClick={() => setVisible((v) => ({ ...v, [id]: !v[id] }))} className="text-sm" style={{ color: visible[id] ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                        {visible[id] ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Hero images</label>
                <div className="flex gap-2 mb-2">
                  <label className="flex-1 px-4 py-2 rounded-lg border text-center text-sm cursor-pointer transition-colors hover:border-[var(--color-accent)]" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-text)' }}>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading('image');
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        fd.append('type', 'image');
                        const heroUrl = /^[0-9a-f-]{36}$/i.test(event.id) ? `/api/events/${event.id}/hero` : `/api/events/${event.slug}/hero`;
                        const r = await fetch(heroUrl, { method: 'POST', body: fd });
                        const d = await r.json();
                        if (d.url) setHeroImagesText((t) => (t ? `${t}\n${d.url}` : d.url));
                        else alert(d.error || 'Upload failed');
                      } catch { alert('Upload failed'); }
                      finally { setUploading(null); e.target.value = ''; }
                    }} />
                    {uploading === 'image' ? 'Uploading…' : '📷 Upload'}
                  </label>
                  <label className="flex-1 px-4 py-2 rounded-lg border text-center text-sm cursor-pointer transition-colors hover:border-[var(--color-accent)]" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-text)' }}>
                    <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploading('video');
                      try {
                        const fd = new FormData();
                        fd.append('file', file);
                        fd.append('type', 'video');
                        const heroUrl = /^[0-9a-f-]{36}$/i.test(event.id) ? `/api/events/${event.id}/hero` : `/api/events/${event.slug}/hero`;
                        const r = await fetch(heroUrl, { method: 'POST', body: fd });
                        const d = await r.json();
                        if (d.url) setHeroVideoUrl(d.url);
                        else alert(d.error || 'Upload failed');
                      } catch { alert('Upload failed'); }
                      finally { setUploading(null); e.target.value = ''; }
                    }} />
                    {uploading === 'video' ? 'Uploading…' : '🎬 Hero video'}
                  </label>
                </div>
                <p className="text-xs mb-2" style={labelStyle}>Or paste image URLs (one per line). Hero video overrides images.</p>
                <textarea value={heroImagesText} onChange={(e) => setHeroImagesText(e.target.value)} rows={2} placeholder="https://..." className="w-full px-4 py-3 rounded-lg bg-transparent border text-sm" style={inputStyle} />
                <input value={heroVideoUrl} onChange={(e) => setHeroVideoUrl(e.target.value)} placeholder="Hero video URL (mp4)" className="w-full mt-2 px-4 py-2 rounded-lg bg-transparent border text-sm" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Watch section video (YouTube or Vimeo)</label>
                <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." className="w-full px-4 py-3 rounded-lg bg-transparent border text-sm" style={inputStyle} />
              </div>
            </div>
          )}
          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <p className="text-sm mb-4" style={labelStyle}>Adjust display for readability. Changes apply to this page.</p>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={prefs.dyslexia} onChange={() => togglePref('dyslexia')} className="rounded" />
                <div>
                  <span className="font-medium">Dyslexia Mode</span>
                  <span className="block text-xs" style={labelStyle}>OpenDyslexic font, wider spacing</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={prefs.adhdFocus} onChange={() => togglePref('adhdFocus')} className="rounded" />
                <div>
                  <span className="font-medium">ADHD Focus</span>
                  <span className="block text-xs" style={labelStyle}>No animations, narrow text</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={prefs.highContrast} onChange={() => togglePref('highContrast')} className="rounded" />
                <span className="font-medium">High Contrast</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="checkbox" checked={prefs.reducedMotion} onChange={() => togglePref('reducedMotion')} className="rounded" />
                <span className="font-medium">Reduced Motion</span>
              </label>
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Text size</label>
                <select value={prefs.textSize} onChange={(e) => setPref('textSize', e.target.value as AccessibilityPrefs['textSize'])}
                  className="w-full rounded px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', ...inputStyle }}>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>
            </div>
          )}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={labelStyle}>Display language</label>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full rounded px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', ...inputStyle }}>
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(79,255,223,0.06)', border: '1px solid rgba(79,255,223,0.2)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--color-accent)' }}>Add translations</p>
                <p className="text-xs" style={labelStyle}>Select a language and paste translated name, tagline, and description. Translation API integration coming soon.</p>
              </div>
              {LANGUAGES.filter((l) => l.code !== 'en').map((l) => (
                <div key={l.code} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h4 className="font-medium mb-3">{l.label}</h4>
                  <input value={translations[l.code]?.name ?? ''} onChange={(e) => setTranslations((t) => ({ ...t, [l.code]: { ...(t[l.code] || { name: '', tagline: '', description: '' }), name: e.target.value } }))}
                    placeholder="Event name" className="w-full px-3 py-2 rounded-lg text-sm mb-2 bg-transparent border" style={inputStyle} />
                  <input value={translations[l.code]?.tagline ?? ''} onChange={(e) => setTranslations((t) => ({ ...t, [l.code]: { ...(t[l.code] || { name: '', tagline: '', description: '' }), tagline: e.target.value } }))}
                    placeholder="Tagline" className="w-full px-3 py-2 rounded-lg text-sm mb-2 bg-transparent border" style={inputStyle} />
                  <textarea value={translations[l.code]?.description ?? ''} onChange={(e) => setTranslations((t) => ({ ...t, [l.code]: { ...(t[l.code] || { name: '', tagline: '', description: '' }), description: e.target.value } }))}
                    placeholder="Description" rows={2} className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border" style={inputStyle} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleSave} className="flex-1 py-3 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>Save</button>
          <button onClick={onClose} className="flex-1 py-3 rounded-lg font-semibold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function EventBlock({ block, accentColor }: { block: { type: string; data: Record<string, unknown> }; accentColor: string }) {
  const d = block.data;
  switch (block.type) {
    case 'text':
      return (
        <div className="card">
          <div className="prose prose-invert max-w-none whitespace-pre-wrap">
            {String((d.text as string) || (d.html as string) || '')}
          </div>
        </div>
      );
    case 'image': {
      const url = (d.url as string) || '';
      const isVideo = url && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'));
      return (
        <div className="card overflow-hidden p-0">
          {isVideo ? (
            <video src={url} autoPlay muted loop playsInline className="w-full h-auto object-cover aspect-video" />
          ) : (
            <img src={url} alt={(d.alt as string) || ''} className="w-full h-auto object-cover" />
          )}
        </div>
      );
    }
    case 'video':
      return (
        <div className="card overflow-hidden p-0">
          <div className="aspect-video">
            <iframe src={(d.embedUrl as string) || (d.url as string) || ''} title="" className="w-full h-full" allowFullScreen />
          </div>
        </div>
      );
    case 'gallery':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {((d.images as string[]) || []).map((src, i) => {
            const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov'));
            return isVideo ? (
              <div key={i} className="rounded-lg overflow-hidden aspect-square">
                <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              </div>
            ) : (
              <img key={i} src={src} alt="" className="w-full aspect-square object-cover rounded-lg" />
            );
          })}
        </div>
      );
    case 'cta':
      return (
        <div className="card text-center py-8">
          <h3 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>{(d.title as string) || 'Call to action'}</h3>
          <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>{(d.subtitle as string) || ''}</p>
          <a href={(d.url as string) || '#'} className="inline-flex px-6 py-3 font-semibold rounded-lg" style={{ background: accentColor, color: '#0a0a0a' }}>
            {(d.buttonText as string) || 'Learn more'}
          </a>
        </div>
      );
    default:
      return null;
  }
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

/** Use realistic date for countdown when event date is unreasonably far (e.g. 2029). */
function sanitizeDateForCountdown(dateStr: string): string {
  try {
    const parsed = new Date(dateStr + 'T12:00:00');
    if (isNaN(parsed.getTime())) return '2026-09-15';
    const now = new Date();
    const daysDiff = (parsed.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 400) return '2026-09-15';
    return dateStr;
  } catch {
    return '2026-09-15';
  }
}
