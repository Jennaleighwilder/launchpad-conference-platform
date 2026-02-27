import OpenAI from 'openai';
import type { EventData, CreateEventInput, SpeakerData, ScheduleItem, VenueData, PricingData } from './types';
import { getUniqueHeroForEvent } from './hero-images';
import { generateRelevantHero } from './hero-generation';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateEvent(input: CreateEventInput): Promise<Omit<EventData, 'id' | 'created_at' | 'status'>> {
  const slug = generateSlug(input.topic, input.city);

  // If no OpenAI key, use smart fallback generation
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-key') {
    return fallbackGenerate(input, slug);
  }

  try {
    const prompt = buildPrompt(input);
    const response = await openai!.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a world-class conference producer. Generate complete, realistic conference data as JSON. Be specific with real-sounding venue names, diverse speaker names, and detailed session titles. Match the vibe: "professional" = corporate/polished, "builder" = hands-on/hackathon, "academic" = research-focused, "festival" = creative/experiential.`
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 3000,
    });

    const data = JSON.parse(response.choices[0].message.content || '{}');
    return mapAIResponse(data, input, slug);
  } catch (error) {
    console.error('OpenAI generation failed, using fallback:', error);
    return fallbackGenerate(input, slug);
  }
}

function buildPrompt(input: CreateEventInput): string {
  const days = input.days === 2 || input.days === 3 ? input.days : 1;
  const speakerCount = input.enhanced ? 12 : 8;
  const scheduleSlots = days * 12;
  return `Generate a complete conference for:
- Topic: ${input.topic}
- City: ${input.city}
- Date: ${input.date}
- Duration: ${days} day${days > 1 ? 's' : ''}
- Capacity: ${input.capacity} attendees
- Budget tier: ${input.budget}
- Vibe: ${input.vibe}
${input.speakers_hint ? `- Speaker preferences: ${input.speakers_hint}` : ''}

Return JSON with:
{
  "name": "Conference Name (catchy, max 40 chars)",
  "tagline": "One-line tagline",
  "description": "2-sentence description",
  "topic_key": "one of: ai, web3, climate, health, fintech, or general",
  "venue": { "name": "Specific venue name in ${input.city}", "address": "Full address" },
  "tracks": ["Track 1", "Track 2", "Track 3", "Track 4"],
  "speakers": [
    { "name": "Full Name", "role": "Title at Company", "bio": "One sentence bio" }
  ] (generate exactly ${speakerCount} diverse speakers),
  "schedule": [
    { "time": "Day 1 · 9:00 AM", "title": "Session Title", "speaker": "Speaker Name", "track": "Track Name" }
  ] (generate ${scheduleSlots} time slots across ${days} day${days > 1 ? 's' : ''}, use "Day N · HH:MM AM/PM" for time when multi-day),
  "pricing": {
    "early_bird": "price as string with currency symbol",
    "regular": "price as string with currency symbol",
    "vip": "price as string with currency symbol",
    "currency": "USD or local currency code"
  }
}`;
}

function mapAIResponse(data: any, input: CreateEventInput, slug: string): Omit<EventData, 'id' | 'created_at' | 'status'> {
  const speakers: SpeakerData[] = (data.speakers || []).map((s: any, i: number) => ({
    name: s.name,
    role: s.role,
    initials: getInitials(s.name),
    bio: s.bio,
    photo_url: getSpeakerPhoto(i),
  }));

  return {
    slug,
    name: data.name || `${input.topic} Summit ${input.city}`,
    topic: input.topic,
    city: input.city,
    date: input.date,
    capacity: input.capacity,
    budget: input.budget,
    vibe: input.vibe,
    venue: data.venue || { name: `${input.city} Convention Center`, address: input.city },
    tracks: data.tracks || ['Main Stage', 'Workshop', 'Panel', 'Lightning Talks'],
    speakers,
    schedule: data.schedule || [],
    pricing: data.pricing || getDefaultPricing(input.budget),
    description: data.description || '',
    tagline: data.tagline || '',
    topic_key: data.topic_key || detectTopicKey(input.topic),
    hero_image_url: getUniqueHeroForEvent(input.topic, input.city, slug),
    hero_media_type: 'image',
  };
}

// ── Smart Fallback (no OpenAI key needed) ──────────────────────────────

function fallbackGenerate(input: CreateEventInput, slug: string): Omit<EventData, 'id' | 'created_at' | 'status'> {
  const topicKey = detectTopicKey(input.topic);
  const tracks = TRACK_DB[topicKey] || TRACK_DB.general;
  const speakerCount = input.enhanced ? 12 : 8;
  const speakers = pickSpeakers(topicKey, speakerCount);
  const venue = getVenue(input.city, input.capacity);
  const pricing = getDefaultPricing(input.budget);
  const days = input.days === 2 || input.days === 3 ? input.days : 1;
  const schedule = days > 1 ? buildMultiDaySchedule(input.topic, speakers, tracks, days as 2 | 3) : buildSchedule(input.topic, speakers, tracks);

  const name = generateName(input.topic, input.city, input.vibe);
  const tagline = generateTagline(input.topic, input.vibe);

  return {
    slug,
    name,
    topic: input.topic,
    city: input.city,
    date: input.date,
    capacity: input.capacity,
    budget: input.budget,
    vibe: input.vibe,
    venue,
    tracks,
    speakers,
    schedule,
    pricing,
    description: input.enhanced
      ? `Join ${input.capacity} leaders in ${input.topic.toLowerCase()} for a ${input.vibe} experience in ${input.city}. World-class speakers, hands-on workshops, case studies, and unmatched networking across ${days} day${days > 1 ? 's' : ''}.`
      : `Join ${input.capacity} leaders in ${input.topic.toLowerCase()} for a ${input.vibe} experience in ${input.city}. Featuring world-class speakers, hands-on workshops, and unmatched networking.`,
    tagline,
    topic_key: topicKey,
    hero_image_url: getUniqueHeroForEvent(input.topic, input.city, slug),
    hero_media_type: 'image',
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────

function generateSlug(topic: string, city: string): string {
  const base = `${topic}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function detectTopicKey(topic: string): string {
  const t = topic.toLowerCase();
  if (/\b(ai|artificial|machine|deep learn|llm|gpt|neural|agent)/i.test(t)) return 'ai';
  if (/\b(web3|crypto|blockchain|defi|nft|dao|ethereum|solana)/i.test(t)) return 'web3';
  if (/\b(climate|sustain|green|carbon|clean|energy|solar)/i.test(t)) return 'climate';
  if (/\b(health|med|bio|pharma|genomic|wellness|mental)/i.test(t)) return 'health';
  if (/\b(fintech|banking|payment|insur|neobank|finance)/i.test(t)) return 'fintech';
  return 'general';
}

function generateName(topic: string, city: string, vibe: string): string {
  const vibeWords: Record<string, string[]> = {
    professional: ['Summit', 'Forum', 'Conference'],
    builder: ['Build', 'Hackathon', 'DevCon'],
    academic: ['Symposium', 'Colloquium', 'Research Forum'],
    festival: ['Fest', 'Experience', 'Gathering'],
  };
  const words = vibeWords[vibe] || vibeWords.professional;
  const suffix = words[Math.floor(Math.random() * words.length)];
  const topicShort = topic.split(' ').slice(0, 3).join(' ');
  return `${topicShort} ${suffix} ${city}`;
}

function generateTagline(topic: string, vibe: string): string {
  const taglines: Record<string, string> = {
    professional: `Where ${topic.toLowerCase()} leaders converge`,
    builder: `Build the future of ${topic.toLowerCase()}`,
    academic: `Advancing the frontier of ${topic.toLowerCase()}`,
    festival: `Experience the pulse of ${topic.toLowerCase()}`,
  };
  return taglines[vibe] || taglines.professional;
}

function getVenue(city: string, capacity: number): VenueData {
  const venues: Record<string, VenueData> = {
    amsterdam: { name: 'Amsterdam Passenger Terminal', address: 'Piet Heinkade 27, 1019 BR Amsterdam' },
    berlin: { name: 'Station Berlin', address: 'Luckenwalder Str. 4-6, 10963 Berlin' },
    london: { name: 'ExCeL London', address: 'Royal Victoria Dock, London E16 1XL' },
    paris: { name: 'Station F', address: '5 Parvis Alan Turing, 75013 Paris' },
    'new york': { name: 'Javits Center', address: '429 11th Ave, New York, NY 10001' },
    'san francisco': { name: 'Moscone Center', address: '747 Howard St, San Francisco, CA 94103' },
    singapore: { name: 'Marina Bay Sands Expo', address: '10 Bayfront Ave, Singapore 018956' },
    tokyo: { name: 'Tokyo Big Sight', address: '3-11-1 Ariake, Koto City, Tokyo' },
    dubai: { name: 'Dubai World Trade Centre', address: 'Sheikh Zayed Rd, Dubai' },
    austin: { name: 'Austin Convention Center', address: '500 E Cesar Chavez St, Austin, TX 78701' },
  };
  const key = city.toLowerCase();
  return venues[key] || {
    name: `${city} Convention Center`,
    address: `Downtown ${city}`,
    capacity_note: `Configured for ${capacity} attendees`,
  };
}

function getDefaultPricing(budget: string): PricingData {
  const tiers: Record<string, PricingData> = {
    starter: { early_bird: '$99', regular: '$149', vip: '$299', currency: 'USD' },
    growth: { early_bird: '$249', regular: '$399', vip: '$799', currency: 'USD' },
    premium: { early_bird: '$499', regular: '$799', vip: '$1,499', currency: 'USD' },
    enterprise: { early_bird: '$999', regular: '$1,499', vip: '$2,999', currency: 'USD' },
  };
  return tiers[budget] || tiers.growth;
}

const TRACK_DB: Record<string, string[]> = {
  ai: ['Foundation Models', 'Applied AI', 'AI Safety & Ethics', 'Autonomous Agents'],
  web3: ['DeFi & Protocols', 'NFT Infrastructure', 'DAO Governance', 'ZK & Scaling'],
  climate: ['Carbon Markets', 'Clean Energy', 'Circular Economy', 'Climate Finance'],
  health: ['Digital Therapeutics', 'Genomics & AI', 'Mental Health Tech', 'MedTech'],
  fintech: ['Neo Banking', 'Embedded Finance', 'RegTech', 'Digital Payments'],
  general: ['Innovation', 'Leadership', 'Technology', 'Workshops'],
};

import { getSpeakerPhoto } from './speaker-photos';

const SPEAKER_DB: Record<string, SpeakerData[]> = {
  ai: [
    { name: 'Dr. Sarah Chen', role: 'Head of AI Research, DeepScale', initials: 'SC' },
    { name: 'Marcus Thompson', role: 'VP Engineering, Anthropic', initials: 'MT' },
    { name: 'Dr. Priya Patel', role: 'Director of ML, Google Brain', initials: 'PP' },
    { name: 'James Okonkwo', role: 'Founder, NeuralForge AI', initials: 'JO' },
    { name: 'Dr. Elena Vasquez', role: 'AI Ethics Lead, Stanford HAI', initials: 'EV' },
    { name: 'Alex Kim', role: 'CTO, AgentStack', initials: 'AK' },
    { name: 'Dr. Wei Zhang', role: 'Principal Scientist, Meta FAIR', initials: 'WZ' },
    { name: 'Rachel Nguyen', role: 'Head of Product, Cohere', initials: 'RN' },
    { name: 'Dr. David Müller', role: 'Professor of ML, ETH Zürich', initials: 'DM' },
    { name: 'Amara Osei', role: 'CEO, SafeAI Labs', initials: 'AO' },
  ],
  web3: [
    { name: 'Sofia Rodriguez', role: 'Protocol Lead, Uniswap', initials: 'SR' },
    { name: 'Ryan Park', role: 'Founder, ZK Labs', initials: 'RP' },
    { name: 'Dr. Aisha Mohammed', role: 'Blockchain Research, MIT', initials: 'AM' },
    { name: 'Jake Morrison', role: 'Head of DeFi, Coinbase', initials: 'JM' },
    { name: 'Lena Fischer', role: 'DAO Governance Lead, MakerDAO', initials: 'LF' },
    { name: 'Carlos Mendez', role: 'CTO, Polygon', initials: 'CM' },
    { name: 'Nina Volkov', role: 'VP Eng, Alchemy', initials: 'NV' },
    { name: 'Kwame Asante', role: 'Founder, AfriChain', initials: 'KA' },
    { name: 'Tommy Wu', role: 'Head of Research, a16z crypto', initials: 'TW' },
    { name: 'Dr. Isabelle Laurent', role: 'Cryptography Lead, Starkware', initials: 'IL' },
  ],
  general: [
    { name: 'Dr. Amanda Foster', role: 'Innovation Director, McKinsey', initials: 'AF' },
    { name: 'Michael Chang', role: 'CTO, Stripe', initials: 'MC' },
    { name: 'Sarah Williams', role: 'VP Product, Notion', initials: 'SW' },
    { name: 'Dr. Robert Okafor', role: 'Professor, MIT Sloan', initials: 'RO' },
    { name: 'Lisa Chen', role: 'CEO, TechForward', initials: 'LC' },
    { name: 'Daniel Herrera', role: 'Head of Design, Figma', initials: 'DH' },
    { name: 'Dr. Emily Brooks', role: 'Research Lead, OpenAI', initials: 'EB' },
    { name: 'Tomoko Sato', role: 'Partner, Sequoia Capital', initials: 'TS' },
    { name: 'André Williams', role: 'Founder, ScaleUp Labs', initials: 'AW' },
    { name: 'Maria Santos', role: 'VP Engineering, Vercel', initials: 'MS' },
  ],
};

// Reuse general for topics without specific speakers
SPEAKER_DB.climate = SPEAKER_DB.general;
SPEAKER_DB.health = SPEAKER_DB.general;
SPEAKER_DB.fintech = SPEAKER_DB.general;

function pickSpeakers(topicKey: string, count: number): SpeakerData[] {
  const pool = [...(SPEAKER_DB[topicKey] || SPEAKER_DB.general)];
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map((s, i) => ({
    ...s,
    photo_url: getSpeakerPhoto(i),
  }));
}

function buildSchedule(topic: string, speakers: SpeakerData[], tracks: string[]): ScheduleItem[] {
  const sessionTypes = [
    { time: '9:00 AM', title: `Opening Keynote: The Future of ${topic}` },
    { time: '9:45 AM', title: `State of ${topic}: 2026 Landscape` },
    { time: '10:30 AM', title: 'Coffee & Networking Break' },
    { time: '11:00 AM', title: `Deep Dive: ${tracks[0]}` },
    { time: '11:45 AM', title: `Workshop: Building with ${topic}` },
    { time: '12:30 PM', title: 'Lunch & Exhibition' },
    { time: '1:30 PM', title: `Panel: ${tracks[1]} in Practice` },
    { time: '2:15 PM', title: `Fireside Chat: ${tracks[2]}` },
    { time: '3:00 PM', title: 'Afternoon Break & Demos' },
    { time: '3:30 PM', title: `Lightning Talks: ${tracks[3]}` },
    { time: '4:30 PM', title: `Closing Keynote: What's Next for ${topic}` },
    { time: '5:30 PM', title: 'Networking Reception & Drinks' },
  ];

  return sessionTypes.map((session, i) => ({
    time: session.time,
    title: session.title,
    speaker: speakers[i % speakers.length]?.name || 'TBA',
    track: tracks[i % tracks.length],
  }));
}

function buildMultiDaySchedule(topic: string, speakers: SpeakerData[], tracks: string[], days: 2 | 3): ScheduleItem[] {
  const dayThemes: Record<number, { prefix: string; sessions: string[] }> = {
    1: {
      prefix: 'Day 1',
      sessions: [
        `Opening Keynote: The Future of ${topic}`,
        `State of ${topic}: 2026 Landscape`,
        'Coffee & Networking Break',
        `Deep Dive: ${tracks[0]}`,
        `Workshop: Building with ${topic}`,
        'Lunch & Exhibition',
        `Panel: ${tracks[1]} in Practice`,
        `Fireside Chat: ${tracks[2]}`,
        'Afternoon Break & Demos',
        `Lightning Talks: ${tracks[3]}`,
        `Closing Keynote: What's Next for ${topic}`,
        'Networking Reception',
      ],
    },
    2: {
      prefix: 'Day 2',
      sessions: [
        `Case Studies: ${topic} in Action`,
        `Investor Spotlight: Funding ${topic}`,
        'Morning Break',
        `Lab Session: ${tracks[0]}`,
        `Roundtable: ${tracks[1]}`,
        'Lunch & Exhibition',
        `Workshop: ${tracks[2]} Deep Dive`,
        `Panel: Scaling ${topic} Startups`,
        'Afternoon Break',
        `Masterclass: ${tracks[3]}`,
        `Closing: Day 2 Wrap-up`,
        'Evening Networking',
      ],
    },
    3: {
      prefix: 'Day 3',
      sessions: [
        `Hackathon Awards & Demos`,
        `Masterclass: Advanced ${topic}`,
        'Morning Break',
        `Pitch Competition: ${topic} Startups`,
        `Workshop: ${tracks[0]}`,
        'Lunch',
        `Fireside: ${tracks[1]} Leaders`,
        `Panel: ${tracks[2]} Trends`,
        'Break',
        `Closing Keynote: ${topic} 2027`,
        'Final Networking & Farewell',
      ],
    },
  };
  const times = ['9:00 AM', '9:45 AM', '10:30 AM', '11:00 AM', '11:45 AM', '12:30 PM', '1:30 PM', '2:15 PM', '3:00 PM', '3:30 PM', '4:30 PM', '5:30 PM'];
  const out: ScheduleItem[] = [];
  for (let d = 1; d <= days; d++) {
    const theme = dayThemes[d] || dayThemes[1];
    theme.sessions.forEach((title, i) => {
      out.push({
        time: `${theme.prefix} · ${times[i % times.length]}`,
        title,
        speaker: speakers[(d - 1) * 4 + (i % speakers.length)]?.name || speakers[i % speakers.length]?.name || 'TBA',
        track: tracks[i % tracks.length],
      });
    });
  }
  return out;
}

/** Generate relevant hero (AI → stock → Picsum). Used when persisting to Supabase. */
export async function generateHeroForEvent(
  event: { name: string; topic: string; city: string; slug: string; vibe?: string },
  usedProviderIds?: Set<string>
): Promise<{ image_url: string; provider: string; provider_asset_id?: string | null }> {
  return generateRelevantHero(event, usedProviderIds ?? new Set());
}
