import { NextRequest, NextResponse } from 'next/server';
import { generateEvent } from '@/lib/generate';
import { runSwarm } from '@/lib/swarm';
import { getServerUser } from '@/lib/auth';
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

/** Ensure event date is realistic (3–6 months out). Avoids countdowns showing 1000+ days. */
function sanitizeEventDate(dateStr: string): string {
  const parsed = new Date(dateStr + 'T12:00:00');
  if (isNaN(parsed.getTime())) return '2026-09-15';
  const now = new Date();
  const maxMonths = 12;
  const maxDate = new Date(now);
  maxDate.setMonth(maxDate.getMonth() + maxMonths);
  if (parsed > maxDate) {
    const sixMonths = new Date(now);
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    return sixMonths.toISOString().slice(0, 10);
  }
  return dateStr;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser(request);
    const body: CreateEventInput = await request.json();
    const useSwarm = request.nextUrl.searchParams.get('mode') === 'swarm';

    if (!body.topic || !body.city || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, city, date' },
        { status: 400 }
      );
    }

    const eventDate = sanitizeEventDate(body.date);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- swarm/fallback return shape varies
    let eventData: any;
    const days = (body.days === 2 || body.days === 3 ? body.days : 1) as 1 | 2 | 3;

    // ── SWARM MODE: 5 parallel AI agents (or enhanced fallback when no key) ──
    if (useSwarm) {
      if (hasOpenAI()) {
        console.log('[swarm] Dispatching 5 agents...');
        const swarmResult = await runSwarm({
          topic: body.topic,
          city: body.city,
          date: eventDate,
          capacity: body.capacity || 500,
          budget: body.budget || 'growth',
          vibe: body.vibe || 'professional',
          speakers_hint: body.speakers_hint,
        });

        const slug = makeSlug(body.topic, body.city);
        const { selectHeroImage } = await import('@/lib/hero-images');
        eventData = {
          slug,
          name: swarmResult.branding.name,
          topic: body.topic,
          city: body.city,
          date: eventDate,
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
          hero_image_url: selectHeroImage(swarmResult.branding.topic_key, body.hero_style || 'auto', slug),
          hero_video_url: null,
          hero_media_type: 'image',
          _swarm: { timings: swarmResult.agentTimings, errors: swarmResult.errors },
        };
        console.log('[swarm] Complete:', swarmResult.agentTimings);
      } else {
        // Swarm without API key: use enhanced built-in generation (12 speakers, richer content)
        console.log('[swarm] Enhanced fallback (no API key)');
        eventData = await generateEvent({
          ...body,
          topic: body.topic,
          city: body.city,
          date: eventDate,
          capacity: body.capacity || 500,
          budget: body.budget || 'growth',
          vibe: body.vibe || 'professional',
          speakers_hint: body.speakers_hint,
          days,
          enhanced: true,
        });
      }
    } else {
      // ── STANDARD MODE: single-pass generation ──────────────────────
      eventData = await generateEvent({
        ...body,
        topic: body.topic,
        city: body.city,
        date: eventDate,
        capacity: body.capacity || 500,
        budget: body.budget || 'growth',
        vibe: body.vibe || 'professional',
        speakers_hint: body.speakers_hint,
        days,
      });
    }

    const venue = {
      ...eventData.venue,
      ...(body.venue_name?.trim() && { name: body.venue_name.trim() }),
      ...(body.venue_address?.trim() && { address: body.venue_address.trim() }),
    };
    const fullEvent: EventData & { user_id?: string } = {
      ...eventData,
      venue,
      id: crypto.randomUUID(),
      status: 'draft',
      created_at: new Date().toISOString(),
      ...(user?.id && { user_id: user.id }),
    };

    // Try Supabase first, fall back to in-memory
    if (hasSupabase()) {
      try {
        const { createServiceClient } = await import('@/lib/supabase');
        const { generateHeroForEvent } = await import('@/lib/generate');
        const supabase = createServiceClient();

        // Fetch used provider_asset_ids to prevent stock reuse
        const { data: usedRows } = await supabase.from('hero_assets').select('provider_asset_id').not('provider_asset_id', 'is', null);
        const usedIds = new Set((usedRows || []).map((r) => r.provider_asset_id as string).filter(Boolean));

        // Use pre-resolved hero when user chose custom/abstract/minimal; otherwise generate
        const { getUniqueHeroForEvent } = await import('@/lib/hero-images');
        let heroImageUrl: string | null;
        let heroProvider = 'fallback';
        let heroAssetId: string | null = null;

        if (fullEvent.hero_style === 'abstract' || fullEvent.hero_style === 'minimal') {
          heroImageUrl = null;
        } else if (fullEvent.hero_image_url) {
          heroImageUrl = fullEvent.hero_image_url;
          heroProvider = fullEvent.hero_image_url.includes('pollinations') ? 'pollinations' : 'url';
        } else {
          try {
            const heroResult = await Promise.race([
              generateHeroForEvent(
                { name: fullEvent.name, topic: fullEvent.topic, city: fullEvent.city, slug: fullEvent.slug, vibe: fullEvent.vibe },
                usedIds
              ),
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Hero generation timeout')), 15000)
              ),
            ]);
            heroImageUrl = heroResult.image_url;
            heroProvider = heroResult.provider;
            heroAssetId = heroResult.provider_asset_id ?? null;
          } catch (heroErr) {
            console.warn('Hero generation failed, using fallback:', heroErr);
            heroImageUrl = getUniqueHeroForEvent(fullEvent.topic, fullEvent.city, fullEvent.slug);
          }
        }

        const insertPayload: Record<string, unknown> = {
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
          hero_image_url: heroImageUrl,
          hero_video_url: null,
          hero_media_type: 'image',
          hero_style: fullEvent.hero_style || 'auto',
          status: 'draft',
        };
        if (user?.id) insertPayload.user_id = user.id;

        const { data, error } = await supabase
          .from('events')
          .insert(insertPayload)
          .select()
          .single();

        if (error) {
          console.error('[Supabase] Insert error:', JSON.stringify(error));
        }
        if (!error && data) {
          // Create hero_asset only when we have an image (skip for abstract/minimal CSS)
          if (heroImageUrl) {
            const { data: heroAsset } = await supabase
              .from('hero_assets')
              .insert({
                event_id: data.id,
                image_url: heroImageUrl,
                provider: heroProvider,
                provider_asset_id: heroAssetId,
              })
              .select('id')
              .single();
            if (heroAsset) {
              await supabase.from('events').update({ hero_asset_id: heroAsset.id }).eq('id', data.id);
            }
          }
          // Record affiliate conversion if tagged
          const affiliate = request.headers.get('cookie')?.match(/affiliate=([^;]+)/)?.[1];
          if (affiliate && hasSupabase()) {
            try {
              const { createServiceClient } = await import('@/lib/supabase');
              const sb = createServiceClient();
              await sb.rpc('increment_conversion', { refcode: affiliate });
            } catch (e) {
              console.warn('Affiliate conversion tracking failed:', e);
            }
          }
          const eventWithStyle = {
            ...data,
            hero_style: fullEvent.hero_style,
            hero_image_url: (data as Record<string, unknown>).hero_image_url ?? heroImageUrl,
          };
          return NextResponse.json({ success: true, event: eventWithStyle, persisted: true });
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
