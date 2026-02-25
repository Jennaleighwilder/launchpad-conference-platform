import { NextRequest, NextResponse } from 'next/server';

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

const DEMO_EVENTS: Record<string, Record<string, unknown>> = {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const demoEvent = DEMO_EVENTS[slug];
    if (demoEvent) {
      return NextResponse.json({ event: demoEvent });
    }

    // Try Supabase first
    if (hasSupabase()) {
      try {
        const { createServiceClient } = await import('@/lib/supabase');
        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          return NextResponse.json({ event: data });
        }
      } catch (dbErr) {
        console.warn('Supabase unavailable, checking memory store');
      }
    }

    // Fallback to in-memory store
    const { memoryStore } = await import('../generate/route');
    const event = memoryStore.get(slug);

    if (event) {
      return NextResponse.json({ event });
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
