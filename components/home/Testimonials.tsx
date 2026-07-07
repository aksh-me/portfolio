"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/data/content";

/** One quote at a time, auto-rotating with a soft fade. */
export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (testimonials.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  // Nothing to show until the first testimonial is added in data/content.ts
  if (testimonials.length === 0) return null;

  const t = testimonials[index];

  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-40" aria-label="Client testimonials">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Kind words</p>
      <div className="relative mt-10 min-h-[16rem] md:min-h-[14rem]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="max-w-4xl font-display text-2xl font-medium leading-snug md:text-4xl">
              <span className="text-accent">“</span>
              {t.quote}
              <span className="text-accent">”</span>
            </p>
            <footer className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {t.name} — {t.role}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex gap-2" role="tablist" aria-label="Choose testimonial">
        {testimonials.map((item, i) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Testimonial from ${item.name}`}
            onClick={() => setIndex(i)}
            className={`h-1 w-10 rounded-full transition-colors ${
              i === index ? "bg-accent" : "bg-line hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
