import OpenAI from 'openai';
import type { SpeakerData, ScheduleItem, VenueData, PricingData } from './types';
import { getSpeakerPhoto } from './speaker-photos';

/**
 * SWARM GENERATION
 * 
 * Dispatches 5 parallel AI agents, each specializing in one domain:
 *   🎤 Speaker Agent    — curates diverse, relevant speakers
 *   🏛️ Venue Agent      — selects city-appropriate venue
 *   📋 Schedule Agent   — builds a full-day program
 *   💰 Pricing Agent    — sets tier pricing for the market
 *   ✍️ Branding Agent   — generates name, tagline, description
 * 
 * All run simultaneously. Results merge into one event.
 * Fallback: if any agent fails, smart defaults fill the gap.
 */

export interface SwarmInput {
  topic: string;
  city: string;
  date: string;
  capacity: number;
  budget: string;
  vibe: string;
  speakers_hint?: string;
}

export interface SwarmResult {
  speakers: SpeakerData[];
  venue: VenueData;
  schedule: ScheduleItem[];
  pricing: PricingData;
  branding: { name: string; tagline: string; description: string; topic_key: string };
  tracks: string[];
  agentTimings: Record<string, number>;
  errors: string[];
}

export interface SwarmStatus {
  total: number;
  completed: number;
  agents: { name: string; status: 'pending' | 'running' | 'done' | 'error'; ms?: number }[];
}

const AGENT_NAMES = ['speakers', 'venue', 'schedule', 'pricing', 'branding'] as const;

export async function runSwarm(input: SwarmInput): Promise<SwarmResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const errors: string[] = [];
  const timings: Record<string, number> = {};

  async function timed<T>(name: string, fn: () => Promise<T>, fallback: T): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      timings[name] = Date.now() - start;
      return result;
    } catch (err: any) {
      timings[name] = Date.now() - start;
      errors.push(`${name}: ${err.message || 'failed'}`);
      return fallback;
    }
  }

  // Run all 5 agents in parallel
  const [speakers, venue, schedule, pricing, branding] = await Promise.all([
    timed('speakers', () => speakerAgent(openai, input), []),
    timed('venue', () => venueAgent(openai, input), { name: `${input.city} Convention Center`, address: `Downtown ${input.city}` }),
    timed('schedule', () => scheduleAgent(openai, input), []),
    timed('pricing', () => pricingAgent(openai, input), { early_bird: '$199', regular: '$349', vip: '$799', currency: 'USD' }),
    timed('branding', () => brandingAgent(openai, input), {
      name: `${input.topic} Summit ${input.city}`,
      tagline: `The future of ${input.topic.toLowerCase()}`,
      description: `Join ${input.capacity} leaders for a ${input.vibe} ${input.topic.toLowerCase()} experience in ${input.city}.`,
      topic_key: 'general',
    }),
  ]);

  // Extract tracks from schedule or generate defaults
  const tracks = extractTracks(schedule) || ['Main Stage', 'Workshop', 'Panel', 'Lightning Talks'];

  return { speakers, venue, schedule, pricing, branding, tracks, agentTimings: timings, errors };
}

// ── SPEAKER AGENT ──────────────────────────────────────────────────────

async function speakerAgent(openai: OpenAI, input: SwarmInput): Promise<SpeakerData[]> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a conference speaker curator. Generate diverse, realistic speakers. Return ONLY a JSON array.',
      },
      {
        role: 'user',
        content: `Generate 8 speakers for a ${input.vibe} ${input.topic} conference in ${input.city} (${input.capacity} attendees, ${input.budget} budget).${input.speakers_hint ? ` Preferences: ${input.speakers_hint}` : ''}

Return JSON array: [{ "name": "Full Name", "role": "Title at Company", "bio": "One sentence bio" }]
Ensure gender/ethnic diversity. Include mix of industry leaders, academics, and practitioners.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.9,
    max_tokens: 1000,
  });

  const data = JSON.parse(res.choices[0].message.content || '{}');
  const speakers = Array.isArray(data) ? data : data.speakers || [];
  return speakers.map((s: any, i: number) => ({
    name: s.name,
    role: s.role,
    initials: s.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
    bio: s.bio,
    photo_url: getSpeakerPhoto(i),
  }));
}

// ── VENUE AGENT ────────────────────────────────────────────────────────

async function venueAgent(openai: OpenAI, input: SwarmInput): Promise<VenueData> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You select conference venues. Return ONLY JSON.' },
      {
        role: 'user',
        content: `Pick a specific, real venue in ${input.city} for a ${input.vibe} ${input.topic} conference with ${input.capacity} attendees (${input.budget} budget).
Return JSON: { "name": "Venue Name", "address": "Full street address" }`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 200,
  });

  return JSON.parse(res.choices[0].message.content || '{}');
}

// ── SCHEDULE AGENT ─────────────────────────────────────────────────────

async function scheduleAgent(openai: OpenAI, input: SwarmInput): Promise<ScheduleItem[]> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You build conference schedules. Return ONLY a JSON array.' },
      {
        role: 'user',
        content: `Build a full-day schedule (9AM-6PM) for a ${input.vibe} ${input.topic} conference. 12 sessions.
Return JSON array: [{ "time": "9:00 AM", "title": "Session Title", "speaker": "Speaker Name", "track": "Track Name" }]
Include keynotes, panels, workshops, breaks, and networking. Use 4 tracks.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1500,
  });

  const data = JSON.parse(res.choices[0].message.content || '{}');
  return Array.isArray(data) ? data : data.schedule || [];
}

// ── PRICING AGENT ──────────────────────────────────────────────────────

async function pricingAgent(openai: OpenAI, input: SwarmInput): Promise<PricingData> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You set conference ticket pricing. Return ONLY JSON.' },
      {
        role: 'user',
        content: `Set ticket pricing for a ${input.vibe} ${input.topic} conference in ${input.city}. Budget tier: ${input.budget}. Capacity: ${input.capacity}.
Return JSON: { "early_bird": "$XXX", "regular": "$XXX", "vip": "$X,XXX", "currency": "USD" }
Price appropriately for the city and budget tier.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    max_tokens: 200,
  });

  return JSON.parse(res.choices[0].message.content || '{}');
}

// ── BRANDING AGENT ─────────────────────────────────────────────────────

async function brandingAgent(openai: OpenAI, input: SwarmInput): Promise<{
  name: string; tagline: string; description: string; topic_key: string;
}> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You name and brand conferences. Return ONLY JSON.' },
      {
        role: 'user',
        content: `Create branding for a ${input.vibe} ${input.topic} conference in ${input.city}.
Return JSON: {
  "name": "Catchy conference name (max 40 chars)",
  "tagline": "One-line tagline",
  "description": "2-sentence description for the event page",
  "topic_key": "one of: ai, web3, climate, health, fintech, general"
}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.9,
    max_tokens: 300,
  });

  return JSON.parse(res.choices[0].message.content || '{}');
}

// ── UTILS ──────────────────────────────────────────────────────────────

function extractTracks(schedule: ScheduleItem[]): string[] | null {
  const tracks = [...new Set(schedule.map(s => s.track).filter((t): t is string => !!t))];
  return tracks.length >= 2 ? tracks.slice(0, 4) : null;
}
