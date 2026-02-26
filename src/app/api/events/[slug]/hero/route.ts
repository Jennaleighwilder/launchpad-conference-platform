import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { randomUUID } from 'crypto';

const BUCKET = 'event-media';
const MAX_IMAGE_SIZE = 12 * 1024 * 1024; // 12MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const BLOCKED_TYPES = ['image/svg+xml']; // SVG can be script-y

// Simple in-memory rate limit: IP -> { count, resetAt }
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 min
const RATE_LIMIT_MAX = 10; // 10 uploads per min per IP

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function hasSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project.supabase.co'
  );
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const param = (await params).slug;
    if (!param) {
      return NextResponse.json({ error: 'Missing event identifier' }, { status: 400 });
    }

    if (!checkRateLimit(getClientIP(request))) {
      return NextResponse.json({ error: 'Too many uploads. Try again in a minute.' }, { status: 429 });
    }

    if (!hasSupabase()) {
      return NextResponse.json(
        { error: 'Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 503 }
      );
    }

    const supabase = createServiceClient();
    const isId = UUID_REGEX.test(param);
    const { data: eventRow, error: lookupErr } = await supabase
      .from('events')
      .select('id')
      .eq(isId ? 'id' : 'slug', param)
      .single();

    if (lookupErr || !eventRow) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventId = eventRow.id as string;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'image';

    if (!file || !file.size) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (BLOCKED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'SVG uploads are not allowed' }, { status: 400 });
    }

    const isVideo = type === 'video';
    const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max ${isVideo ? '100' : '12'}MB` },
        { status: 413 }
      );
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
    const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm'].includes(ext) ? ext : isVideo ? 'mp4' : 'jpg';
    const path = `${eventId}/${randomUUID()}-${Date.now()}.${safeExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
        return NextResponse.json(
          { error: 'Storage bucket "event-media" not found. Create it in Supabase Dashboard: Storage → New bucket → name: event-media, Public.' },
          { status: 503 }
        );
      }
      console.error('[hero upload]', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
    const publicUrl = urlData.publicUrl;

    const assetRow = isVideo
      ? { event_id: eventId, video_url: publicUrl, image_url: null, provider: 'upload' }
      : { event_id: eventId, image_url: publicUrl, video_url: null, provider: 'upload' };

    const { error: upsertErr } = await supabase
      .from('hero_assets')
      .upsert(assetRow, { onConflict: 'event_id' });

    if (upsertErr) {
      console.error('[hero_assets upsert]', upsertErr);
    }

    return NextResponse.json({
      url: publicUrl,
      type: isVideo ? 'video' : 'image',
      updated: true,
    });
  } catch (err) {
    console.error('Hero upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
