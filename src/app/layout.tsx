import type { Metadata } from "next";
import "./globals.css";
import { DemoBanner } from "./DemoBanner";
import { AuthProvider } from "@/components/AuthProvider";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { AccessibilityToggle } from "@/components/AccessibilityToggle";
import { AccessibilityBody } from "@/components/AccessibilityBody";
import { LiveChat } from "@/components/LiveChat";

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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Orbitron:wght@400;500;600;700&family=Share+Tech+Mono&family=Lexend:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Archivo+Black&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Sora:wght@400;500;600;700&family=Bebas+Neue&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,wght@0,400;0,600;0,700;1,400&family=Poiret+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <AccessibilityProvider>
            <AccessibilityBody />
            <DemoBanner />
            {children}
            <AccessibilityToggle />
            <LiveChat />
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
