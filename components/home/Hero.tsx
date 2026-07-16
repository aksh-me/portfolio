"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Instagram, Mail } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero, site } from "@/data/content";
import Button from "@/components/Button";

/**
 * Editorial hero: full-bleed golden-hour portrait, a viewfinder frame over
 * the subject, and the name set gigantic and cropped by the bottom edge.
 *
 * The dual-lens signature survives the redesign: hovering the big name
 * crossfades the backdrop from the portrait (photographer state) to the
 * red-car long exposure (web/design state). Touch devices auto-crossfade.
 */
export default function Hero() {
  const [altMode, setAltMode] = useState(false); // false = portrait, true = web state
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // parallax: media scrolls at ~0.9x
  const mediaY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 90]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const id = setInterval(() => setAltMode((v) => !v), 5000);
    return () => clearInterval(id);
  }, []);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* ── layered fullscreen media ── */}
      <motion.div className="absolute inset-0" style={{ y: mediaY }} aria-hidden>
        <div className="absolute -inset-y-[6%] inset-x-0">
          <Image
            src={hero.photoImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover object-[50%_30%] transition-opacity duration-[1200ms] ease-out ${
              altMode ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={hero.webImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1200ms] ease-out ${
              altMode ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        {/* legibility scrims — light at the top for the nav, heavier at the base */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg via-bg/35 to-transparent" />
      </motion.div>

      {/* ── content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-6 pt-28 md:px-12 md:pt-32">
        {/* top row: disciplines (left) · socials (right) */}
        <div className="flex items-start justify-between">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="max-w-[16rem] font-body text-sm leading-relaxed text-ink/90 md:text-base"
          >
            {hero.disciplines.map((d, i) => (
              <span key={d}>
                {d} {i < hero.disciplines.length - 1 && <span className="text-accent">/ </span>}
              </span>
            ))}
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              {hero.location}
            </span>
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <a
              href={site.instagram}
              rel="noopener noreferrer"
              target="_blank"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/40 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
            >
              <Instagram size={17} />
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="Email me"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/40 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
            >
              <Mail size={17} />
            </a>
          </motion.div>
        </div>

        {/* viewfinder frame over the subject — outer div owns the centering
            transform; the motion div animates inside it (framer would
            otherwise overwrite the translate) */}
        <div className="pointer-events-none absolute left-1/2 top-[27%] hidden -translate-x-1/2 md:block">
        <motion.div
          aria-hidden
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={{
            opacity: altMode ? 0 : 1,
            scale: 1,
            y: reduce ? 0 : [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.7, delay: reduce ? 0 : 0.9 },
            scale: { duration: 1, delay: 0.9, ease },
            y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.8 },
          }}
        >
          <div className="relative h-[clamp(180px,24vw,300px)] w-[clamp(180px,24vw,300px)] border border-white/60">
            {/* corner ticks */}
            <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-accent" />
            <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-accent" />
            <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-accent" />
            <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-accent" />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
            {hero.frameCaption}
          </p>
        </motion.div>
        </div>

        {/* bottom block: CTAs · greeting · giant cropped name */}
        <div className="mt-auto">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <Button href={hero.ctaPrimary.href} variant="ghost" className="!bg-bg/30 backdrop-blur-md">
              {hero.ctaPrimary.label}
            </Button>
            <Button href={hero.ctaSecondary.href} variant="ghost" className="!bg-bg/30 backdrop-blur-md">
              {hero.ctaSecondary.label}
            </Button>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-ink/80 md:text-sm"
          >
            {hero.greeting}
          </motion.p>
        </div>
      </div>

      {/* the giant name — full-bleed, cropped by the section's bottom edge */}
      <div className="relative z-10 overflow-hidden" aria-hidden={false}>
        <motion.h1
          aria-label={site.name}
          onMouseEnter={() => setAltMode(true)}
          onMouseLeave={() => setAltMode(false)}
          initial={reduce ? false : { y: "55%", opacity: 0 }}
          animate={{ y: "14%", opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.85, ease }}
          className="w-full select-none text-center font-display font-semibold leading-[0.8] tracking-[-0.04em] text-[clamp(6rem,25.5vw,25rem)] text-transparent"
          style={{
            // theme-aware: letters fade from translucent to solid ink so they
            // read on the crimson car, the portrait, and both theme scrims
            backgroundImage:
              "linear-gradient(to bottom, color-mix(in srgb, var(--text) 55%, transparent), color-mix(in srgb, var(--text) 95%, transparent) 55%, var(--text))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          {hero.bigName}
        </motion.h1>
      </div>
    </section>
  );
}
