import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const attendeeId = searchParams.get('attendee_id');
  if (!attendeeId) return NextResponse.json({ error: 'Missing attendee_id' }, { status: 400 });

  // QR points to check-in URL (server will mark checked-in)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app';
  const checkinUrl = `${appUrl}/api/attendees/checkin?attendee_id=${encodeURIComponent(attendeeId)}`;

  const dataUrl = await QRCode.toDataURL(checkinUrl, { margin: 1, width: 512 });

  return NextResponse.json({ ok: true, dataUrl, checkinUrl });
}
