import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }
  try {
    const stripe = getStripe();
    const body = await req.json();
    const { eventSlug, ticketType = 'regular', buyerEmail, buyerName } = body;

    if (!eventSlug || !buyerEmail) {
      return NextResponse.json({ error: 'Missing eventSlug or buyerEmail' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: ev, error: evErr } = await supabase
      .from('events')
      .select('id, name, pricing, status')
      .eq('slug', eventSlug)
      .maybeSingle();

    if (evErr || !ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    // Only allow checkout once ticket_sales or live
    if (!['ticket_sales', 'live'].includes(ev.status)) {
      return NextResponse.json({ error: 'Ticket sales are not open yet' }, { status: 400 });
    }

    const pricing = (ev.pricing || {}) as Record<string, string>;
    const currency = ((pricing.currency as string) || 'USD').toLowerCase();

    // Map ticketType -> price string like "$399"
    const raw = pricing[ticketType] || pricing.regular;
    if (!raw) return NextResponse.json({ error: 'No price configured' }, { status: 400 });

    const numeric = String(raw).replace(/[^0-9.]/g, '');
    const amount = Math.round(parseFloat(numeric) * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: buyerEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: amount,
            product_data: {
              name: `${ev.name} — ${ticketType.toUpperCase()} Ticket`,
            },
          },
        },
      ],
      metadata: {
        event_id: ev.id,
        event_slug: eventSlug,
        ticket_type: ticketType,
        buyer_name: buyerName || '',
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
