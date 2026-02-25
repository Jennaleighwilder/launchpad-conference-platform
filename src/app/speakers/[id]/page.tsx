'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSpeakerById } from '@/data/speakers';
import { SPEAKERS } from '@/data/speakers';

const SESSION_TYPE_LABELS: Record<string, string> = {
  keynote: 'Keynote',
  talk: 'Talk',
  panel: 'Panel',
  workshop: 'Workshop',
  fireside: 'Fireside Chat',
};

export default function SpeakerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const speaker = getSpeakerById(id);

  if (!speaker) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <h1 className="text-2xl mb-4" style={{ fontFamily: 'var(--font-display)' }}>Speaker not found</h1>
          <Link href="/speakers" className="btn-primary">← All Speakers</Link>
        </div>
      </main>
    );
  }

  const otherSpeakers = SPEAKERS.filter((s) => s.id !== id).slice(0, 4);

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}>L</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Launchpad</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/speakers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>All Speakers</Link>
          <Link href="/e/demo-conference" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>Demo Event</Link>
          <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Create Event →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden aspect-[4/5] relative">
            <Image src={speaker.img} alt={speaker.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-normal mb-4" style={{ fontFamily: 'var(--font-display)' }}>{speaker.name}</h1>
            <p className="text-xl mb-2" style={{ color: 'var(--color-accent)' }}>{speaker.title}, {speaker.company}</p>
            <p className="text-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>{speaker.flag}</p>
            {/* Social links in hero */}
            <div className="flex flex-wrap gap-3">
              {speaker.socials.twitter && (
                <a href={speaker.socials.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="text-[#1DA1F2]">𝕏</span> Twitter ↗
                </a>
              )}
              {speaker.socials.linkedin && (
                <a href={speaker.socials.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="text-[#0A66C2]">in</span> LinkedIn ↗
                </a>
              )}
              {speaker.socials.website && (
                <a href={speaker.socials.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Website ↗
                </a>
              )}
              {speaker.socials.github && (
                <a href={speaker.socials.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  GitHub ↗
                </a>
              )}
              {speaker.socials.youtube && (
                <a href={speaker.socials.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  YouTube ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Bio</h2>
          <p className="mb-6" style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>{speaker.bio[0]}</p>
          <p style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>{speaker.bio[1]}</p>
        </div>
      </section>

      {/* Full Event Schedule — Demo Conference 2026 */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Demo Conference 2026 — Full Schedule</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>All sessions featuring {speaker.name} at Demo Conference 2026. Stages, times, and session types.</p>
          <div className="space-y-4">
            {speaker.schedule.map((s, i) => (
              <div key={i} className="rounded-xl p-5 flex flex-wrap gap-4 items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <span className="px-2 py-0.5 rounded" style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', fontSize: '0.75rem' }}>{SESSION_TYPE_LABELS[s.type] || s.type}</span>
                    <span>{s.stage}</span>
                    <span>Day {s.day}</span>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Talk Details */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Featured Talk</h2>
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-xl font-semibold mb-2">{speaker.talk.title}</h3>
            <div className="flex flex-wrap gap-4 mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              <span>{speaker.talk.track}</span>
              <span>{speaker.talk.time}</span>
            </div>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.7 }}>{speaker.talk.desc}</p>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Past Events</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Conferences and events where {speaker.name} has spoken.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {speaker.pastEvents.map((e, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-semibold">{e.name}</h3>
                <p className="text-sm mt-1" style={{ color: 'var(--color-accent)' }}>{e.role}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{e.year}{e.location ? ` · ${e.location}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Featured Articles</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Press coverage and articles featuring {speaker.name}.</p>
          <ul className="space-y-4">
            {speaker.articles.map((a, i) => (
              <li key={i}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl p-4 hover:border-[var(--color-accent)] transition-colors" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="font-semibold text-[var(--color-accent)] transition-colors">{a.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{a.outlet} · {a.date}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Awards */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Awards & Recognition</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Awards and recognition received by {speaker.name}.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {speaker.awards.map((a, i) => (
              <div key={i} className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-semibold">{a.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{a.org} · {a.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Connect</h2>
          <div className="flex flex-wrap gap-4">
            {speaker.socials.twitter && (
              <a href={speaker.socials.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Twitter ↗
              </a>
            )}
            {speaker.socials.linkedin && (
              <a href={speaker.socials.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                LinkedIn ↗
              </a>
            )}
            {speaker.socials.website && (
              <a href={speaker.socials.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Website ↗
              </a>
            )}
            {speaker.socials.github && (
              <a href={speaker.socials.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                GitHub ↗
              </a>
            )}
            {speaker.socials.youtube && (
              <a href={speaker.socials.youtube} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                YouTube ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* More Speakers */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>More Speakers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {otherSpeakers.map((s) => (
              <Link key={s.id} href={`/speakers/${s.id}`} className="group">
                <div className="rounded-xl overflow-hidden mb-4 aspect-[4/5] relative">
                  <Image src={s.img} alt={s.name} fill className="object-cover transition-transform group-hover:scale-105" />
                </div>
                <h3 className="font-semibold group-hover:text-[var(--color-accent)] transition-colors">{s.name}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{s.role}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/speakers" className="text-sm hover:text-[var(--color-accent)] transition-colors" style={{ color: 'var(--color-text-muted)' }}>← All Speakers</Link>
      </footer>
    </main>
  );
}
