"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { hero } from "@/data/content";
import Button from "@/components/Button";

/**
 * The "dual-lens" hero. Hovering the crimson word ("story") crossfades the
 * background between the web-design state and the photography state.
 * On touch devices it auto-crossfades every 5s.
 */
export default function Hero() {
  const [photoMode, setPhotoMode] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // parallax: media scrolls at ~0.88x
  const mediaY = useTransform(scrollY, [0, 900], [0, reduce ? 0 : 110]);

  useEffect(() => {
    // auto-crossfade on touch devices (no hover available)
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    const id = setInterval(() => setPhotoMode((v) => !v), 5000);
    return () => clearInterval(id);
  }, []);

  // headline split, with the *accent* word as the interactive trigger
  const words = hero.headline.split(" ");

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* layered fullscreen media — web state / photography state */}
      <motion.div className="absolute inset-0" style={{ y: mediaY }} aria-hidden>
        <div className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={hero.webImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1200ms] ease-out ${
              photoMode ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* REPLACE: your photography-state hero image */}
          <Image
            src={hero.photoImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1200ms] ease-out ${
              photoMode ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24">
        <motion.p
          className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-muted"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="max-w-5xl font-display text-display-1 font-medium">
          {words.map((word, i) => {
            const accented = word.startsWith("*");
            const clean = word.replace(/\*/g, "");
            return (
              <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.35 + i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                >
                  {accented ? (
                    <em
                      className="cursor-pointer italic text-accent transition-colors hover:text-accent-hover"
                      onMouseEnter={() => setPhotoMode(true)}
                      onMouseLeave={() => setPhotoMode(false)}
                      onFocus={() => setPhotoMode(true)}
                      onBlur={() => setPhotoMode(false)}
                      tabIndex={0}
                      role="switch"
                      aria-checked={photoMode}
                      aria-label="Toggle photography backdrop"
                    >
                      {clean}
                    </em>
                  ) : (
                    clean
                  )}
                </motion.span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            );
          })}
        </h1>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button href={hero.ctaPrimary.href} variant="ghost">
            {hero.ctaPrimary.label}
          </Button>
          <Button href={hero.ctaSecondary.href} variant="ghost">
            {hero.ctaSecondary.label}
          </Button>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-8 right-8 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        aria-hidden
      >
        Scroll
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={12} className="text-accent" />
        </motion.span>
      </motion.div>
    </section>
  );
}
