import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personality OS",
  description:
    "An infinitely explorable map of yourself — synthesizing Myers-Briggs, Enneagram, Insights Discovery, and Astrology into one unified personality profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
