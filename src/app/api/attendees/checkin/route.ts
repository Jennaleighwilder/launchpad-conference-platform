import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const attendeeId = searchParams.get('attendee_id');
  if (!attendeeId) return NextResponse.json({ error: 'Missing attendee_id' }, { status: 400 });

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('attendees')
    .update({ checkin_status: 'checked_in', checked_in_at: new Date().toISOString() })
    .eq('id', attendeeId)
    .select('id, checkin_status, checked_in_at')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, attendee: data });
}
