import type { Metadata } from "next";
import "./globals.css";
import { DemoBanner } from "./DemoBanner";

export const metadata: Metadata = {
  title: "Launchpad — AI-Powered Conference Generator",
  description: "Generate a complete conference page in 60 seconds. Drop your topic, city, and date — AI builds the rest.",
  openGraph: {
    title: "Launchpad — One-Click Conference Generation",
    description: "AI builds your entire event: speakers, schedule, venue, tickets. Live in 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
