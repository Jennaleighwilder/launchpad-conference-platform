'use client';

import Link from 'next/link';

const INTEGRATIONS = [
  { name: 'Slack', desc: 'Event notifications & reminders', status: 'LIVE', category: 'Communication' },
  { name: 'Google Calendar', desc: 'Sync events & sessions', status: 'LIVE', category: 'Calendar' },
  { name: 'Stripe', desc: 'Payment processing', status: 'LIVE', category: 'Payments' },
  { name: 'PayPal', desc: 'Alternative payments', status: 'LIVE', category: 'Payments' },
  { name: 'Zoom', desc: 'Virtual sessions & webinars', status: 'LIVE', category: 'Video' },
  { name: 'YouTube', desc: 'Live streaming', status: 'LIVE', category: 'Video' },
  { name: 'Vimeo', desc: 'Video hosting & replay', status: 'LIVE', category: 'Video' },
  { name: 'Twitch', desc: 'Live streaming', status: 'BETA', category: 'Video' },
  { name: 'HubSpot', desc: 'CRM & lead capture', status: 'LIVE', category: 'CRM' },
  { name: 'Salesforce', desc: 'Enterprise CRM', status: 'ENTERPRISE', category: 'CRM' },
  { name: 'Mailchimp', desc: 'Email campaigns', status: 'LIVE', category: 'Marketing' },
  { name: 'Zapier', desc: 'Connect 5,000+ apps', status: 'LIVE', category: 'Automation' },
  { name: 'Canva', desc: 'Design assets', status: 'BETA', category: 'Design' },
  { name: 'Okta', desc: 'SSO & identity', status: 'ENTERPRISE', category: 'Security' },
  { name: 'Supabase', desc: 'Database & auth', status: 'LIVE', category: 'Backend' },
  { name: 'Google Meet', desc: 'Video meetings', status: 'LIVE', category: 'Video' },
  { name: 'Microsoft Teams', desc: 'Collaboration', status: 'ENTERPRISE', category: 'Communication' },
  { name: 'Eventbrite', desc: 'Import/export events', status: 'BETA', category: 'Events' },
  { name: 'Airtable', desc: 'Data & spreadsheets', status: 'LIVE', category: 'Data' },
  { name: 'Figma', desc: 'Design collaboration', status: 'BETA', category: 'Design' },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    LIVE: { bg: 'rgba(79,255,223,0.2)', color: 'var(--color-accent)' },
    BETA: { bg: 'rgba(251,191,36,0.2)', color: '#FBBF24' },
    ENTERPRISE: { bg: 'rgba(167,139,250,0.2)', color: '#A78BFA' },
  };
  const s = styles[status] || styles.LIVE;
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{status}</span>
  );
}

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/features" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Features</Link>
          <Link href="/integrations" className="text-sm text-[var(--color-accent)]" style={{ fontWeight: 500 }}>Integrations</Link>
          <Link href="/speakers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Speakers</Link>
          <Link href="/e/demo-conference" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Demo</Link>
          <Link href="/sponsor" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Sponsor</Link>
          <Link href="/pricing" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Pricing</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>Integrations</div>
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Connect your favorite tools</h1>
          <p className="text-xl mb-16" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '42rem' }}>
            20+ integrations for payments, video, CRM, marketing, and more. Plus a full API for custom builds.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {INTEGRATIONS.map((i) => (
              <div key={i.name} className="rounded-xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">{i.name}</h3>
                  <StatusBadge status={i.status} />
                </div>
                <p className="text-sm flex-1" style={{ color: 'var(--color-text-muted)' }}>{i.desc}</p>
                <span className="text-xs mt-2" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>{i.category}</span>
              </div>
            ))}
          </div>

          {/* API section */}
          <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>API Access</h2>
            <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Pro and Enterprise plans include full API access. Build custom integrations or connect your own tools.
            </p>
            <pre className="rounded-lg p-6 text-sm overflow-x-auto" style={{ background: '#0d1117', color: '#c9d1d9', fontFamily: 'var(--font-mono)' }}>
{`// Create event via API
const res = await fetch('https://api.launchpad.events/v1/events', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'AI & Machine Learning',
    city: 'San Francisco',
    date: '2026-06-15',
    capacity: 500,
  }),
});
const { slug, url } = await res.json();`}
            </pre>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/create" className="btn-primary">Start with Launchpad →</Link>
            <Link href="/features" className="btn-secondary">View all features →</Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
