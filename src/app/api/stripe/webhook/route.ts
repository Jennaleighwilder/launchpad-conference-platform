import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';
import { sendTicketConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY || !sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing webhook configuration' }, { status: 400 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  // Only handle what we need
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const metadata = session.metadata || {};
  const eventId = metadata.event_id as string | undefined;
  const eventSlug = metadata.event_slug as string | undefined;
  const ticketType = (metadata.ticket_type as string) || 'regular';
  const buyerName = (metadata.buyer_name as string) || '';
  const buyerEmail = session.customer_email ?? session.customer_details?.email;

  if (!eventId || !buyerEmail) {
    return NextResponse.json({ error: 'Missing eventId or buyerEmail' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Idempotent upsert: unique(event_id,email)
  const { data: attendee, error: attErr } = await supabase
    .from('attendees')
    .upsert(
      {
        event_id: eventId,
        email: buyerEmail,
        name: buyerName,
        ticket_type: ticketType,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent ? (typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent.id) : null,
        payment_status: 'paid',
      },
      { onConflict: 'event_id,email' }
    )
    .select('id,event_id,email,name,ticket_type,payment_status')
    .maybeSingle();

  if (attErr) {
    return NextResponse.json({ error: attErr.message }, { status: 500 });
  }

  // Load event details for the email
  const { data: ev } = await supabase
    .from('events')
    .select('name, slug, date, venue')
    .eq('id', eventId)
    .maybeSingle();

  const eventData = ev as { name?: string; slug?: string } | null;

  // Send email (server-side only). This must be idempotent eventually; for now, keep it simple.
  try {
    await sendTicketConfirmationEmail({
      to: buyerEmail,
      eventName: eventData?.name || 'Your Event',
      eventUrl: `https://launchpad-conference-platform.vercel.app/e/${eventSlug || eventData?.slug || ''}`,
      ticketType,
    });
  } catch (e) {
    // Do not fail webhook; log and move on
    console.error('Email send failed:', e);
  }

  return NextResponse.json({ ok: true, attendee_id: attendee?.id });
}
