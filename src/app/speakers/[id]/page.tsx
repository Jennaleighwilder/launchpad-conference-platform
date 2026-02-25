'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const SPEAKERS: Record<string, {
  name: string;
  title: string;
  company: string;
  role: string;
  flag: string;
  img: string;
  bio: [string, string];
  talk: { title: string; track: string; time: string; desc: string };
  panels: { title: string; time: string }[];
  twitter: string;
  linkedin: string;
}> = {
  'sarah-chen': {
    name: 'Sarah Chen',
    title: 'CTO',
    company: 'TechForge',
    role: 'CTO, TechForge',
    flag: '🇺🇸',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    bio: [
      'Sarah Chen is the Chief Technology Officer at TechForge, where she leads engineering teams building the next generation of AI-powered developer tools. With over 15 years of experience in software architecture and machine learning systems, she has been instrumental in scaling products used by millions of developers worldwide.',
      'Prior to TechForge, Sarah held senior engineering roles at Google and Stripe. She is a frequent speaker at tech conferences and an advocate for diversity in engineering. Sarah holds a PhD in Computer Science from MIT.',
    ],
    talk: { title: 'Building AI-First Products', track: 'AI & Machine Learning', time: 'Day 1, 09:00', desc: 'Learn how to design and ship products that put AI at the center of the user experience. Sarah shares lessons from building tools used by 2M+ developers, including strategies for handling edge cases, maintaining quality at scale, and creating delightful AI interactions.' },
    panels: [{ title: 'The Future of Developer Tools', time: 'Day 1, 14:30' }, { title: 'Women in Tech Leadership', time: 'Day 2, 11:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'marcus-berg': {
    name: 'Marcus Berg',
    title: 'CEO',
    company: 'EventScale',
    role: 'CEO, EventScale',
    flag: '🇩🇪',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop',
    bio: [
      'Marcus Berg is the founder and CEO of EventScale, a platform that has helped organize over 10,000 events across 50 countries. His passion for bringing people together through technology has made him a leading voice in the events industry.',
      'Before EventScale, Marcus worked in product at Eventbrite and led growth at a Series B SaaS company. He is a Y Combinator alumnus and has been featured in TechCrunch, Forbes, and The Economist for his work in event technology.',
    ],
    talk: { title: 'Scaling Events to 10K Attendees', track: 'Startup Growth', time: 'Day 1, 10:30', desc: 'From 100 to 10,000 attendees: Marcus walks through the operational, technical, and community challenges of scaling events. Discover the playbook EventScale uses to help organizers grow without losing the magic of intimate gatherings.' },
    panels: [{ title: 'Event Tech Trends 2026', time: 'Day 1, 16:00' }, { title: 'Founder Stories: Building in Events', time: 'Day 2, 09:30' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'priya-sharma': {
    name: 'Priya Sharma',
    title: 'VP Engineering',
    company: 'CloudNova',
    role: 'VP Engineering, CloudNova',
    flag: '🇮🇳',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
    bio: [
      'Priya Sharma leads engineering at CloudNova, where she oversees the infrastructure powering enterprise ML workloads for Fortune 500 companies. She has built distributed systems handling billions of API requests per day.',
      'With a background in distributed computing and a passion for developer experience, Priya has spoken at AWS re:Invent, KubeCon, and numerous engineering conferences. She is an active open-source contributor and mentor.',
    ],
    talk: { title: 'Enterprise ML Infrastructure', track: 'Enterprise Innovation', time: 'Day 1, 12:00', desc: 'What does it take to run ML at enterprise scale? Priya shares the architecture, tooling, and processes CloudNova uses to serve model inference for hundreds of customers. Topics include GPU orchestration, model versioning, and cost optimization.' },
    panels: [{ title: 'Cloud-Native ML', time: 'Day 1, 15:00' }, { title: 'Engineering Leadership Roundtable', time: 'Day 2, 10:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'james-wright': {
    name: 'James Wright',
    title: 'Founder',
    company: 'LaunchLab',
    role: 'Founder, LaunchLab',
    flag: '🇬🇧',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    bio: [
      'James Wright is the founder of LaunchLab, an accelerator that has helped over 200 startups raise $500M+ in funding. His hands-on approach to early-stage investing has made him a sought-after advisor for technical founders.',
      'A former engineer at Stripe and early employee at a unicorn fintech, James brings a product-first perspective to venture. He is a regular contributor to Y Combinator\'s Startup School and hosts the popular "Build in Public" podcast.',
    ],
    talk: { title: 'From Zero to Series A', track: 'Startup Growth', time: 'Day 1, 14:00', desc: 'James breaks down the playbook for going from idea to Series A. Learn what investors actually look for, how to tell your story, and the metrics that matter. Includes real examples from LaunchLab portfolio companies.' },
    panels: [{ title: 'Pitching to Technical VCs', time: 'Day 1, 17:00' }, { title: 'Founder Mental Health', time: 'Day 2, 14:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'ana-costa': {
    name: 'Ana Costa',
    title: 'Director of AI',
    company: 'FutureConf',
    role: 'Director of AI, FutureConf',
    flag: '🇧🇷',
    img: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
    bio: [
      'Ana Costa leads AI strategy at FutureConf, where she has pioneered the use of generative AI in event planning and content creation. Her work has reduced event production time by 60% while improving attendee satisfaction.',
      'Ana holds a Master\'s in Machine Learning from Stanford and has published research on NLP and recommendation systems. She is passionate about responsible AI and ensuring technology serves diverse, global audiences.',
    ],
    talk: { title: 'Responsible AI in Production', track: 'AI & Machine Learning', time: 'Day 2, 09:00', desc: 'Deploying AI responsibly is non-negotiable. Ana shares frameworks for bias detection, transparency, and human-in-the-loop design. Learn how FutureConf balances innovation with ethical considerations in every AI feature they ship.' },
    panels: [{ title: 'AI Ethics in Practice', time: 'Day 1, 13:00' }, { title: 'Generative AI for Events', time: 'Day 2, 11:30' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'david-kim': {
    name: 'David Kim',
    title: 'Head of Growth',
    company: 'ScaleUp',
    role: 'Head of Growth, ScaleUp',
    flag: '🇺🇸',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
    bio: [
      'David Kim leads growth at ScaleUp, a B2B SaaS company that has grown from 0 to $20M ARR in three years. His data-driven approach to growth loops and experimentation has become a case study for scaling startups.',
      'Previously, David ran growth at two YC companies and has advised dozens of startups on go-to-market strategy. He writes the popular "Growth Weekly" newsletter and is known for his pragmatic, no-BS approach to growth.',
    ],
    talk: { title: 'Growth Loops That Work', track: 'Startup Growth', time: 'Day 2, 10:30', desc: 'Not all growth loops are created equal. David shares the frameworks and metrics that separate sustainable growth from vanity metrics. Real examples from ScaleUp\'s journey, including what failed and what 10x\'d their pipeline.' },
    panels: [{ title: 'B2B Growth Playbooks', time: 'Day 1, 11:00' }, { title: 'Product-Led Growth Deep Dive', time: 'Day 2, 15:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'elena-vasquez': {
    name: 'Elena Vasquez',
    title: 'Chief Product Officer',
    company: 'DataPulse',
    role: 'Chief Product Officer, DataPulse',
    flag: '🇪🇸',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    bio: [
      'Elena Vasquez is CPO at DataPulse, where she has led the product vision for a platform used by 5,000+ data teams. Her focus on developer experience and observability has made DataPulse a leader in the data infrastructure space.',
      'With experience at Datadog, Snowflake, and early-stage startups, Elena brings a unique perspective on building products for technical users. She is a strong advocate for inclusive product development.',
    ],
    talk: { title: 'Product Strategy for Technical Products', track: 'Enterprise Innovation', time: 'Day 2, 12:00', desc: 'Building products for developers and data engineers requires a different playbook. Elena shares how to balance power-user needs with accessibility, prioritize ruthlessly, and build products that developers actually love.' },
    panels: [{ title: 'The Future of Data Platforms', time: 'Day 1, 14:00' }, { title: 'Product Leadership', time: 'Day 2, 16:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'thomas-muller': {
    name: 'Thomas Muller',
    title: 'VP Engineering',
    company: 'Innovate Corp',
    role: 'VP Engineering, Innovate Corp',
    flag: '🇩🇪',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop',
    bio: [
      'Thomas Muller leads engineering at Innovate Corp, a 2,000-person company undergoing a digital transformation. He has overseen the migration of legacy systems to cloud-native architecture while maintaining 99.99% uptime.',
      'A 20-year veteran of enterprise software, Thomas has held CTO roles at Siemens and SAP. He is passionate about bringing startup velocity to large organizations and has written extensively on technical leadership.',
    ],
    talk: { title: 'Legacy to AI: Enterprise Transformation', track: 'Enterprise Innovation', time: 'Day 2, 14:00', desc: 'How do you introduce AI into organizations with decades of legacy systems? Thomas shares the playbook Innovate Corp used to pilot, scale, and productionize AI across 50+ business units without breaking existing workflows.' },
    panels: [{ title: 'Enterprise Architecture in 2026', time: 'Day 1, 10:00' }, { title: 'Technical Debt and Innovation', time: 'Day 2, 09:30' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'aisha-patel': {
    name: 'Aisha Patel',
    title: 'Director of AI',
    company: 'StackAI',
    role: 'Director of AI, StackAI',
    flag: '🇮🇳',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
    bio: [
      'Aisha Patel leads AI research at StackAI, where she has published groundbreaking work on LLM fine-tuning and retrieval-augmented generation. Her team has reduced inference costs by 70% while improving model quality.',
      'Aisha has a PhD from Carnegie Mellon and has worked at OpenAI and Anthropic. She is a recognized expert in prompt engineering and has trained thousands of developers through her workshops and online courses.',
    ],
    talk: { title: 'LLMs in Production', track: 'AI & Machine Learning', time: 'Day 2, 11:00', desc: 'From prototype to production: Aisha covers the full stack of deploying LLMs at scale. Topics include model selection, prompt versioning, evaluation pipelines, cost optimization, and handling edge cases in production.' },
    panels: [{ title: 'The State of LLMs', time: 'Day 1, 09:30' }, { title: 'AI Research to Product', time: 'Day 2, 13:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
  'ryan-obrien': {
    name: 'Ryan O\'Brien',
    title: 'Founder',
    company: 'GrowthHub',
    role: 'Founder, GrowthHub',
    flag: '🇮🇪',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    bio: [
      'Ryan O\'Brien founded GrowthHub after scaling three startups to acquisition. His community-first approach to growth has built networks of 100,000+ founders and operators who learn from each other.',
      'Ryan is a prolific angel investor and has backed 50+ companies. He hosts the "GrowthHub Podcast" and runs quarterly retreats for growth leaders. His mission is to make world-class growth education accessible to everyone.',
    ],
    talk: { title: 'Building Ecosystems', track: 'Enterprise Innovation', time: 'Day 2, 15:00', desc: 'The best products don\'t just acquire users — they build ecosystems. Ryan shares how GrowthHub created a self-reinforcing community of growth practitioners, and how you can apply these principles to your own product or company.' },
    panels: [{ title: 'Community-Led Growth', time: 'Day 1, 12:30' }, { title: 'Founder Communities', time: 'Day 2, 10:00' }],
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
};

export default function SpeakerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const speaker = SPEAKERS[id];

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

  const otherSpeakers = Object.entries(SPEAKERS)
    .filter(([k]) => k !== id)
    .slice(0, 4);

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
            <p className="text-lg mb-4" style={{ color: 'var(--color-text-muted)' }}>{speaker.flag}</p>
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

      {/* Talk Details */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Talk Details</h2>
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

      {/* Other Sessions */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Other Sessions</h2>
          <ul className="space-y-4">
            {speaker.panels.map((p, i) => (
              <li key={i} className="flex justify-between items-center py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="font-medium">{p.title}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{p.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Connect */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>Connect</h2>
          <div className="flex gap-4">
            <a href={speaker.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Twitter ↗
            </a>
            <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>

      {/* More Speakers */}
      <section className="px-6 py-16" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>More Speakers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {otherSpeakers.map(([sid, s]) => (
              <Link key={sid} href={`/speakers/${sid}`} className="group">
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
