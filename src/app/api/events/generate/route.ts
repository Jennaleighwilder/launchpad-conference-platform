import { NextRequest, NextResponse } from 'next/server';
import { generateEvent } from '@/lib/generate';
import { runSwarm } from '@/lib/swarm';
import type { CreateEventInput, EventData } from '@/lib/types';

// In-memory store for events (works without Supabase)
const memoryStore = new Map<string, EventData>();
export { memoryStore };

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

function hasOpenAI(): boolean {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-key');
}

function makeSlug(topic: string, city: string): string {
  const id = Math.random().toString(36).substring(2, 6);
  return `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 15)}-${id}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEventInput = await request.json();
    const useSwarm = request.nextUrl.searchParams.get('mode') === 'swarm';

    if (!body.topic || !body.city || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, city, date' },
        { status: 400 }
      );
    }

    let eventData: any;

    // ── SWARM MODE: 5 parallel AI agents ────────────────────────────
    if (useSwarm && hasOpenAI()) {
      console.log('[swarm] Dispatching 5 agents...');
      const swarmResult = await runSwarm({
        topic: body.topic,
        city: body.city,
        date: body.date,
        capacity: body.capacity || 500,
        budget: body.budget || 'growth',
        vibe: body.vibe || 'professional',
        speakers_hint: body.speakers_hint,
      });

      eventData = {
        slug: makeSlug(body.topic, body.city),
        name: swarmResult.branding.name,
        topic: body.topic,
        city: body.city,
        date: body.date,
        capacity: body.capacity || 500,
        budget: body.budget || 'growth',
        vibe: body.vibe || 'professional',
        tagline: swarmResult.branding.tagline,
        description: swarmResult.branding.description,
        topic_key: swarmResult.branding.topic_key,
        venue: swarmResult.venue,
        tracks: swarmResult.tracks,
        speakers: swarmResult.speakers,
        schedule: swarmResult.schedule,
        pricing: swarmResult.pricing,
        _swarm: { timings: swarmResult.agentTimings, errors: swarmResult.errors },
      };
      console.log('[swarm] Complete:', swarmResult.agentTimings);
    } else {
      // ── STANDARD MODE: single-pass generation ──────────────────────
      eventData = await generateEvent({
        topic: body.topic,
        city: body.city,
        date: body.date,
        capacity: body.capacity || 500,
        budget: body.budget || 'growth',
        vibe: body.vibe || 'professional',
        speakers_hint: body.speakers_hint,
      });
    }

    const fullEvent: EventData = {
      ...eventData,
      id: crypto.randomUUID(),
      status: 'live',
      created_at: new Date().toISOString(),
    };

    // Try Supabase first, fall back to in-memory
    if (hasSupabase()) {
      try {
        const { createServiceClient } = await import('@/lib/supabase');
        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from('events')
          .insert({
            slug: fullEvent.slug,
            name: fullEvent.name,
            topic: fullEvent.topic,
            city: fullEvent.city,
            date: fullEvent.date,
            capacity: fullEvent.capacity,
            budget: fullEvent.budget,
            vibe: fullEvent.vibe,
            venue: fullEvent.venue,
            tracks: fullEvent.tracks,
            speakers: fullEvent.speakers,
            schedule: fullEvent.schedule,
            pricing: fullEvent.pricing,
            description: fullEvent.description,
            tagline: fullEvent.tagline,
            topic_key: fullEvent.topic_key,
            status: 'live',
          })
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, event: data, persisted: true });
        }
      } catch (dbErr) {
        console.warn('Supabase unavailable, using in-memory store:', dbErr);
      }
    }

    // In-memory fallback
    memoryStore.set(fullEvent.slug, fullEvent);
    console.log(`[memory] Stored event: ${fullEvent.slug} (${memoryStore.size} total)`);

    return NextResponse.json({
      success: true,
      event: fullEvent,
      persisted: false,
    });
  } catch (error) {
    console.error('Event generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate event' },
      { status: 500 }
    );
  }
}
