/**
 * Email automation — centralized in /lib/email
 * Add Resend or SendGrid when ready. Stubs log for now.
 */

type EmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

async function send(payload: EmailPayload): Promise<void> {
  // TODO: Integrate Resend or SendGrid
  console.log('[email]', payload.subject, '→', payload.to);
}

export async function sendSpeakerConfirmation(to: string, eventName: string, confirmLink: string): Promise<void> {
  await send({
    to,
    subject: `Speaker confirmation: ${eventName}`,
    html: `You've been invited to speak at ${eventName}. <a href="${confirmLink}">Confirm here</a>.`,
  });
}

export async function sendOrganizerChecklist(to: string, eventName: string): Promise<void> {
  await send({
    to,
    subject: `Organizer checklist: ${eventName}`,
    html: `Your event ${eventName} is ready to announce. Checklist: confirm speakers, set ticket prices, schedule launch.`,
  });
}

export async function sendLaunchAnnouncement(to: string, eventName: string, eventUrl: string): Promise<void> {
  await send({
    to,
    subject: `Tickets live: ${eventName}`,
    html: `Tickets are now on sale for ${eventName}. <a href="${eventUrl}">Get yours</a>.`,
  });
}

export async function sendAttendeeReminder(to: string, eventName: string, hoursUntil: number): Promise<void> {
  await send({
    to,
    subject: `Reminder: ${eventName} in ${hoursUntil}h`,
    html: `Don't forget — ${eventName} starts in ${hoursUntil} hours.`,
  });
}

export async function sendThankYou(to: string, eventName: string): Promise<void> {
  await send({
    to,
    subject: `Thank you for attending ${eventName}`,
    html: `Thanks for being part of ${eventName}. We hope you had a great experience.`,
  });
}

export async function sendFeedbackSurvey(to: string, eventName: string, surveyLink: string): Promise<void> {
  await send({
    to,
    subject: `Quick feedback: ${eventName}`,
    html: `How was ${eventName}? <a href="${surveyLink}">Share your feedback</a> (takes 1 min).`,
  });
}
