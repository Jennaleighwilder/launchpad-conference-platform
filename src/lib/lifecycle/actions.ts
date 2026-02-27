/**
 * Lifecycle automation actions — wired to OpenAI + email when available.
 */

import { sendEmail } from '@/lib/email';

export interface EventForActions {
  id: string;
  slug: string;
  name: string;
  date: string;
  city: string;
  description?: string | null;
}

const hasOpenAI = () => !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-key');

export async function generateEventDescription(event: EventForActions): Promise<string> {
  try {
    if (hasOpenAI()) {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Generate a compelling 2-3 sentence event description.' },
          { role: 'user', content: `Event: ${event.name}. ${event.date}. ${event.city}. ${event.description || ''}. Write a compelling description.` },
        ],
        max_tokens: 150,
      });
      const text = res.choices[0]?.message?.content?.trim();
      if (text) {
        console.log('[lifecycle] generateEventDescription: generated via AI');
        return text;
      }
    }
  } catch (err: any) {
    console.log('[lifecycle] generateEventDescription: fallback', err.message);
  }
  return event.description || `Join us for ${event.name} on ${event.date} in ${event.city}.`;
}

export async function generateSocialAnnouncement(event: EventForActions): Promise<string> {
  try {
    if (hasOpenAI()) {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Write a social-ready announcement under 280 characters for Twitter.' },
          { role: 'user', content: `Event: ${event.name}. ${event.date}. ${event.city}. Write a punchy announcement.` },
        ],
        max_tokens: 100,
      });
      const text = res.choices[0]?.message?.content?.trim();
      if (text && text.length <= 280) {
        console.log('[lifecycle] generateSocialAnnouncement: generated via AI');
        return text;
      }
    }
  } catch (err: any) {
    console.log('[lifecycle] generateSocialAnnouncement: fallback', err.message);
  }
  return `${event.name} — ${event.date} in ${event.city}. Get your ticket!`;
}

export async function sendSpeakerEmails(event: EventForActions): Promise<void> {
  const subject = `You're invited to speak at ${event.name}`;
  const body = `Hi,\n\nWe'd love to have you speak at ${event.name} on ${event.date} in ${event.city}.\n\nReply to this email to confirm.`;
  if (process.env.RESEND_API_KEY) {
    try {
      await sendEmail({ to: 'speakers@launchpad.events', subject, text: body });
      console.log('[lifecycle] sendSpeakerEmails: sent');
    } catch (err: any) {
      console.log('[lifecycle] sendSpeakerEmails: failed', err.message);
    }
  } else {
    console.log('[lifecycle] sendSpeakerEmails: demo mode — would send to speakers@launchpad.events', { subject, body: body.slice(0, 80) });
  }
}

export async function sendAttendeeReminder(event: EventForActions): Promise<void> {
  const subject = `Reminder: ${event.name} is coming up!`;
  const body = `Hi,\n\n${event.name} is on ${event.date} in ${event.city}. Don't forget to add it to your calendar!`;
  if (process.env.RESEND_API_KEY) {
    try {
      await sendEmail({ to: 'attendees@launchpad.events', subject, text: body });
      console.log('[lifecycle] sendAttendeeReminder: sent');
    } catch (err: any) {
      console.log('[lifecycle] sendAttendeeReminder: failed', err.message);
    }
  } else {
    console.log('[lifecycle] sendAttendeeReminder: demo mode — would send', { subject, body: body.slice(0, 80) });
  }
}

export async function sendPostEventSummary(event: EventForActions): Promise<void> {
  console.log('[lifecycle] sendPostEventSummary:', event.slug);
}
