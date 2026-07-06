"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Menu } from "lucide-react";
import { nav, site } from "@/data/content";
import ThemeToggle from "@/components/ThemeToggle";
import { StaggerLabel } from "@/components/Button";

const MotionLink = motion.create(Link);

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The /work sphere gallery is immersive and draws its own chrome
  if (pathname === "/work") return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${
          scrolled
            ? "border-b border-line bg-bg/70 py-3 backdrop-blur-xl"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12">
          <Link
            href="/"
            className="font-display text-lg font-semibold tracking-tight"
            aria-label={`${site.name} — home`}
          >
            {site.name}
            <span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors hover:text-accent ${
                  pathname.startsWith(item.href) ? "text-accent" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <MotionLink
              href="/contact"
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <StaggerLabel text="Let's talk" />
            </MotionLink>
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line md:hidden"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[140] flex flex-col bg-bg px-6 py-6"
            initial={reduce ? { opacity: 0 } : { y: "-100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold">
                {site.name}
                <span className="text-accent">.</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
                aria-label="Close menu"
              >
                <X size={26} />
              </button>
            </div>

            <nav className="mt-14 flex flex-1 flex-col gap-2" aria-label="Mobile">
              {nav.map((item, i) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={reduce ? false : { y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={`font-display text-5xl font-medium tracking-tight transition-colors hover:text-accent ${
                        pathname.startsWith(item.href) ? "text-accent" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              className="flex items-center justify-between border-t border-line pt-6"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href={`mailto:${site.email}`} className="font-mono text-xs text-muted">
                {site.email}
              </a>
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
