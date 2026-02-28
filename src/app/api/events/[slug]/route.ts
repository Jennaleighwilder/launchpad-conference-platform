import { NextRequest, NextResponse } from 'next/server';
import { getUniqueHeroForEvent } from '@/lib/hero-images';
import { pickSpeakers } from '@/lib/generate';
import { createServiceClient } from '@/lib/supabase';

/** Ensure event always has hero_image_url — for pre-migration events or missing hero_assets. */
function ensureHeroUrl(ev: Record<string, unknown>): void {
  if (ev.hero_image_url || ev.hero_video_url) return;
  const topic = String(ev.topic || '');
  const city = String(ev.city || '');
  const slug = String(ev.slug || '');
  if (topic && city && slug) {
    ev.hero_image_url = getUniqueHeroForEvent(topic, city, slug);
  }
}

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

function buildDemoEvents(): Record<string, Record<string, unknown>> {
  const demos: [string, string, string][] = [
    ['demo-conference', 'AI & Machine Learning', 'Amsterdam, Netherlands'],
    ['ai-summit-2026', 'AI & Machine Learning', 'Amsterdam, Netherlands'],
    ['ai-festival-uk-2026', 'AI & Machine Learning', 'Bury St Edmunds, UK'],
    ['the-future-forum', 'Youth & Leadership', 'Amsterdam, Netherlands'],
    ['cybernova', 'Cybersecurity', 'Amsterdam, Netherlands'],
    ['startup-zaken', 'Startups', 'Amsterdam, Netherlands'],
    ['an-evening-with', 'Keynote', 'Amsterdam, Netherlands'],
  ];
  const base: Record<string, Record<string, unknown>> = {
    'demo-conference': {
      id: 'demo',
      slug: 'demo-conference',
      name: 'SuperNova AI Summit 2026',
      topic: 'AI & Machine Learning',
      topic_key: 'ai',
      city: 'Amsterdam, Netherlands',
      date: '2026-03-25',
      capacity: 2500,
      venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Historic venue in the heart of Amsterdam' },
      tracks: ['AI & Machine Learning', 'Startup Growth', 'Enterprise Innovation'],
      speakers: [],
      schedule: [],
      pricing: { early_bird: '€299', regular: '€499', vip: '€999', currency: 'EUR' },
      description: 'Where AI meets ambition. A two-day summit bringing together innovators, founders, and enterprise leaders.',
      tagline: 'Where AI meets ambition',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
    'ai-summit-2026': {
      id: 'demo',
      slug: 'ai-summit-2026',
      name: 'AI Summit 2026',
      topic: 'AI & Machine Learning',
      topic_key: 'ai',
      city: 'Amsterdam, Netherlands',
      date: '2026-03-25',
      capacity: 2500,
      venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Historic venue in the heart of Amsterdam' },
      tracks: ['AI & Machine Learning', 'Startup Growth', 'Enterprise Innovation'],
      speakers: [],
      schedule: [],
      pricing: { early_bird: '€299', regular: '€499', vip: '€999', currency: 'EUR' },
      description: 'The flagship 2-day conference. Where AI meets ambition.',
      tagline: 'Where AI meets ambition',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
    'ai-festival-uk-2026': {
      id: 'demo',
      slug: 'ai-festival-uk-2026',
      name: 'AI Festival UK 2026',
      topic: 'AI & Machine Learning',
      topic_key: 'ai',
      city: 'Bury St Edmunds, UK',
      date: '2026-05-27',
      capacity: 2000,
      venue: { name: 'West Suffolk College STEM Centre', address: '73 Western Way, Bury St Edmunds IP33 3TB', capacity_note: '£2M state-of-the-art XR Lab' },
      tracks: ['PitchFest', 'Cyber Security', 'Robotics & Automation', 'AI & Quantum Computing', 'Energy Environment & Infrastructure', 'Agriculture & Food', 'XR & AI', 'Creative & Media', 'Healthcare'],
      speakers: [],
      schedule: [],
      pricing: { day1: '£49', day2: '£49', full: '£89', currency: 'GBP' },
      description: "The UK's premier AI festival. Two days at West Suffolk College's £2M XR Lab.",
      tagline: '10 tracks · 2 days · Bury St Edmunds',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
    'the-future-forum': {
      id: 'demo-1',
      slug: 'the-future-forum',
      name: 'The Future Forum',
      topic: 'Youth & Leadership',
      topic_key: 'innovation',
      city: 'Amsterdam, Netherlands',
      date: '2026-03-23',
      capacity: 800,
      venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Historic venue' },
      tracks: ['Youth Leadership', 'Innovation'],
      speakers: [],
      schedule: [],
      pricing: { early_bird: '€99', regular: '€149', vip: '€299', currency: 'EUR' },
      description: 'For students & young leaders. A day of inspiration and connection.',
      tagline: 'For the next generation',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
    'cybernova': {
      id: 'demo-2',
      slug: 'cybernova',
      name: 'CyberNova',
      topic: 'Cybersecurity',
      topic_key: 'tech',
      city: 'Amsterdam, Netherlands',
      date: '2026-03-24',
      capacity: 600,
      venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Historic venue' },
      tracks: ['Cybersecurity', 'Infrastructure'],
      speakers: [],
      schedule: [],
      pricing: { early_bird: '€199', regular: '€299', vip: '€599', currency: 'EUR' },
      description: 'Cybersecurity deep-dive. Experts, practitioners, and the latest threats.',
      tagline: 'Secure the future',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
    'startup-zaken': {
      id: 'demo-3',
      slug: 'startup-zaken',
      name: 'Startup Zaken',
      topic: 'Startups',
      topic_key: 'startup',
      city: 'Amsterdam, Netherlands',
      date: '2026-03-28',
      capacity: 400,
      venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Historic venue' },
      tracks: ['Startup Growth', 'Funding'],
      speakers: [],
      schedule: [],
      pricing: { early_bird: '€79', regular: '€129', vip: '€249', currency: 'EUR' },
      description: 'For small & medium businesses. Practical growth and funding insights.',
      tagline: 'Build. Scale. Thrive.',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
    'an-evening-with': {
      id: 'demo-4',
      slug: 'an-evening-with',
      name: 'An Evening With',
      topic: 'Keynote',
      topic_key: 'innovation',
      city: 'Amsterdam, Netherlands',
      date: '2026-03-29',
      capacity: 300,
      venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Intimate setting' },
      tracks: ['Keynote'],
      speakers: [],
      schedule: [],
      pricing: { early_bird: '€149', regular: '€199', vip: '€399', currency: 'EUR' },
      description: 'World-class keynote speaker. An intimate evening of inspiration.',
      tagline: 'One speaker. One night.',
      created_at: new Date().toISOString(),
      status: 'ticket_sales',
    },
  };
  for (const [slug, topic, city] of demos) {
    base[slug].hero_image_url = getUniqueHeroForEvent(topic, city, slug);
    base[slug].hero_media_type = 'image';
    const topicKey = topic.toLowerCase().includes('ai') ? 'ai' : topic.toLowerCase().includes('cyber') ? 'web3' : topic.toLowerCase().includes('startup') ? 'general' : topic.toLowerCase().includes('youth') ? 'general' : topic.toLowerCase().includes('keynote') ? 'general' : 'general';
    base[slug].speakers = pickSpeakers(topicKey, 8);
    base[slug].schedule = [
      { time: '9:00 AM', title: `Opening Keynote: The Future of ${topic}`, speaker: (base[slug].speakers as { name: string }[])[0]?.name ?? 'TBA', track: (base[slug].tracks as string[])[0] },
      { time: '10:30 AM', title: 'Coffee & Networking', speaker: (base[slug].speakers as { name: string }[])[1]?.name ?? 'TBA', track: (base[slug].tracks as string[])[1] },
      { time: '11:00 AM', title: `Deep Dive: ${(base[slug].tracks as string[])[0]}`, speaker: (base[slug].speakers as { name: string }[])[2]?.name ?? 'TBA', track: (base[slug].tracks as string[])[0] },
      { time: '12:30 PM', title: 'Lunch & Exhibition', speaker: '—', track: '' },
      { time: '1:30 PM', title: `Panel: ${(base[slug].tracks as string[])[1]}`, speaker: (base[slug].speakers as { name: string }[])[3]?.name ?? 'TBA', track: (base[slug].tracks as string[])[1] },
      { time: '3:00 PM', title: 'Afternoon Break', speaker: '—', track: '' },
      { time: '4:30 PM', title: `Closing Keynote`, speaker: (base[slug].speakers as { name: string }[])[4]?.name ?? 'TBA', track: (base[slug].tracks as string[])[0] },
    ];
  }
  return base;
}

const DEMO_EVENTS = buildDemoEvents();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isId = UUID_REGEX.test(slug);

    const demoEvent = !isId ? DEMO_EVENTS[slug] : null;
    if (demoEvent) {
      return NextResponse.json({ event: demoEvent });
    }

    // Try Supabase first
    if (hasSupabase()) {
      try {
        const supabase = createServiceClient();
        const { data: eventRow, error } = await supabase
          .from('events')
          .select('*')
          .eq(isId ? 'id' : 'slug', slug)
          .single();

        if (!error && eventRow) {
          const ev = eventRow as Record<string, unknown>;
          if (ev.hero_asset_id) {
            const { data: hero } = await supabase
              .from('hero_assets')
              .select('image_url, video_url')
              .eq('id', ev.hero_asset_id)
              .single();
            if (hero) {
              if (hero.image_url) ev.hero_image_url = hero.image_url;
              if (hero.video_url) ev.hero_video_url = hero.video_url;
            }
          }
          ensureHeroUrl(ev);
          return NextResponse.json({ event: ev });
        }
      } catch (_dbErr) {
        console.warn('Supabase unavailable, checking memory store');
      }
    }

    // Fallback to in-memory store
    const { memoryStore } = await import('../generate/route');
    const event = memoryStore.get(slug);

    if (event) {
      const ev = event as unknown as Record<string, unknown>;
      ensureHeroUrl(ev);
      return NextResponse.json({ event: ev });
    }

    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

const PATCH_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * PATCH /api/events/[id] — persist hero overrides and event fields to DB.
 * Param must be event UUID (from event.id).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: param } = await params;
    if (!param || !PATCH_UUID_REGEX.test(param)) {
      return NextResponse.json({ error: 'Invalid event id. PATCH requires event UUID.' }, { status: 400 });
    }

    if (!hasSupabase()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const body = await request.json();
    const supabase = createServiceClient();

    const { data: eventRow } = await supabase.from('events').select('id').eq('id', param).single();
    if (!eventRow) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventUpdates: Record<string, unknown> = {};
    if (body.name != null) eventUpdates.name = body.name;
    if (body.tagline != null) eventUpdates.tagline = body.tagline;
    if (body.description != null) eventUpdates.description = body.description;
    if (Array.isArray(body.speakers)) eventUpdates.speakers = body.speakers;

    if (Object.keys(eventUpdates).length > 0) {
      await supabase.from('events').update(eventUpdates).eq('id', param);
    }

    const heroImageUrl = Array.isArray(body.heroImages) ? body.heroImages[0] : body.hero_image_url;
    const heroVideoUrl = body.heroVideoUrl ?? body.hero_video_url;

    if (heroImageUrl != null || heroVideoUrl != null) {
      const heroPayload: Record<string, unknown> = {
        event_id: param,
        provider: 'upload',
      };
      if (heroVideoUrl) {
        heroPayload.video_url = heroVideoUrl;
        heroPayload.image_url = null;
      } else if (heroImageUrl) {
        heroPayload.image_url = heroImageUrl;
        heroPayload.video_url = null;
      }
      await supabase.from('hero_assets').upsert(heroPayload, { onConflict: 'event_id' });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Event PATCH error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
