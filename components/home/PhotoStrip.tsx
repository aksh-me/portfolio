"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { photos } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

/** Horizontally draggable film strip of 8 photos, with a scroll-linked drift. */
export default function PhotoStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const driftX = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);

  useEffect(() => {
    const measure = () => {
      const el = stripRef.current;
      if (el) setDragWidth(Math.max(el.scrollWidth - el.clientWidth, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const strip = photos.slice(0, 8);

  return (
    <section ref={sectionRef} className="overflow-hidden pt-28 md:pt-40">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionHeading eyebrow="Photography" title="Frames from the *field*" />
      </div>

      <motion.div style={{ x: driftX }} className="mt-14">
        <div ref={stripRef} className="overflow-hidden px-6 md:px-12">
          <motion.div
            className="flex w-max cursor-grab gap-5 active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ power: 0.25, timeConstant: 220 }}
          >
            {strip.map((photo) => (
              <figure key={photo.id} className="w-[240px] shrink-0 select-none md:w-[320px]">
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
        </div>
      </motion.div>

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
