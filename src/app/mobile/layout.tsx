import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Launchpad Mobile — AI Conferences",
  description: "Generate conferences in 60 seconds. Mobile-first.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="mobile-app"
      style={{
        minHeight: "100dvh",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </div>
  );
}
