'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MockCheckoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const tier = searchParams.get('tier') || 'regular';
  const priceStr = searchParams.get('price') || '$0';

  const [event, setEvent] = useState<{ name: string; date: string; city: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' });

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

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const q = new URLSearchParams({
        slug,
        tier,
        name: form.name.trim(),
        email: form.email.trim(),
      });
      router.push(`/checkout/success?${q.toString()}`);
    }, 2000);
  };

  const tierLabel = tier === 'early_bird' ? 'Early Bird' : tier === 'vip' ? 'VIP' : 'Regular';

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/e/${slug}`} className="text-sm hover:text-[#4FFFDF] transition-colors" style={{ color: 'var(--color-text-muted)' }}>
            ← Back to event
          </Link>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
            🔒 Demo Mode — No real charges
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
          {/* Order summary */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Order summary
            </h2>
            <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {event?.name || 'Event'}
              </h3>
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

          {/* Payment form */}
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Attendee details
            </h2>
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
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Card number</label>
                <input
                  type="text"
                  value={form.card}
                  onChange={(e) => setForm((f) => ({ ...f, card: formatCard(e.target.value) }))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-lg bg-transparent border font-mono"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>Expiry</label>
                  <input
                    type="text"
                    value={form.expiry}
                    onChange={(e) => setForm((f) => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-lg bg-transparent border font-mono"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>CVV</label>
                  <input
                    type="text"
                    value={form.cvv}
                    onChange={(e) => setForm((f) => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-lg bg-transparent border font-mono"
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-70"
                style={{ background: '#4FFFDF', color: '#0A0A0A' }}
              >
                {submitting ? 'Processing...' : `Complete Purchase — ${priceStr}`}
              </button>
              <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                Secured with 256-bit encryption (demo simulation)
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
