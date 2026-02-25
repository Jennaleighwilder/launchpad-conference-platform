'use client';

import { useState } from 'react';
import Link from 'next/link';

const FEATURE_TABS = [
  { id: 'ai', label: 'AI Generation', icon: '🤖' },
  { id: 'engagement', label: 'Live Engagement', icon: '💬' },
  { id: 'networking', label: 'Networking', icon: '🤝' },
  { id: 'registration', label: 'Registration', icon: '📋' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'agenda', label: 'Agenda', icon: '📅' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'hybrid', label: 'Hybrid / Virtual', icon: '📺' },
  { id: 'integrations', label: 'Integrations', icon: '🔌' },
  { id: 'sponsors', label: 'Sponsors', icon: '⭐' },
];

const FEATURES: Record<string, { title: string; items: string[] }> = {
  ai: {
    title: 'AI Swarm Generation',
    items: [
      '5 specialized AI agents run in parallel',
      'Speaker Agent researches and curates lineup',
      'Venue Agent matches event to perfect location',
      'Schedule Agent builds full timetable',
      'Pricing Agent sets optimal ticket tiers',
      'Branding Agent creates visual identity',
      'Complete event in under 60 seconds',
      'Fully editable AI output',
    ],
  },
  engagement: {
    title: 'Live Engagement',
    items: [
      'Live Q&A with upvoting',
      'Live polls during sessions',
      'Social wall / newsfeed',
      'Session ratings & feedback',
      'Gamification & leaderboards',
      'Push notifications',
      '1:1 in-app chat',
      'Meeting scheduler',
    ],
  },
  networking: {
    title: 'Attendee Networking',
    items: [
      'Swipe-based matchmaking',
      'Profile discovery',
      '1:1 meeting requests',
      'Networking recommendations',
      'Community groups',
      'Breakout room matching',
    ],
  },
  registration: {
    title: 'Registration & Tickets',
    items: [
      'QR code tickets',
      'Check-in scanning',
      'Multiple ticket tiers',
      'Promo codes & early-bird pricing',
      'Group discounts (BUY3, BUY5, BUY10)',
      'Stripe & PayPal integration',
      'Printable tickets',
      'Dietary preferences & accessibility',
    ],
  },
  marketing: {
    title: 'Marketing & Promotion',
    items: [
      'Email marketing automation',
      'Drip campaigns & reminders',
      'RSVP with auto-add to mailing list',
      'Scheduled social media posting',
      'SMS text campaigns',
      'A/B testing subject lines',
      'Contact segmentation',
      'Landing pages & signup forms',
    ],
  },
  agenda: {
    title: 'Agenda & Schedule',
    items: [
      'Personal agenda builder',
      'Session seat booking',
      'Workshop capacity management',
      'Multi-stage scheduling',
      'Speaker profiles & bios',
      'Track filtering',
      'Calendar export',
      'Session reminders',
    ],
  },
  analytics: {
    title: 'Analytics & Insights',
    items: [
      'Real-time attendance dashboard',
      'Check-in analytics',
      'Session popularity metrics',
      'Engagement scores',
      'Revenue tracking',
      'Budget management',
      'Export to CSV',
    ],
  },
  hybrid: {
    title: 'Hybrid & Virtual',
    items: [
      'YouTube streaming',
      'Vimeo integration',
      'Zoom embed',
      'Twitch support',
      'Virtual attendee chat',
      'Recording & replay',
    ],
  },
  integrations: {
    title: 'Integrations',
    items: [
      'Slack notifications',
      'Google Calendar sync',
      'HubSpot CRM',
      'Salesforce',
      'Mailchimp',
      'Zapier workflows',
      'Okta SSO',
      '20+ tools supported',
    ],
  },
  sponsors: {
    title: 'Sponsors & Partners',
    items: [
      'Sponsor tier management',
      'Logo placement',
      'Partner profiles',
      'Exhibitor booths',
      'Lead capture',
      'Sponsor analytics',
    ],
  },
};

const COMPETITOR_ROWS = [
  { feature: 'AI event generation', launchpad: true, boompop: false, constant: false, eventee: false },
  { feature: '60-second setup', launchpad: true, boompop: false, constant: false, eventee: false },
  { feature: 'Live Q&A & polls', launchpad: true, boompop: false, constant: false, eventee: true },
  { feature: 'Matchmaking networking', launchpad: true, boompop: false, constant: false, eventee: true },
  { feature: 'Email marketing', launchpad: true, boompop: false, constant: true, eventee: false },
  { feature: 'QR check-in', launchpad: true, boompop: false, constant: false, eventee: true },
  { feature: 'Personal agenda', launchpad: true, boompop: false, constant: false, eventee: true },
  { feature: 'Hybrid streaming', launchpad: true, boompop: false, constant: false, eventee: true },
  { feature: 'Budget tracking', launchpad: true, boompop: true, constant: false, eventee: false },
  { feature: '20+ integrations', launchpad: true, boompop: true, constant: true, eventee: false },
  { feature: 'Gamification', launchpad: true, boompop: false, constant: false, eventee: true },
  { feature: 'Event website builder', launchpad: true, boompop: true, constant: true, eventee: false },
  { feature: 'Vendor RFP automation', launchpad: false, boompop: true, constant: false, eventee: false },
  { feature: 'Native mobile app', launchpad: false, boompop: false, constant: false, eventee: true },
  { feature: '$0 starting price', launchpad: true, boompop: false, constant: false, eventee: false },
  { feature: 'White-label option', launchpad: true, boompop: false, constant: false, eventee: true },
];

function Check({ on }: { on: boolean }) {
  return <span style={{ color: on ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)' }}>{on ? '✓' : '—'}</span>;
}

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/features" className="text-sm text-[var(--color-accent)]" style={{ fontWeight: 500 }}>Features</Link>
          <Link href="/speakers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Speakers</Link>
          <Link href="/e/demo-conference" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Demo</Link>
          <Link href="/sponsor" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Sponsor</Link>
          <Link href="/pricing" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Pricing</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--color-accent)' }}>Platform Features</div>
          <h1 className="text-5xl md:text-6xl font-normal mb-6" style={{ fontFamily: 'var(--font-display)' }}>Everything you need to run world-class events</h1>
          <p className="text-xl mb-12" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '42rem' }}>
            60+ features across AI generation, live engagement, networking, marketing, and more. Built to beat BoomPop, Constant Contact, and Eventee.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {FEATURE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: activeTab === t.id ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                  color: activeTab === t.id ? 'var(--color-bg)' : 'var(--color-text-muted)',
                  border: activeTab === t.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Feature content */}
          <div className="rounded-2xl p-8 mb-20" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)' }}>{FEATURES[activeTab]?.title}</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {FEATURES[activeTab]?.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor comparison */}
          <div className="text-xs uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Competitor Comparison</div>
          <h2 className="text-3xl font-normal mb-8" style={{ fontFamily: 'var(--font-display)' }}>How we stack up</h2>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left py-4 px-6 font-medium">Feature</th>
                  <th className="py-4 px-6 font-medium text-center" style={{ color: 'var(--color-accent)' }}>Launchpad</th>
                  <th className="py-4 px-6 font-medium text-center" style={{ color: 'var(--color-text-muted)' }}>BoomPop</th>
                  <th className="py-4 px-6 font-medium text-center" style={{ color: 'var(--color-text-muted)' }}>Constant Contact</th>
                  <th className="py-4 px-6 font-medium text-center" style={{ color: 'var(--color-text-muted)' }}>Eventee</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_ROWS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < COMPETITOR_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <td className="py-3 px-6">{row.feature}</td>
                    <td className="py-3 px-6 text-center"><Check on={row.launchpad} /></td>
                    <td className="py-3 px-6 text-center"><Check on={row.boompop} /></td>
                    <td className="py-3 px-6 text-center"><Check on={row.constant} /></td>
                    <td className="py-3 px-6 text-center"><Check on={row.eventee} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Launchpad: 15/16 ✓ · BoomPop: 4/16 · Constant Contact: 4/16 · Eventee: 9/16
          </p>

          <div className="mt-16 flex flex-wrap gap-4">
            <Link href="/create" className="btn-primary">Start generating →</Link>
            <Link href="/integrations" className="btn-secondary">View integrations →</Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← Back to Launchpad</Link>
      </footer>
    </main>
  );
}
