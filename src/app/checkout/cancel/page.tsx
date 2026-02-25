'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CancelContent() {
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('event');

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: 'rgba(255, 107, 53, 0.15)', border: '2px solid var(--color-warm)' }}>
          <svg className="w-10 h-10" style={{ color: 'var(--color-warm)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Payment Cancelled
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          No charges were made. You can try again whenever you&apos;re ready.
        </p>
        {eventSlug ? (
          <Link
            href={`/e/${eventSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: '#4FFFDF', color: '#0A0A0A' }}
          >
            Try Again →
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{ background: '#4FFFDF', color: '#0A0A0A' }}
          >
            Back to Launchpad
          </Link>
        )}
      </div>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </main>
    }>
      <CancelContent />
    </Suspense>
  );
}
