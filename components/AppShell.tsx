"use client";

import { usePathname } from "next/navigation";
import LenisProvider from "@/components/providers/LenisProvider";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Wraps the app in the site chrome (smooth scroll, cursor, preloader, nav,
 * footer) — EXCEPT on /admin, where the Sanity Studio owns the whole screen
 * and none of that chrome should appear.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
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
  );
}
