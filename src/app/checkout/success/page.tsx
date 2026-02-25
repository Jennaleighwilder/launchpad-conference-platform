'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('event');
  const eventName = searchParams.get('name') || 'Your Event';

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e' }}>
          <svg className="w-10 h-10" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Ticket Confirmed!
        </h1>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          You&apos;re all set for <strong style={{ color: 'var(--color-text)' }}>{eventName}</strong>
        </p>
        {eventSlug && (
          <Link
            href={`/e/${eventSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: '#4FFFDF', color: '#0A0A0A' }}
          >
            View Event →
          </Link>
        )}
        <p className="mt-8 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          A confirmation email has been sent to your inbox.
        </p>
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
