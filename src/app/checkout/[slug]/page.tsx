'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function CheckoutCountdown() {
  const [diff, setDiff] = useState({ d: 2, h: 12, m: 30, s: 0 });
  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    const tick = () => {
      const now = new Date();
      let ms = end.getTime() - now.getTime();
      if (ms < 0) ms = 0;
      setDiff({
        d: Math.floor(ms / 86400000),
        h: Math.floor((ms % 86400000) / 3600000),
        m: Math.floor((ms % 3600000) / 60000),
        s: Math.floor((ms % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid grid-cols-4 gap-4 text-center">
      <div>
        <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-accent)' }}>{diff.d}</div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>DAYS</div>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-accent)' }}>{diff.h}</div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>HOURS</div>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-accent)' }}>{diff.m}</div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>MIN</div>
      </div>
      <div>
        <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-accent)' }}>{diff.s}</div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>SEC</div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const tier = searchParams.get('tier') || 'regular';
  const priceStr = searchParams.get('price') || '$0';

  const [event, setEvent] = useState<{ name: string; date: string; city: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [stripeAvailable, setStripeAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${slug}`);
        const data = await res.json();
        if (data.event) {
          setEvent({ name: data.event.name, date: data.event.date, city: data.event.city });
        }
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  useEffect(() => {
    fetch('/api/checkout', { method: 'OPTIONS' }).then(() => {}).catch(() => {});
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventSlug: slug, ticketType: tier, checkOnly: true }),
    })
      .then((r) => r.json())
      .then((d) => setStripeAvailable(d.stripeAvailable === true))
      .catch(() => setStripeAvailable(false));
  }, [slug, tier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventSlug: slug,
        ticketType: tier,
        buyerName: form.name.trim(),
        buyerEmail: form.email.trim(),
      }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (r.status === 503 || !data.url) {
          const q = new URLSearchParams({ slug, tier, name: form.name.trim(), email: form.email.trim() });
          router.push(`/checkout/success?${q.toString()}`);
        } else if (data.url) {
          window.location.href = data.url;
        }
      })
      .catch(() => {
        const q = new URLSearchParams({ slug, tier, name: form.name.trim(), email: form.email.trim() });
        router.push(`/checkout/success?${q.toString()}`);
      })
      .finally(() => setSubmitting(false));
  };

  const tierLabel = tier === 'early_bird' ? 'Early Bird' : tier === 'vip' ? 'VIP' : 'Regular';
  const isDemo = stripeAvailable === false || stripeAvailable === null;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </main>
    );
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  const deadlineStr = deadline.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="py-3 px-6 text-center font-medium" style={{ background: 'var(--color-accent)', color: '#0A0A0A' }}>
        Price Increase Extended | Register by {deadlineStr}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/e/${slug}`} className="text-sm hover:text-[#4FFFDF] transition-colors" style={{ color: 'var(--color-text-muted)' }}>
            ← Back to event
          </Link>
          {isDemo && (
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
              Demo Mode — No real charges
            </span>
          )}
        </div>

        <div className="rounded-xl p-6 mb-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-lg font-semibold mb-4">Prices Increase Soon</h3>
          <CheckoutCountdown />
          <p className="text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
            Group Discount Codes: 3+ use BUY3 for 5%, 5+ use BUY5 for 10%, 10+ use BUY10 for 20% off
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Order summary</h2>
            <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>{event?.name || 'Event'}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                {event?.date ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : ''} · {event?.city || ''}
              </p>
              <div className="flex justify-between py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{tierLabel} Ticket</span>
                <span className="font-semibold" style={{ color: '#4FFFDF' }}>{priceStr}</span>
              </div>
              <div className="flex justify-between py-3 font-semibold" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span>Total</span>
                <span style={{ color: '#4FFFDF' }}>{priceStr}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>Attendee details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Full name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="jane@company.com"
                  className="w-full px-4 py-3 rounded-lg bg-transparent border"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-70"
                style={{ background: '#4FFFDF', color: '#0A0A0A' }}
              >
                {submitting ? 'Processing...' : stripeAvailable ? `Continue to Payment — ${priceStr}` : `Complete Purchase — ${priceStr}`}
              </button>
              <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                {stripeAvailable ? 'You\'ll be redirected to Stripe for secure payment.' : 'Demo mode: no real charges. Card data never touches our servers.'}
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
