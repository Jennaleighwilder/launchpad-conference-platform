import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://launchpad-conference-platform.vercel.app';

/** AI Festival UK 2026 — venue/tech image for link previews (not a speaker photo) */
const OG_IMAGE = 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop';

export const metadata: Metadata = {
  title: 'AI Festival UK 2026 | Launchpad',
  description: "The UK's premier AI festival. Two days at West Suffolk College's STEM Centre (£2M XR Lab). May 27–28, 2026 · Bury St Edmunds.",
  openGraph: {
    title: 'AI Festival UK 2026',
    description: "10 tracks · 2 days · Bury St Edmunds. Energy, Quantum, Robotics, Cyber, Healthcare, Creative, XR, Agriculture, PitchFest.",
    type: 'website',
    url: `${baseUrl}/e/ai-festival-uk-2026`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'AI Festival UK 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Festival UK 2026',
    description: "10 tracks · 2 days · Bury St Edmunds. The UK's premier AI festival.",
    images: [OG_IMAGE],
  },
};

export default function AIFestivalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
