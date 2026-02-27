'use client';

import { useState } from 'react';
import Link from 'next/link';

const THREADS = [
  { id: 1, title: 'How do I add custom branding to my event?', category: 'Getting Started', author: 'sarah_m', replies: 12, upvotes: 24, slug: 'custom-branding' },
  { id: 2, title: 'Feature request: Multi-day events with different venues', category: 'Feature Requests', author: 'marcus_k', replies: 8, upvotes: 41, slug: 'multi-day-venues' },
  { id: 3, title: 'We ran a 500-person summit with Launchpad — AMA', category: 'Show & Tell', author: 'priya_dev', replies: 34, upvotes: 89, slug: '500-person-summit' },
  { id: 4, title: 'Stripe webhook not firing after payment', category: 'Bug Reports', author: 'james_w', replies: 5, upvotes: 3, slug: 'stripe-webhook' },
  { id: 5, title: 'Best practices for speaker curation', category: 'Getting Started', author: 'ana_c', replies: 18, upvotes: 56, slug: 'speaker-curation' },
  { id: 6, title: 'Integrate with our CRM (Salesforce)', category: 'Feature Requests', author: 'tech_lead', replies: 6, upvotes: 22, slug: 'salesforce-integration' },
  { id: 7, title: 'Launchpad saved us 3 months of planning', category: 'Show & Tell', author: 'startup_founder', replies: 22, upvotes: 112, slug: '3-months-saved' },
  { id: 8, title: 'QR check-in not working on iOS', category: 'Bug Reports', author: 'mobile_dev', replies: 4, upvotes: 7, slug: 'qr-ios' },
  { id: 9, title: 'First event in 60 seconds — here\'s what we learned', category: 'Show & Tell', author: 'event_newbie', replies: 15, upvotes: 67, slug: 'first-event' },
  { id: 10, title: 'API rate limits?', category: 'Getting Started', author: 'api_user', replies: 3, upvotes: 11, slug: 'api-rate-limits' },
  { id: 11, title: 'White-label / remove Launchpad branding', category: 'Feature Requests', author: 'agency_owner', replies: 11, upvotes: 38, slug: 'white-label' },
  { id: 12, title: 'Export attendee list to CSV', category: 'Feature Requests', author: 'data_analyst', replies: 2, upvotes: 19, slug: 'csv-export' },
];

const CATEGORIES = ['All', 'Getting Started', 'Feature Requests', 'Show & Tell', 'Bug Reports'];
const TOP_CONTRIBUTORS = [
  { name: 'priya_dev', posts: 12, role: 'Power User' },
  { name: 'sarah_m', posts: 8, role: 'Community Lead' },
  { name: 'marcus_k', posts: 6, role: 'Event Pro' },
];

export default function CommunityPage() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = THREADS.filter((t) => {
    const matchCat = category === 'All' || t.category === category;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Community</h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Connect with other event planners. Ask questions, share wins, request features.
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <input
            type="search"
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-transparent border"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text)' }}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: category === c ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                  color: category === c ? 'var(--color-bg)' : 'var(--color-text-muted)',
                  border: category === c ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {filtered.map((t) => (
              <div key={t.id} className="p-6 rounded-xl flex gap-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <button className="text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>▲</button>
                  <span className="text-sm font-mono">{t.upvotes}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/community/${t.slug}`} className="font-semibold hover:text-[var(--color-accent)] transition-colors block mb-1">
                    {t.title}
                  </Link>
                  <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{t.category}</span>
                    <span>by {t.author}</span>
                    <span>{t.replies} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-3">
                {TOP_CONTRIBUTORS.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.role}</div>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-accent)' }}>{c.posts} posts</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/contact" className="block p-4 rounded-xl text-center font-semibold" style={{ background: 'rgba(79,255,223,0.1)', border: '1px solid rgba(79,255,223,0.3)', color: 'var(--color-accent)' }}>
              Start a thread →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
