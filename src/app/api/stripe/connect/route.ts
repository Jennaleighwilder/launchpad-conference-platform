import { NextResponse } from 'next/server';
import { createConnectAccount, getConnectAccountStatus, getStripe } from '@/lib/stripe';

/** POST: Create a new Connect account and start onboarding */
export async function POST(req: Request) {
  try {
    const { getServerUser } = await import('@/lib/auth');
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { createServiceClient } = await import('@/lib/supabase');
    const supabase = createServiceClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_connect_id')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_connect_id) {
      const stripe = getStripe();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app';
      const accountLink = await stripe.accountLinks.create({
        account: profile.stripe_connect_id,
        refresh_url: `${appUrl}/dashboard?stripe=refresh`,
        return_url: `${appUrl}/dashboard?stripe=connected`,
        type: 'account_onboarding',
      });
      return NextResponse.json({ onboardingUrl: accountLink.url, existing: true });
    }

    const { accountId, onboardingUrl } = await createConnectAccount(user.email!, user.id);

    await supabase.from('profiles').update({ stripe_connect_id: accountId }).eq('id', user.id);

    return NextResponse.json({ onboardingUrl, accountId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create Connect account';
    console.error('[stripe/connect]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** GET: Check Connect account status */
export async function GET(req: Request) {
  try {
    const { getServerUser } = await import('@/lib/auth');
    const user = await getServerUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { createServiceClient } = await import('@/lib/supabase');
    const supabase = createServiceClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_connect_id, stripe_onboarding_complete')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_connect_id) {
      return NextResponse.json({ connected: false });
    }

    const status = await getConnectAccountStatus(profile.stripe_connect_id);

    if (status.charges_enabled && !profile.stripe_onboarding_complete) {
      await supabase.from('profiles').update({ stripe_onboarding_complete: true }).eq('id', user.id);
    }

    return NextResponse.json({
      connected: true,
      accountId: profile.stripe_connect_id,
      ...status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to check status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
