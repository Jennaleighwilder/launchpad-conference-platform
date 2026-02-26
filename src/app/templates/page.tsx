'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TEMPLATES = [
  { slug: 'tech-summit', name: 'Tech Summit', category: 'Conference', attendees: '500-2000', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', desc: 'Multi-track tech conference with keynotes, workshops, and networking.' },
  { slug: 'startup-pitch', name: 'Startup Pitch Night', category: 'Networking', attendees: '50-200', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop', desc: 'Pitch competition with judges, investors, and demos.' },
  { slug: 'devcon', name: 'DevCon / Hackathon', category: 'Technical', attendees: '200-1000', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop', desc: 'Developer-focused with hands-on workshops and coding challenges.' },
  { slug: 'corporate-retreat', name: 'Corporate Retreat', category: 'Corporate', attendees: '50-300', img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&h=400&fit=crop', desc: 'Team offsite with sessions, activities, and bonding.' },
  { slug: 'product-launch', name: 'Product Launch', category: 'Marketing', attendees: '100-500', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop', desc: 'Launch event with demos, press, and customer sessions.' },
  { slug: 'academic-symposium', name: 'Academic Symposium', category: 'Education', attendees: '100-500', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop', desc: 'Research presentations, panels, and poster sessions.' },
  { slug: 'investor-day', name: 'Investor Day', category: 'Finance', attendees: '50-150', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop', desc: 'Company updates, roadmaps, and Q&A with investors.' },
  { slug: 'community-meetup', name: 'Community Meetup', category: 'Community', attendees: '20-100', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop', desc: 'Casual meetup with talks, demos, and networking.' },
  { slug: 'webinar', name: 'Virtual Webinar', category: 'Online', attendees: '100-5000', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop', desc: 'Online event with livestream, Q&A, and recordings.' },
];

const CATEGORIES = ['All', 'Conference', 'Networking', 'Technical', 'Corporate', 'Marketing', 'Education', 'Finance', 'Community', 'Online'];

export default function TemplatesPage() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);

  const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Event Templates</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Pre-built conference templates. Launch in one click.
        </p>

        <div className="flex flex-wrap gap-2 mb-12">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <div
              key={t.slug}
              onClick={() => setSelected(t)}
              className="rounded-xl overflow-hidden cursor-pointer group"
              style={{ border: '1px solid rgba(255,255,255,0.08)', background: selected?.slug === t.slug ? 'rgba(79,255,223,0.08)' : 'rgba(255,255,255,0.02)' }}
            >
              <div className="aspect-video relative overflow-hidden">
                <Image src={t.img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <span className="px-4 py-2 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>Use Template</span>
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{t.category}</span>
                <h3 className="font-semibold mt-2">{t.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t.attendees} attendees</p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-12 p-8 rounded-2xl flex flex-col md:flex-row gap-8" style={{ background: 'rgba(79,255,223,0.05)', border: '1px solid rgba(79,255,223,0.2)' }}>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
              <p className="mb-4" style={{ color: 'var(--color-text-muted)' }}>{selected.desc}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Typical size: {selected.attendees} attendees</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/create?template=${selected.slug}`} className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>
                Launch with this template
              </Link>
              <button onClick={() => setSelected(null)} className="px-6 py-3 rounded-lg font-semibold" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
