import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import LenisProvider from "@/components/providers/LenisProvider";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/data/content";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Photographer & Videographer in ${site.city}`,
    template: `%s — ${site.name}`,
  },
  description:
    "Photographer, videographer and web designer in St. John's, NL. Portraits, events, and websites with a storyteller's eye.",
  keywords: [
    "Aksh Patel",
    "photographer St. John's",
    "videographer Newfoundland",
    "portrait photography",
    "event photography",
    "web designer St. John's",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: `${site.name} — Photographer, Videographer & Web Designer`,
    description: "Photography, film and websites made in St. John's, NL.",
    url: site.url,
    siteName: site.name,
    locale: "en_CA",
    type: "website",
    images: [{ url: "/photos/cars/Image-1.jpg", width: 1200, height: 630, alt: `${site.name} — portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Photographer, Videographer & Web Designer`,
    description: "Photography, film and websites made in St. John's, NL.",
    images: ["/photos/cars/Image-1.jpg"],
  },
  // Add your token from Google Search Console (HTML-tag method) as
  // GOOGLE_SITE_VERIFICATION in Vercel, or paste it directly here.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
    { media: "(prefers-color-scheme: light)", color: "#F7F5F2" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable}`}
      style={{ ["--font-display" as string]: '"Clash Display", "Unbounded", sans-serif' }}
    >
      <body className="bg-bg font-body text-ink antialiased">
        <JsonLd />
        <ThemeProvider>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only z-[200] rounded-sm bg-accent px-4 py-2 font-mono text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            <Preloader />
            <Cursor />
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </LenisProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
