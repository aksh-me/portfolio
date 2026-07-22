"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Globe, LayoutGrid } from "lucide-react";
import { projects, photos, GalleryItem } from "@/data/content";
import Clock from "@/components/Clock";
import { StaggerLabel } from "@/components/Button";

const MotionLink = motion.create(Link);

const SphereGallery = dynamic(() => import("./SphereGallery"), { ssr: false });

type Mode = "sphere" | "list";

const chromeNav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export default function WorkClient({
  projectsData,
  photosData,
}: {
  projectsData?: typeof projects;
  photosData?: typeof photos;
}) {
  const [mode, setMode] = useState<Mode | null>(null);

  const currentProjects = projectsData || projects;
  const currentPhotos = photosData || photos;

  const items: GalleryItem[] = [
    ...currentProjects.map((p) => ({
      id: `pr-${p.slug}`,
      caption: (p.client || "").toUpperCase(),
      title: p.title,
      tags: p.tags,
      year: p.year,
      image: p.hero.replace("/1600/1000", "/800/500"),
      href: `/work/${p.slug}`,
    })),
    ...currentPhotos
      .filter((p) => p.featured)
      .map((p) => ({
        id: p.id,
        caption: p.category.toUpperCase(),
        title: p.alt,
        tags: ["PHOTO", p.category.toUpperCase()],
        year: "2025",
        image: p.src.startsWith("http")
          ? p.src
          : `/_next/image?url=${encodeURIComponent(p.src)}&w=750&q=70`,
        href: "/photography",
      })),
  ];

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
      {mode === "sphere" && <SphereGallery items={items} />}

      {mode === "list" && <ListView items={items} />}

      {/* ── UI chrome over the gallery ── */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between p-6 md:p-12">
        <MotionLink
          href="/"
          data-cursor="Home"
          className="pointer-events-auto group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-fg transition-opacity hover:opacity-80"
          whileTap={{ scale: 0.96 }}
        >
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <StaggerLabel text="AKSH PATEL" />
        </MotionLink>

        <div className="pointer-events-auto flex items-center gap-6 md:gap-10">
          <nav className="hidden items-center gap-8 md:flex">
            {chromeNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg"
              >
                <StaggerLabel text={link.label} />
              </Link>
            ))}
          </nav>

          <Clock />

          <button
            onClick={() => setMode((m) => (m === "sphere" ? "list" : "sphere"))}
            className="flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-fg backdrop-blur-md transition-colors hover:bg-surface"
          >
            {mode === "sphere" ? (
              <>
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid view</span>
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5 text-accent" />
                <span className="hidden sm:inline">3D Sphere</span>
              </>
            )}
          </button>
        </div>
      </header>

      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex items-center justify-between p-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:p-12">
        <span>St. John's, NL</span>
        <span className="hidden sm:inline">
          {mode === "sphere" ? "Drag to rotate · Click to inspect" : "All work"}
        </span>
        <span>{items.length} cards</span>
      </footer>
    </div>
  );
}

function ListView({ items }: { items: GalleryItem[] }) {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-32 md:px-12 md:pt-40">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Selected work</p>
          <h1 className="mt-2 text-3xl font-light md:text-5xl">Websites & photography</h1>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {items.length} projects & featured shots
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
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
