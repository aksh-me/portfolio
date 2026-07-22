"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { hero, site } from "@/data/content";
import type { Hero as HeroContent } from "@/lib/validations";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

/**
 * Hero, rebuilt to speak the site's own language: type-led on the left
 * (the same masked-reveal heading + crimson accent used across every
 * section), and the photo carousel disciplined inside a hairline-framed
 * "viewfinder" card on the right — contained imagery, not full-bleed.
 *
 * The card keeps the signature camera feel (corner ticks, focus reticle,
 * a REC dot, live EXIF and a slide counter) and auto-advances every 6s
 * with arrows to navigate. Reduced-motion users get a plain crossfade
 * and no autoplay.
 */

const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function Hero({ content }: { content?: HeroContent }) {
  // editable text comes from the CMS (falls back to the static file); the
  // carousel slides are not yet editable, so they stay in data/content.ts
  const c = content ?? hero;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const count = hero.slides.length;
  const slide = hero.slides[index];

  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  // auto-advance; every navigation resets the timer
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => go(1), 6000);
    return () => clearTimeout(id);
  }, [index, reduce, go]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-start px-6 pb-16 pt-32 md:px-12 md:pt-40 lg:justify-center">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ── left: type ── */}
        <div>
          <SectionHeading as="h1" size="display-2" eyebrow={c.eyebrow} title={c.headline} />
          <Reveal delay={0.15} className="mt-8 max-w-md">
            <p className="text-base leading-relaxed text-muted md:text-lg">{c.sub}</p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center gap-3">
            <Button href={c.ctaPrimary.href} variant="solid">
              {c.ctaPrimary.label}
            </Button>
            <Button href={c.ctaSecondary.href} variant="ghost">
              {c.ctaSecondary.label}
            </Button>
          </Reveal>
        </div>

        {/* ── right: framed viewfinder carousel ── */}
        <Reveal delay={0.2}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-surface sm:aspect-[4/3] lg:aspect-[16/13]">
            {/* crossfading slide */}
            <AnimatePresence>
              <motion.div
                key={index}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.4 : 1.1, ease }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* scrims so the mono UI stays legible over any frame */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />

            {/* viewfinder frame (square, centred) */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[42%] max-w-[280px] -translate-x-1/2 -translate-y-1/2"
            >
              <span className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-accent" />
              <span className="absolute -right-px -top-px h-6 w-6 border-r-2 border-t-2 border-accent" />
              <span className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-accent" />
              <span className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-accent" />
              <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent" />
            </div>

            {/* REC status, top-left */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <motion.span
                className="h-2 w-2 rounded-full bg-accent"
                animate={reduce ? undefined : { opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/85">
                {site.city}
              </span>
            </div>

            {/* arrows (contained inside the card — can't overlap page content) */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRight size={17} />
            </button>

            {/* bottom bar: live EXIF + slide counter */}
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/85"
                >
                  {slide.caption}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/85">
                <span className="text-accent">{pad(index)}</span> / {pad(count - 1)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
