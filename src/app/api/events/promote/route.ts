import { NextResponse } from 'next/server';
import { runPromoSwarm } from '@/lib/promo-bots';

export async function POST(req: Request) {
  try {
    const input = await req.json();
    if (!input.name || !input.topic) {
      return NextResponse.json({ error: 'Event name and topic required' }, { status: 400 });
    }
    const result = await runPromoSwarm(input);
    return NextResponse.json({ success: true, promo: result, timing: result.agentTimings, errors: result.errors });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Promotion generation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
