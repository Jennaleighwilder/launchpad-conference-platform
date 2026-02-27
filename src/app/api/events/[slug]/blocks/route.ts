import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BLOCK_TYPES = ['text', 'image', 'video', 'gallery', 'cta'] as const;

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || !UUID_REGEX.test(slug)) {
      return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
    }

    if (!hasSupabase()) {
      return NextResponse.json({ blocks: [] });
    }

    const supabase = createServiceClient();
    const { data: event } = await supabase.from('events').select('id').eq('id', slug).single();
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const { data: blocks, error } = await supabase
      .from('event_blocks')
      .select('*')
      .eq('event_id', slug)
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blocks: blocks || [] });
  } catch (err) {
    console.error('Blocks GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch blocks' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || !UUID_REGEX.test(slug)) {
      return NextResponse.json({ error: 'Invalid event id' }, { status: 400 });
    }

    if (!hasSupabase()) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { type, data, sort_order } = body;

    if (!type || !BLOCK_TYPES.includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${BLOCK_TYPES.join(', ')}` }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: event } = await supabase.from('events').select('id').eq('id', slug).single();
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const order = typeof sort_order === 'number' ? sort_order : 0;

    const { data: block, error } = await supabase
      .from('event_blocks')
      .insert({ event_id: slug, type, data: data || {}, sort_order: order })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ block });
  } catch (err) {
    console.error('Blocks POST error:', err);
    return NextResponse.json({ error: 'Failed to create block' }, { status: 500 });
  }
}
