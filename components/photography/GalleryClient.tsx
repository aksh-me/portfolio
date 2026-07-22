"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { photos, type PhotoCategory } from "@/data/content";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";

const filters = ["All", "Portraits", "Streets", "Nature", "Cars"] as const;

export default function GalleryClient({ photosData }: { photosData?: typeof photos }) {
  const currentPhotos = photosData || photos;
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visible =
    filter === "All" ? currentPhotos : currentPhotos.filter((p) => p.category === (filter as PhotoCategory));

  return (
    <>
      {/* category filter pills */}
      <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter photos by category">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => {
              setFilter(f);
              setLightboxIndex(null);
            }}
            aria-pressed={filter === f}
            className={`rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              filter === f
                ? "border-accent bg-accent text-white"
                : "border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* masonry via CSS columns */}
      <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((photo, i) => (
          <Reveal key={photo.id} delay={(i % 3) * 0.06} className="mb-5 break-inside-avoid">
            <motion.button
              type="button"
              layoutId={photo.id}
              onClick={() => setLightboxIndex(i)}
              data-cursor="Open"
              className="group block w-full text-left"
              aria-label={`Open photo: ${photo.alt}`}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: `${photo.w} / ${photo.h}` }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={i < 3}
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {photo.category}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-muted">{photo.exif}</span>
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        photos={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
