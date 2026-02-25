'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';

function generateConfirmationNumber(seed: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash << 5) - hash + seed.charCodeAt(i);
  let out = 'TKT-';
  for (let i = 0; i < 8; i++) out += chars[Math.abs((hash + i * 7) % chars.length)];
  return out;
}

function QRGrid({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    const arr: boolean[] = [];
    let h = 0;
    for (let i = 0; i < 64; i++) h = (h * 31 + seed.charCodeAt(i % seed.length)) >>> 0;
    for (let i = 0; i < 64; i++) arr.push(((h + i * 17) & (1 << (i % 8))) !== 0);
    return arr;
  }, [seed]);

  return (
    <div className="grid grid-cols-8 gap-0.5 w-24 h-24 mx-auto" style={{ background: '#fff' }}>
      {cells.map((on, i) => (
        <div key={i} style={{ background: on ? '#0A0A0A' : '#fff' }} />
      ))}
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const tier = searchParams.get('tier') || 'regular';
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const plan = searchParams.get('plan');

  const [event, setEvent] = useState<{ name: string; date: string; city: string } | null>(null);
  const confNum = useMemo(() => generateConfirmationNumber(email + (slug || '') + tier), [email, slug, tier]);

  const isDemoFlow = !!(slug && name && email);
  const isProPlan = plan === 'pro';

  useEffect(() => {
    if (isDemoFlow || isProPlan) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  }, [isDemoFlow, isProPlan]);

  useEffect(() => {
    if (slug) {
      fetch(`/api/events/${slug}`)
        .then((r) => r.json())
        .then((d) => d.event && setEvent({ name: d.event.name, date: d.event.date, city: d.event.city }))
        .catch(() => {});
    }
  }, [slug]);

  const eventName = event?.name || 'Your Event';
  const eventDate = event?.date ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const tierLabel = tier === 'early_bird' ? 'Early Bird' : tier === 'vip' ? 'VIP' : 'Regular';

  const handleAddToCalendar = () => {
    if (!event?.name || !event?.date) return;
    const start = new Date(event.date + 'T09:00:00');
    const end = new Date(event.date + 'T18:00:00');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start.toISOString().replace(/[-:]/g, '').slice(0, 15)}`,
      `DTEND:${end.toISOString().replace(/[-:]/g, '').slice(0, 15)}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:${eventName} at ${event.city || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${event.name.replace(/[^a-z0-9]/gi, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-16" style={{ background: '#0A0A0A' }}>
      <div className="text-center max-w-lg mx-auto px-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e' }}>
          <svg className="w-10 h-10" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {isProPlan ? 'Pro Plan Activated! 🎉' : 'You\'re In! 🎉'}
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          {isProPlan ? 'Welcome to Launchpad Pro. You now have unlimited events, custom branding, and priority support.' : <>You&apos;re all set for <strong style={{ color: 'var(--color-text)' }}>{eventName}</strong></>}
        </p>

        {isDemoFlow && (
          <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: '#fff', color: '#0A0A0A' }}>
            <div className="text-xs uppercase tracking-wider mb-4" style={{ color: '#666' }}>Your ticket</div>
            <h3 className="text-xl font-semibold mb-1">{eventName}</h3>
            <p className="text-sm mb-4" style={{ color: '#666' }}>{eventDate} · {event?.city || ''}</p>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: '#666' }}>Tier</span>
              <span className="font-medium">{tierLabel}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: '#666' }}>Attendee</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: '#666' }}>Email</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: '#666' }}>Confirmation</span>
              <span className="font-mono font-medium">{confNum}</span>
            </div>
            <div className="flex justify-center py-4" style={{ borderTop: '1px solid #eee' }}>
              <QRGrid seed={confNum} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {isDemoFlow && (
            <>
              <button
                onClick={() => alert('PDF download coming soon')}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Download Ticket
              </button>
              <button
                onClick={handleAddToCalendar}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Add to Calendar
              </button>
            </>
          )}
          {slug && (
            <Link
              href={`/e/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
              style={{ background: '#4FFFDF', color: '#0A0A0A' }}
            >
              Back to Event →
            </Link>
          )}
          {isProPlan && (
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
              style={{ background: '#4FFFDF', color: '#0A0A0A' }}
            >
              Create Your First Event →
            </Link>
          )}
        </div>

        {!isDemoFlow && !isProPlan && (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            A confirmation email has been sent to your inbox.
          </p>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
