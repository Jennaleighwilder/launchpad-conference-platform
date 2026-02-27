import { Resend } from 'resend';

const resendKey = process.env.RESEND_API_KEY;

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}): Promise<{ success: boolean; demo?: boolean; id?: string; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.log('[email:demo]', { to, subject, preview: (text || html || '').slice(0, 80) });
    return { success: true, demo: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Launchpad <notifications@launchpad.events>',
      to,
      subject,
      html: html || text || '',
      text: text || '',
      ...(replyTo ? { replyTo } : {}),
    });
    return { success: true, id: result.data?.id };
  } catch (err: any) {
    console.error('[email:error]', err.message);
    return { success: false, error: err.message };
  }
}

type TicketEmailArgs = {
  to: string;
  eventName: string;
  eventUrl: string;
  ticketType: string;
};

export async function sendTicketConfirmationEmail(args: TicketEmailArgs) {
  if (!resendKey) {
    console.log('[email stub] RESEND_API_KEY missing, would send:', args);
    return;
  }

  const resend = new Resend(resendKey);

  const subject = `${args.eventName} — Ticket Confirmed`;

  const html = `
  <div style="font-family: ui-sans-serif, system-ui, -apple-system; line-height:1.5; color:#0b0b0c;">
    <h2 style="margin:0 0 12px 0; font-weight:700;">Ticket confirmed</h2>
    <p style="margin:0 0 10px 0;">You're in for <b>${escapeHtml(args.eventName)}</b>.</p>
    <p style="margin:0 0 14px 0;">Ticket type: <b>${escapeHtml(args.ticketType)}</b></p>
    <a href="${args.eventUrl}" style="display:inline-block; padding:12px 16px; border-radius:999px; background:#0b0b0c; color:#fff; text-decoration:none;">
      View event details
    </a>
    <p style="margin:18px 0 0 0; font-size:12px; color:#555;">
      Launchpad — Event OS
    </p>
  </div>`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'Launchpad <no-reply@yourdomain.com>',
    to: args.to,
    subject,
    html,
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
