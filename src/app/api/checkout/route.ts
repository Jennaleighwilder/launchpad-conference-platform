import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

async function getEventBySlug(slug: string): Promise<{ id: string; name: string; pricing: Record<string, unknown>; status: string; user_id?: string | null } | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createServiceClient } = await import('@/lib/supabase');
      const supabase = createServiceClient();
      const { data, error } = await supabase.from('events').select('id, name, pricing, status, user_id').eq('slug', slug).maybeSingle();
      if (!error && data) return data as { id: string; name: string; pricing: Record<string, unknown>; status: string; user_id?: string | null };
    } catch {
      // fall through
    }
  }
  const { memoryStore } = await import('@/app/api/events/generate/route');
  const mem = memoryStore.get(slug);
  if (mem) return { id: mem.id, name: mem.name, pricing: mem.pricing as unknown as Record<string, string>, status: mem.status };
  const DEMO_SLUGS: Record<string, { name: string; pricing: Record<string, string>; user_id?: null }> = {
    'demo-conference': { name: 'SuperNova AI Summit 2026', pricing: { early_bird: '€299', regular: '€499', vip: '€999', currency: 'EUR' } },
    'ai-summit-2026': { name: 'AI Summit 2026', pricing: { early_bird: '€299', regular: '€499', vip: '€999', currency: 'EUR' } },
    'the-future-forum': { name: 'The Future Forum', pricing: { early_bird: '€99', regular: '€149', vip: '€299', currency: 'EUR' } },
    'cybernova': { name: 'CyberNova', pricing: { early_bird: '€199', regular: '€299', vip: '€599', currency: 'EUR' } },
    'startup-zaken': { name: 'Startup Zaken', pricing: { early_bird: '€79', regular: '€129', vip: '€249', currency: 'EUR' } },
    'an-evening-with': { name: 'An Evening With', pricing: { early_bird: '€149', regular: '€199', vip: '€399', currency: 'EUR' } },
  };
  const demo = DEMO_SLUGS[slug];
  if (demo) return { id: 'demo', name: demo.name, pricing: demo.pricing, status: 'ticket_sales' };
  return null;
}

export async function POST(req: Request) {
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  const body = await req.json().catch(() => ({}));
  if (body?.checkOnly) {
    return NextResponse.json({ stripeAvailable: hasStripe });
  }

  if (!hasStripe) {
    return NextResponse.json({ error: 'Stripe not configured', stripeAvailable: false }, { status: 503 });
  }
  try {
    const stripe = getStripe();
    const { eventSlug, ticketType = 'regular', buyerEmail, buyerName } = body;

    if (!eventSlug || !buyerEmail) {
      return NextResponse.json({ error: 'Missing eventSlug or buyerEmail' }, { status: 400 });
    }

    const ev = await getEventBySlug(eventSlug);
    if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

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

    // Look up event owner's Connect account
    let connectedAccountId: string | null = null;
    try {
      const { createServiceClient } = await import('@/lib/supabase');
      const supabase = createServiceClient();
      const { data: eventRow } = await supabase.from('events').select('user_id').eq('slug', eventSlug).single();

      if (eventRow?.user_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_connect_id, stripe_onboarding_complete')
          .eq('id', eventRow.user_id)
          .single();

        if (profile?.stripe_connect_id && profile?.stripe_onboarding_complete) {
          connectedAccountId = profile.stripe_connect_id;
        }
      }
    } catch {
      /* no Connect account — use direct checkout */
    }

    if (connectedAccountId) {
      const { createConnectCheckout } = await import('@/lib/stripe');
      const result = await createConnectCheckout({
        connectedAccountId,
        eventSlug,
        eventName: ev.name,
        ticketType,
        priceInCents: amount,
        currency,
        customerEmail: buyerEmail,
        customerName: buyerName,
      });
      return NextResponse.json({ ok: true, url: result.url, stripe_available: true });
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
