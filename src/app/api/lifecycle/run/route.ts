/**
 * Lifecycle engine endpoint — used by Vercel cron.
 * GET: runs the engine, returns JSON summary.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runLifecycleEngine } from '@/lib/lifecycle/engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const provided = authHeader?.replace(/^Bearer\s+/i, '').trim();

  if (!cronSecret || provided !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runLifecycleEngine();
    return NextResponse.json({
      ok: true,
      processed: result.processed,
      transitions: result.transitions,
    });
  } catch (error) {
    console.error('[lifecycle] Engine error:', error);
    return NextResponse.json(
      { error: 'Lifecycle engine failed', details: String(error) },
      { status: 500 }
    );
  }
}
