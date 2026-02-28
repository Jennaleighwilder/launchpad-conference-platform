import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** Create a Stripe Connect Express account for an organizer */
export async function createConnectAccount(email: string, userId: string) {
  const stripe = getStripe();

  const account = await stripe.accounts.create({
    type: 'express',
    email,
    metadata: { launchpad_user_id: userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app';

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${appUrl}/dashboard?stripe=refresh`,
    return_url: `${appUrl}/dashboard?stripe=connected`,
    type: 'account_onboarding',
  });

  return { accountId: account.id, onboardingUrl: accountLink.url };
}

/** Check if a Connect account is fully onboarded */
export async function getConnectAccountStatus(accountId: string) {
  const stripe = getStripe();
  const account = await stripe.accounts.retrieve(accountId);
  return {
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
    details_submitted: account.details_submitted,
  };
}

/** Create a checkout session that pays the organizer (with 5% platform fee) */
export async function createConnectCheckout({
  connectedAccountId,
  eventSlug,
  eventName,
  ticketType,
  priceInCents,
  currency,
  customerEmail,
  customerName,
}: {
  connectedAccountId: string;
  eventSlug: string;
  eventName: string;
  ticketType: string;
  priceInCents: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app';

  const platformFeePercent = 5;
  const platformFee = Math.round(priceInCents * (platformFeePercent / 100));
  const tierLabel = ticketType === 'vip' ? 'VIP' : ticketType === 'early_bird' ? 'Early Bird' : 'Regular';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: customerEmail || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          unit_amount: priceInCents,
          product_data: {
            name: `${tierLabel} Ticket — ${eventName}`,
          },
        },
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: connectedAccountId,
      },
    },
    metadata: {
      event_slug: eventSlug,
      ticket_type: ticketType,
      customer_name: customerName || '',
    },
    success_url: `${appUrl}/checkout/success?slug=${eventSlug}&tier=${ticketType}&name=${encodeURIComponent(customerName || '')}&email=${encodeURIComponent(customerEmail || '')}`,
    cancel_url: `${appUrl}/e/${eventSlug}`,
  });

  return { url: session.url };
}
