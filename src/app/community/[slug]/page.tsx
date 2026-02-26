import Link from 'next/link';
import { notFound } from 'next/navigation';

const THREADS: Record<string, { title: string; category: string; author: string; content: string; replies: { author: string; content: string }[] }> = {
  'custom-branding': { title: 'How do I add custom branding to my event?', category: 'Getting Started', author: 'sarah_m', content: 'I want to add our company logo and colors to the generated event page. Is there a way to do this in the current version?', replies: [{ author: 'Launchpad Team', content: 'Custom branding is available on the Growth plan and above. Go to Event Settings > Branding to upload your logo and set accent colors.' }] },
  'multi-day-venues': { title: 'Feature request: Multi-day events with different venues', category: 'Feature Requests', author: 'marcus_k', content: 'We run 3-day conferences where each day is at a different venue. Would love to see this supported.', replies: [] },
  '500-person-summit': { title: 'We ran a 500-person summit with Launchpad — AMA', category: 'Show & Tell', author: 'priya_dev', content: 'Just wrapped our biggest event yet. Happy to answer any questions about scaling, check-in, or the overall experience.', replies: [] },
  'stripe-webhook': { title: 'Stripe webhook not firing after payment', category: 'Bug Reports', author: 'james_w', content: 'Payments go through but we\'re not getting the webhook. Checked the URL and secret. Any ideas?', replies: [] },
  'speaker-curation': { title: 'Best practices for speaker curation', category: 'Getting Started', author: 'ana_c', content: 'What tips do you have for picking speakers that match your event vibe?', replies: [] },
  'salesforce-integration': { title: 'Integrate with our CRM (Salesforce)', category: 'Feature Requests', author: 'tech_lead', content: 'We need to sync attendees to Salesforce. Is there an integration or API for this?', replies: [] },
  '3-months-saved': { title: 'Launchpad saved us 3 months of planning', category: 'Show & Tell', author: 'startup_founder', content: 'Our team was dreading the annual offsite. Launchpad had a draft in an hour. Incredible.', replies: [] },
  'qr-ios': { title: 'QR check-in not working on iOS', category: 'Bug Reports', author: 'mobile_dev', content: 'The QR scanner works on Android but fails on iPhone. Anyone else seeing this?', replies: [] },
  'first-event': { title: 'First event in 60 seconds — here\'s what we learned', category: 'Show & Tell', author: 'event_newbie', content: 'We\'re first-time event organizers. Launchpad made it so easy. Sharing our experience for other newbies.', replies: [] },
  'api-rate-limits': { title: 'API rate limits?', category: 'Getting Started', author: 'api_user', content: 'What are the rate limits for the events API? Building an integration.', replies: [] },
  'white-label': { title: 'White-label / remove Launchpad branding', category: 'Feature Requests', author: 'agency_owner', content: 'We\'re an agency. Need to white-label the event pages for our clients.', replies: [] },
  'csv-export': { title: 'Export attendee list to CSV', category: 'Feature Requests', author: 'data_analyst', content: 'How do I export the attendee list? Need it for our CRM.', replies: [] },
};

export default async function CommunityThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const thread = THREADS[slug];
  if (!thread) notFound();

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/community" className="text-sm mb-8 inline-block" style={{ color: 'var(--color-accent)' }}>← Back to Community</Link>
        <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(79,255,223,0.15)', color: 'var(--color-accent)' }}>{thread.category}</span>
        <h1 className="text-2xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)' }}>{thread.title}</h1>
        <div className="p-6 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="mb-4" style={{ color: 'var(--color-text)' }}>{thread.content}</p>
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>by {thread.author}</span>
        </div>
        {thread.replies.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Replies</h3>
            {thread.replies.map((r, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="mb-2" style={{ color: 'var(--color-text)' }}>{r.content}</p>
                <span className="text-sm" style={{ color: 'var(--color-accent)' }}>{r.author}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
