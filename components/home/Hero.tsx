"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Instagram, Mail } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero, site } from "@/data/content";
import Button from "@/components/Button";

/**
 * Editorial hero with a two-plane carousel.
 *
 * The signature transition: the backdrop (defocused) and the viewfinder
 * window (sharp) are two aligned copies of the same slide, and they wipe in
 * OPPOSITE directions. Left arrow → the backdrop slides right-to-left while
 * the window content slides left-to-right; the right arrow mirrors it. Both
 * planes land on the same frame, so the focus illusion snaps back together.
 *
 * Arrows navigate, and the carousel auto-advances every 6s (paused for
 * reduced-motion users, who get plain crossfades instead of wipes).
 *
 * Hovering the giant name triggers a chromatic-glitch (see globals.css).
 */

const WIPE = { duration: 0.9, ease: [0.76, 0, 0.24, 1] as const };

// backdrop plane: new slide enters against the click direction…
const outsidePlane = {
  enter: (d: number) => ({ x: `${-d * 100}%` }),
  center: { x: "0%" },
  exit: (d: number) => ({ x: `${d * 100}%` }),
};
// …while the window plane travels the opposite way
const insidePlane = {
  enter: (d: number) => ({ x: `${d * 100}%` }),
  center: { x: "0%" },
  exit: (d: number) => ({ x: `${-d * 100}%` }),
};
const fadePlane = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Hero() {
  const [[index, dir], setSlide] = useState<[number, number]>([0, 1]);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 90]);

  const count = hero.slides.length;
  const slide = hero.slides[index];

  const paginate = useCallback(
    (d: number) => setSlide(([i]) => [(i + d + count) % count, d]),
    [count]
  );

  // auto-advance every 6s; every navigation (manual or auto) resets the clock
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => paginate(1), 6000);
    return () => clearTimeout(id);
  }, [index, reduce, paginate]);

  const ease = [0.16, 1, 0.3, 1] as const;
  const planeTransition = reduce ? { duration: 0.5 } : WIPE;
  const outside = reduce ? fadePlane : outsidePlane;
  const inside = reduce ? fadePlane : insidePlane;

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      // shared geometry for the sharp window + frame border (see globals.css)
      style={{ "--fs": "clamp(200px, 26vw, 340px)", "--ft": "24%" } as React.CSSProperties}
    >
      {/* ── two-plane carousel media ── */}
      <motion.div className="absolute inset-0" style={{ y: mediaY }} aria-hidden>
        <div className="absolute -inset-y-[6%] inset-x-0 overflow-hidden">
          {/* backdrop plane — sharp on phones, defocused on desktop */}
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={`out-${index}`}
              custom={dir}
              variants={outside}
              initial="enter"
              animate="center"
              exit="exit"
              transition={planeTransition}
              className="absolute inset-0 md:blur-[10px]"
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* window plane — static clip, moving content, opposite direction */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              clipPath:
                "inset(calc(var(--ft)) calc(50% - var(--fs) / 2) calc(100% - var(--ft) - var(--fs)) calc(50% - var(--fs) / 2))",
            }}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={`in-${index}`}
                custom={dir}
                variants={inside}
                initial="enter"
                animate="center"
                exit="exit"
                transition={planeTransition}
                className="absolute inset-0"
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* viewfinder frame + per-slide EXIF caption */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block" style={{ top: "var(--ft)" }}>
            <div className="relative h-[var(--fs)] w-[var(--fs)] border border-white/60">
              <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-accent" />
              <span className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2 border-accent" />
              <span className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-accent" />
              <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-accent" />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/70"
              >
                {slide.caption}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* static scrims: top vignette + base for the name */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg via-bg/35 to-transparent" />

      {/* carousel arrows */}
      <div className="absolute inset-x-4 top-1/2 z-20 flex -translate-y-1/2 justify-between md:inset-x-8">
        <button
          type="button"
          onClick={() => paginate(-1)}
          aria-label="Previous photo"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/40 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:h-12 md:w-12"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => paginate(1)}
          aria-label="Next photo"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg/40 text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:h-12 md:w-12"
        >
          <ChevronRight size={18} />
        </button>
      </div>

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

        {/* bottom block: CTAs · greeting */}
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

      {/* the giant name — cropped by the bottom edge; hover = chromatic glitch */}
      <div className="relative z-10 overflow-hidden">
        <motion.div
          initial={reduce ? false : { y: "55%", opacity: 0 }}
          animate={{ y: "14%", opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.85, ease }}
          className="hero-name relative w-full select-none text-center font-display font-semibold leading-[0.8] tracking-[-0.04em] text-[clamp(6rem,25.5vw,25rem)]"
        >
          {/* chromatic ghosts (activated on hover, see globals.css) */}
          <span aria-hidden className="glitch glitch-a absolute inset-0 text-accent">
            {hero.bigName}
          </span>
          <span aria-hidden className="glitch glitch-b absolute inset-0 text-[#2DE2E6]">
            {hero.bigName}
          </span>
          <h1
            aria-label={site.name}
            className="relative text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, color-mix(in srgb, var(--text) 55%, transparent), color-mix(in srgb, var(--text) 95%, transparent) 55%, var(--text))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {hero.bigName}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
