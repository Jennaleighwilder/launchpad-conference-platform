import Link from 'next/link';
import Image from 'next/image';

const SHOWCASE = [
  { slug: 'ai-summit-2026', name: 'AI Summit 2026', org: 'TechForge', attendees: 2500, revenue: '$1.2M', satisfaction: '4.9/5', quote: 'Launchpad cut our planning from 6 months to 2 weeks.', author: 'Sarah Chen', role: 'CTO', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop' },
  { slug: 'cybernova', name: 'CyberNova', org: 'SecureScale', attendees: 600, revenue: '$180K', satisfaction: '4.8/5', quote: 'The swarm AI generated a complete conference in under 30 seconds. Mind-blown.', author: 'Marcus Berg', role: 'Event Director', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=500&fit=crop' },
  { slug: 'startup-zaken', name: 'Startup Zaken', org: 'ScaleUp.io', attendees: 400, revenue: '$95K', satisfaction: '4.7/5', quote: 'We run 12 events a year. Launchpad is our secret weapon.', author: 'Priya Sharma', role: 'Community Lead', img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=500&fit=crop' },
  { slug: 'the-future-forum', name: 'The Future Forum', org: 'Youth Leadership', attendees: 800, revenue: '$120K', satisfaction: '4.9/5', quote: 'First-time organizers. We had a production-ready event in an hour.', author: 'James Wright', role: 'Founder', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop' },
  { slug: 'an-evening-with', name: 'An Evening With', org: 'Keynote Series', attendees: 300, revenue: '$75K', satisfaction: '5.0/5', quote: 'Intimate format, big impact. Launchpad made it effortless.', author: 'Ana Costa', role: 'Producer', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop' },
  { slug: 'demo-conference', name: 'SuperNova AI Summit', org: 'Launchpad', attendees: 2500, revenue: '$1.1M', satisfaction: '4.8/5', quote: 'Our flagship demo. Built in 60 seconds, scaled to thousands.', author: 'Launchpad Team', role: 'Product', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop' },
];

export default function ShowcasePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Events Powered by Launchpad</h1>
        <p className="mb-12" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem' }}>
          Real events. Real results. See what our customers are building.
        </p>

        <div className="space-y-16">
          {SHOWCASE.map((e, i) => (
            <div key={e.slug} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
              <div className="flex-1 w-full">
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Image src={e.img} alt="" width={800} height={500} className="w-full h-64 md:h-80 object-cover" />
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{e.org}</span>
                <h2 className="text-2xl font-bold mt-2 mb-4" style={{ fontFamily: 'var(--font-display)' }}>{e.name}</h2>
                <div className="flex flex-wrap gap-4 mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{e.attendees.toLocaleString()} attendees</span>
                  <span>{e.revenue} revenue</span>
                  <span>{e.satisfaction} rating</span>
                </div>
                <blockquote className="mb-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid var(--color-accent)' }}>
                  &ldquo;{e.quote}&rdquo;
                </blockquote>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>— {e.author}, {e.role}</p>
                <Link href={`/e/${e.slug}`} className="inline-block mt-4 text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
                  View event →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
