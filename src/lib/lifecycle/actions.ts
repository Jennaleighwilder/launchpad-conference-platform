/**
 * Lifecycle automation actions — placeholders.
 * Log to console, return mock text. DO NOT integrate external AI yet.
 */

export interface EventForActions {
  id: string;
  slug: string;
  name: string;
  date: string;
  city: string;
  description?: string | null;
}

export async function generateEventDescription(event: EventForActions): Promise<string> {
  console.log('[lifecycle] generateEventDescription:', event.slug);
  return event.description || `Join us for ${event.name} on ${event.date} in ${event.city}.`;
}

export async function generateSocialAnnouncement(event: EventForActions): Promise<string> {
  console.log('[lifecycle] generateSocialAnnouncement:', event.slug);
  return `${event.name} — ${event.date} in ${event.city}. Get your ticket!`;
}

export async function sendSpeakerEmails(event: EventForActions): Promise<void> {
  console.log('[lifecycle] sendSpeakerEmails:', event.slug);
}

export async function sendAttendeeReminder(event: EventForActions): Promise<void> {
  console.log('[lifecycle] sendAttendeeReminder:', event.slug);
}

export async function sendPostEventSummary(event: EventForActions): Promise<void> {
  console.log('[lifecycle] sendPostEventSummary:', event.slug);
}
