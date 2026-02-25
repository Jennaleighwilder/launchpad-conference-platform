import { NextRequest, NextResponse } from 'next/server';

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

const DEMO_CONFERENCE = {
  id: 'demo',
  slug: 'demo-conference',
  name: 'SuperNova AI Summit 2026',
  topic: 'AI & Machine Learning',
  topic_key: 'ai',
  city: 'Amsterdam, Netherlands',
  date: '2026-03-25',
  capacity: 2500,
  budget: '',
  vibe: '',
  venue: { name: 'Beurs van Berlage', address: 'Damrak 243, Amsterdam', capacity_note: 'Historic venue in the heart of Amsterdam' },
  tracks: ['AI & Machine Learning', 'Startup Growth', 'Enterprise Innovation'],
  speakers: [],
  schedule: [],
  pricing: { early_bird: '€299', regular: '€499', vip: '€999', currency: 'EUR' },
  description: 'Where AI meets ambition. A two-day summit bringing together innovators, founders, and enterprise leaders.',
  tagline: 'Where AI meets ambition',
  created_at: new Date().toISOString(),
  status: 'ticket_sales' as const,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (slug === 'demo-conference') {
      return NextResponse.json({ event: DEMO_CONFERENCE });
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
