import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, message, company } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message required' }, { status: 400 });
    }

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Launchpad <no-reply@yourdomain.com>',
        to: process.env.CONTACT_EMAIL || 'hello@launchpad.events',
        replyTo: email,
        subject: `Contact: ${name}${company ? ` (${company})` : ''}`,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\n\n${message}`,
      });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createServiceClient } = await import('@/lib/supabase');
        const supabase = createServiceClient();
        await supabase.from('contact_submissions').insert({ name, email, message, company: company || null });
      } catch {
        /* table may not exist yet */
      }
    }

    console.log('[contact]', { name, email, company, message: message.slice(0, 100) });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[contact]', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
