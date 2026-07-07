"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, LayoutGrid } from "lucide-react";
import { galleryItems, site } from "@/data/content";
import Clock from "@/components/Clock";
import { StaggerLabel } from "@/components/Button";

const MotionLink = motion.create(Link);

// Three.js only ever runs on the client
const SphereGallery = dynamic(() => import("./SphereGallery"), { ssr: false });

type Mode = "sphere" | "list";

const chromeNav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export default function WorkClient() {
  // null until we know whether this device should get WebGL
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    setMode(reduced || !hasWebGL ? "list" : "sphere");
  }, []);

  return (
    <div className={mode === "sphere" ? "relative h-[100dvh] overflow-hidden bg-bg" : "min-h-screen bg-bg"}>
      {mode === "sphere" && <SphereGallery items={galleryItems} />}

      {mode === "list" && <ListView />}

      {/* ── UI chrome over the gallery ── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          className="pointer-events-auto font-display text-lg font-semibold tracking-tight"
          aria-label={`${site.name} — home`}
        >
          {site.name}
          <span className="text-accent">.</span>
        </Link>
        <p className="hidden font-mono text-xs uppercase tracking-[0.25em] text-muted md:block">
          {site.studioLine}
        </p>
        <div className="pointer-events-auto flex items-center gap-5">
          <Clock className="hidden sm:inline" />
          <MotionLink
            href="/contact"
            initial="rest"
            animate="rest"
            whileHover="hover"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <StaggerLabel text="Let's talk" />
          </MotionLink>
        </div>
      </div>

      {/* floating pill nav, bottom-center */}
      <nav
        className="pointer-events-auto fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-surface/80 p-1.5 backdrop-blur-xl"
        aria-label="Gallery navigation"
      >
        {chromeNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-3 py-2 text-xs transition-colors sm:px-4 sm:text-sm ${
              item.href === "/work" ? "bg-accent text-white" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* view toggles, bottom-left */}
      {/* stacked above the pill nav on phones, bottom-left on desktop */}
      <div className="pointer-events-auto fixed bottom-[4.75rem] left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-surface/80 p-1.5 backdrop-blur-xl md:bottom-6 md:left-10 md:translate-x-0">
        <button
          type="button"
          onClick={() => setMode("sphere")}
          aria-label="Sphere view"
          aria-pressed={mode === "sphere"}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            mode === "sphere" ? "bg-accent text-white" : "text-muted hover:text-ink"
          }`}
        >
          <Globe size={15} />
        </button>
        <button
          type="button"
          onClick={() => setMode("list")}
          aria-label="List view"
          aria-pressed={mode === "list"}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            mode === "list" ? "bg-accent text-white" : "text-muted hover:text-ink"
          }`}
        >
          <LayoutGrid size={15} />
        </button>
      </div>
    </div>
  );
}

/** Flat fallback grid — mobile-friendly, reduced-motion-friendly, no WebGL needed. */
function ListView() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-40 pt-28 md:px-10">
      <h1 className="sr-only">Selected work</h1>
      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            data-cursor="View"
            className="group bg-bg p-5 transition-colors hover:bg-surface"
          >
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                {item.caption}
              </span>
              <span className="truncate text-sm">{item.title}</span>
            </div>
            <div className="relative aspect-[8/5] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="font-mono text-xs text-accent">{item.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
