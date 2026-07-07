"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Mail } from "lucide-react";
import { footerNav, site } from "@/data/content";
import Clock from "@/components/Clock";
import ThemeToggle from "@/components/ThemeToggle";

export default function Footer() {
  const pathname = usePathname();

  // The /work sphere gallery is a fullscreen experience — no footer there
  if (pathname === "/work") return null;

  return (
    <footer className="hairline-t mt-24 md:mt-32">
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12">
        <div className="flex flex-col gap-14 md:flex-row md:justify-between">
          {/* Big wordmark */}
          <div className="max-w-md">
            <Link
              href="/"
              className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-none tracking-tight"
            >
              {site.name}
              <span className="text-accent">.</span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Websites and photographs made in {site.city}. Every brand has a
              story — I help you tell it, in pixels and in light.
            </p>
          </div>

          <div className="flex gap-16 md:gap-24">
            <nav aria-label="Explore">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Explore
              </h3>
              <ul className="space-y-3">
                {footerNav.explore.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm transition-colors hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Connect">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Connect
              </h3>
              <ul className="space-y-3">
                {footerNav.connect.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm transition-colors hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Elsewhere
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={site.instagram}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-accent"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={14} /> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-accent"
                  >
                    <Mail size={14} /> Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 md:flex-row md:items-center">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} {site.name} — all stories reserved
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              {site.city} —
            </span>
            <Clock />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
