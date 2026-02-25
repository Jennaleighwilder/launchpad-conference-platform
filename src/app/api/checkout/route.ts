import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { tier, eventSlug, eventName, price } = await request.json();

    if (!tier || !eventSlug || !price) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const priceInCents = Math.round(parseFloat(price.replace(/[$,]/g, '')) * 100);
    const origin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const eventNameEncoded = encodeURIComponent(eventName || '');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${eventName} — ${tier.charAt(0).toUpperCase() + tier.slice(1)} Ticket`,
              description: `Access to ${eventName}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?event=${eventSlug}&tier=${tier}&name=${eventNameEncoded}`,
      cancel_url: `${origin}/checkout/cancel?event=${eventSlug}`,
      metadata: { event_slug: eventSlug, tier },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
