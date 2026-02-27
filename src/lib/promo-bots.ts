/**
 * PROMO SWARM — 6 AI promotion bots run in parallel.
 * Same pattern as swarm.ts. Fallback to template content when no OpenAI key.
 */

import OpenAI from 'openai';

export interface PromoInput {
  name: string;
  topic: string;
  city: string;
  date: string;
  description: string;
  tagline: string;
  speakers: { name: string; role: string }[];
  tracks: string[];
  pricing: { early_bird: string; regular: string; vip?: string; currency: string };
  venue: { name: string; address: string };
  slug: string;
}

export interface Post {
  text: string;
  hashtags: string;
  optimal_time?: string;
  variant_b?: string;
}

export interface CommunityTarget {
  platform: string;
  name: string;
  relevance: string;
  draft_post: string;
  rules_note?: string;
}

export interface EmailDraft {
  name: string;
  subject_a: string;
  subject_b: string;
  body_text: string;
  send_day: number;
}

export interface PartnerOutreach {
  name: string;
  type: string;
  relevance: string;
  outreach_email_draft: string;
  partnership_type: string;
}

export interface BlogOutline {
  title: string;
  outline?: string;
}

export interface SEOContent {
  meta_title: string;
  meta_description: string;
  schema_json: object;
  blog_outlines: BlogOutline[];
}

export interface AdVariant {
  headline: string;
  body: string;
  audience_targeting: string;
  suggested_daily_budget: string;
}

export interface PromoResult {
  social: { linkedin: Post[]; twitter: Post[]; instagram: Post[] };
  communities: CommunityTarget[];
  emails: { emails: EmailDraft[] };
  partners: PartnerOutreach[];
  seo: SEOContent;
  ads: { meta: AdVariant[]; google: AdVariant[]; linkedin: AdVariant[] };
  agentTimings: Record<string, number>;
  errors: string[];
}

const hasOpenAI = () => !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-key');

function templateFallback(input: PromoInput): PromoResult {
  const topic = input.topic.replace(/\s+/g, '');
  const post = `🚀 ${input.name} is coming to ${input.city} on ${input.date}! Join ${input.speakers.length} world-class speakers across ${input.tracks.length} tracks. Early bird: ${input.pricing.early_bird} 🎟️ #${topic}`;
  return {
    social: {
      linkedin: [{ text: post, hashtags: `#${topic} #Event #Conference` }],
      twitter: [{ text: post.slice(0, 280), hashtags: `#${topic}` }],
      instagram: [{ text: post, hashtags: `#${topic} #Event` }],
    },
    communities: [
      { platform: 'Reddit', name: `r/${topic.toLowerCase()}`, relevance: 'High', draft_post: 'Sharing our upcoming event - would love feedback from the community.' },
      { platform: 'LinkedIn', name: `${topic} Professionals`, relevance: 'High', draft_post: post },
    ],
    emails: {
      emails: [
        { name: 'Announcement', subject_a: `${input.name} — Tickets Now Available`, subject_b: `Join us in ${input.city} for ${input.name}`, body_text: `Hi {first_name},\n\n${input.tagline}\n\n${input.description}\n\nGet your ticket: ${input.pricing.early_bird} early bird.`, send_day: 0 },
        { name: 'Speaker Spotlight', subject_a: `Meet the speakers at ${input.name}`, subject_b: 'Your speaker lineup is here', body_text: `Hi {first_name},\n\nWe're excited to share our speaker lineup for ${input.name}.`, send_day: 7 },
        { name: 'Last Chance', subject_a: `Final tickets: ${input.name}`, subject_b: 'Don\'t miss out', body_text: `Hi {first_name},\n\nLast chance to secure your spot at ${input.name} in ${input.city}.`, send_day: 14 },
      ],
    },
    partners: [
      { name: `Local ${input.topic} org in ${input.city}`, type: 'Community', relevance: 'High', outreach_email_draft: `Hi, we're organizing ${input.name} and would love to cross-promote.`, partnership_type: 'Cross-Promo' },
    ],
    seo: {
      meta_title: `${input.name} — ${input.city} | ${input.date}`.slice(0, 60),
      meta_description: (input.description || input.tagline).slice(0, 155),
      schema_json: { '@type': 'Event', name: input.name, startDate: input.date },
      blog_outlines: [
        { title: `Why attend ${input.name}` },
        { title: `Speaker spotlight: ${input.name}` },
        { title: `${input.city} events guide` },
      ],
    },
    ads: {
      meta: [{ headline: input.name, body: input.tagline, audience_targeting: `${input.city}, ${input.topic}`, suggested_daily_budget: '$20' }],
      google: [{ headline: input.name, body: input.tagline, audience_targeting: 'Event keywords', suggested_daily_budget: '$15' }],
      linkedin: [{ headline: input.name, body: input.tagline, audience_targeting: 'Professionals', suggested_daily_budget: '$25' }],
    },
    agentTimings: {},
    errors: [],
  };
}

export async function runPromoSwarm(input: PromoInput): Promise<PromoResult> {
  if (!hasOpenAI()) {
    return templateFallback(input);
  }

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

  const [social, communities, emails, partners, seo, ads] = await Promise.all([
    timed('social', () => socialBlitzBot(openai, input), templateFallback(input).social),
    timed('communities', () => communityBot(openai, input), templateFallback(input).communities),
    timed('emails', () => emailBot(openai, input), templateFallback(input).emails),
    timed('partners', () => partnerBot(openai, input), templateFallback(input).partners),
    timed('seo', () => seoBot(openai, input), templateFallback(input).seo),
    timed('ads', () => retargetBot(openai, input), templateFallback(input).ads),
  ]);

  return { social, communities, emails, partners, seo, ads, agentTimings: timings, errors };
}

async function socialBlitzBot(openai: OpenAI, input: PromoInput) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Generate social media posts for an event. Return JSON only.' },
      { role: 'user', content: `Event: ${input.name}. ${input.tagline}. ${input.city}. ${input.date}. Speakers: ${input.speakers.map((s) => s.name).join(', ')}. Tracks: ${input.tracks.join(', ')}. Pricing: ${input.pricing.early_bird} early bird. Generate 3 posts each for LinkedIn, Twitter, Instagram. Each: text, hashtags, optimal_time, variant_b. Return JSON: { linkedin: Post[], twitter: Post[], instagram: Post[] }` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1500,
  });
  const data = JSON.parse(res.choices[0].message.content || '{}');
  return {
    linkedin: data.linkedin || [],
    twitter: data.twitter || [],
    instagram: data.instagram || [],
  };
}

async function communityBot(openai: OpenAI, input: PromoInput) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Suggest relevant online communities for event promotion. Return JSON only.' },
      { role: 'user', content: `Event: ${input.name}. Topic: ${input.topic}. City: ${input.city}. Find 10 relevant communities (Reddit, Slack, Discord, FB, LinkedIn). Each: platform, name, relevance, draft_post (non-spammy), rules_note. Return JSON: { communities: CommunityTarget[] }` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1500,
  });
  const data = JSON.parse(res.choices[0].message.content || '{}');
  return data.communities || [];
}

async function emailBot(openai: OpenAI, input: PromoInput) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Generate a 3-email drip sequence. Return JSON only.' },
      { role: 'user', content: `Event: ${input.name}. ${input.tagline}. ${input.city}. ${input.date}. Speakers: ${input.speakers.map((s) => s.name).join(', ')}. Tiers: ${input.pricing.early_bird} early bird. Generate 3 emails: Announcement (day 0), Speaker Spotlight (day 7), Last Chance (day 14). Each: name, subject_a, subject_b, body_text with {first_name} tokens, send_day. Return JSON: { emails: EmailDraft[] }` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1500,
  });
  const data = JSON.parse(res.choices[0].message.content || '{}');
  return { emails: data.emails || [] };
}

async function partnerBot(openai: OpenAI, input: PromoInput) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Suggest cross-promo partners. Return JSON only.' },
      { role: 'user', content: `Event: ${input.name}. Topic: ${input.topic}. City: ${input.city}. Find 6 cross-promo partners. Each: name, type, relevance, outreach_email_draft, partnership_type (Media/Community/Cross-Promo). Return JSON: { partners: PartnerOutreach[] }` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1000,
  });
  const data = JSON.parse(res.choices[0].message.content || '{}');
  return data.partners || [];
}

async function seoBot(openai: OpenAI, input: PromoInput) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Generate SEO content. Return JSON only.' },
      { role: 'user', content: `Event: ${input.name}. ${input.description}. ${input.city}. ${input.date}. Generate: meta_title (60 chars), meta_description (155 chars), schema.org Event JSON-LD object, 3 blog post outlines with titles. Return JSON: { meta_title, meta_description, schema_json, blog_outlines }` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1000,
  });
  const data = JSON.parse(res.choices[0].message.content || '{}');
  return {
    meta_title: data.meta_title || input.name,
    meta_description: data.meta_description || input.tagline,
    schema_json: data.schema_json || {},
    blog_outlines: data.blog_outlines || [],
  };
}

async function retargetBot(openai: OpenAI, input: PromoInput) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Generate ad copy variants. Return JSON only.' },
      { role: 'user', content: `Event: ${input.name}. ${input.tagline}. ${input.city}. ${input.date}. Generate 2 ad variants each for Meta, Google Display, LinkedIn. Each: headline, body, audience_targeting, suggested_daily_budget. Return JSON: { meta: AdVariant[], google: AdVariant[], linkedin: AdVariant[] }` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 1000,
  });
  const data = JSON.parse(res.choices[0].message.content || '{}');
  return {
    meta: data.meta || [],
    google: data.google || [],
    linkedin: data.linkedin || [],
  };
}
