"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { photos } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

/**
 * Horizontally draggable film strip of 8 photos with a scroll-linked drift
 * and a curved-screen (sphere-like) projection: cards at the screen edges
 * tilt toward the viewer and stretch, the center pinches slightly away —
 * like standing inside a curved wall of prints. The per-card transform is
 * recomputed every frame from the card's distance to the viewport center,
 * so the curve holds while dragging and scrolling.
 */
export default function PhotoStrip({ photosData }: { photosData?: typeof photos }) {
  const currentPhotos = photosData || photos;
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [dragWidth, setDragWidth] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const driftX = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -100]);

  useEffect(() => {
    const measure = () => {
      const el = stripRef.current;
      if (el) setDragWidth(Math.max(el.scrollWidth - el.clientWidth, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // the curved-screen projection loop
  useEffect(() => {
    if (reduce) return;
    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const mid = window.innerWidth / 2;
      for (const card of cardRefs.current) {
        if (!card) continue;
        const r = card.getBoundingClientRect();
        if (r.right < -200 || r.left > window.innerWidth + 200) continue; // offscreen
        // n: -1 at left edge of screen, 0 center, +1 at right edge
        const n = Math.max(-1.2, Math.min(1.2, (r.left + r.width / 2 - mid) / mid));
        const rotate = -n * 26; // outer edge swings toward the viewer
        const scale = 0.94 + Math.abs(n) * 0.16; // edges stretch, center pinches
        card.style.transform = `perspective(1200px) rotateY(${rotate}deg) scale(${scale})`;
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduce]);

  // featured shots span all categories, so the strip stays varied
  const strip = currentPhotos.filter((p) => p.featured).slice(0, 8);

  return (
    <section ref={sectionRef} className="overflow-hidden pt-28 md:pt-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionHeading eyebrow="Photography" title="Frames from the *field*" />
      </div>

      <div className="mt-14">
        {/* Clip first, then drift INSIDE the clip so the parallax can never
            expose the page background on the right edge. */}
        <div ref={stripRef} className="overflow-hidden px-6 py-8 md:px-12">
          <motion.div style={{ x: driftX }} className="w-max">
            <motion.div
              className="flex w-max cursor-grab items-center gap-5 active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -dragWidth, right: 0 }}
              dragElastic={0.08}
              dragTransition={{ power: 0.25, timeConstant: 220 }}
            >
              {strip.map((photo, i) => (
              <figure
                key={photo.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="w-[240px] shrink-0 select-none will-change-transform md:w-[320px]"
              >
                <div className="pointer-events-none relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 240px, 320px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {photo.category}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-muted">{photo.exif}</span>
                </figcaption>
              </figure>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Reveal className="mx-auto mt-14 max-w-[1600px] px-6 md:px-12">
        <Link
          href="/photography"
          className="group inline-flex items-center gap-3 font-display text-xl font-medium transition-colors hover:text-accent md:text-2xl"
        >
          Enter the gallery
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" size={22} />
        </Link>
      </Reveal>
    </section>
  );
}
