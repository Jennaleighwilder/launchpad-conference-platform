import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();

    if (!data.event) {
      return { title: 'Event Not Found' };
    }

    const event = data.event;
    const title = event.name;
    const description = event.tagline || event.description || `${event.name} — ${event.city}, ${event.date}`;

    return {
      title: `${title} | Launchpad`,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${baseUrl}/e/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return { title: 'Event | Launchpad' };
  }
}

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
