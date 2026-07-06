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
    default: `${site.name} — Web Designer & Photographer in ${site.city}`,
    template: `%s — ${site.name}`,
  },
  description:
    "I build websites and chase light. Web design and photography for brands and people with a story to tell.",
  openGraph: {
    title: `${site.name} — Web Designer & Photographer`,
    description: "Websites and photographs with a storyteller's eye.",
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: "https://picsum.photos/id/1015/1200/630", width: 1200, height: 630, alt: `${site.name} portfolio` }],
  },
  twitter: {
    card: "summary_large_image",
  },
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
      </body>
    </html>
  );
}
