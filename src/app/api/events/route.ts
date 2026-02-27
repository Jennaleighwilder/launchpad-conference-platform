import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth';

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

export async function GET(request: NextRequest) {
  try {
    const user = await getServerUser(request);

    // Try Supabase first
    if (hasSupabase()) {
      try {
        const { createServiceClient } = await import('@/lib/supabase');
        const supabase = createServiceClient();
        let query = supabase
          .from('events')
          .select('id, slug, name, topic, city, date, status, created_at')
          .order('created_at', { ascending: false });

        if (user?.id) {
          query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (!error && data) {
          return NextResponse.json({ events: data });
        }
      } catch (_dbErr) {
        console.warn('Supabase unavailable, checking memory store');
      }
    }

    // Fallback to in-memory store
    const { memoryStore } = await import('./generate/route');
    const allEvents = Array.from(memoryStore.values());
    const events = (user?.id
      ? allEvents.filter((e) => (e as { user_id?: string }).user_id === user.id)
      : allEvents
    ).map((e) => ({
      id: e.id,
      slug: e.slug,
      name: e.name,
      topic: e.topic,
      city: e.city,
      date: e.date,
      status: e.status,
      created_at: e.created_at,
    }));
    events.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

    return NextResponse.json({ events: events });
  } catch (error) {
    console.error('Events list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
