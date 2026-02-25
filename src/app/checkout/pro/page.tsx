'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRO_FEATURES = [
  'Unlimited events',
  'Supabase persistence',
  'Custom branding',
  'Priority support',
  'Swarm mode',
  'Analytics dashboard',
  'API access',
  'OG social cards',
];

export default function ProCheckoutPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvv: '' });

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
        plan: 'pro',
        name: form.name.trim(),
        email: form.email.trim(),
      });
      router.push(`/checkout/success?${q.toString()}`);
    }, 2000);
  };

  return (
    <main className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/pricing" className="text-sm hover:text-[#4FFFDF] transition-colors" style={{ color: 'var(--color-text-muted)' }}>
            ← Back to pricing
          </Link>
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
            🔒 Demo Mode — No real charges
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Order summary
            </h2>
            <div className="rounded-xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Pro Plan
              </h3>
              <div className="text-2xl font-bold mb-6" style={{ color: '#4FFFDF' }}>$29/mo</div>
              <ul className="space-y-2 mb-6">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <span style={{ color: 'var(--color-accent)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between py-3 font-semibold" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span>Total</span>
                <span style={{ color: '#4FFFDF' }}>$29/mo</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Payment details
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
                {submitting ? 'Processing...' : 'Start Pro Plan — $29/mo'}
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
