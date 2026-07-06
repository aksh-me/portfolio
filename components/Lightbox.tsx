"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/data/content";

type LightboxProps = {
  photos: Photo[];
  index: number | null; // null = closed
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Custom lightbox: layoutId zoom from the grid, keyboard arrows, ESC to
 * close, EXIF caption in mono.
 */
export default function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const photo = index !== null ? photos[index] : null;

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, onClose, prev, next]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-sm md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close lightbox"
            className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent md:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent md:flex"
          >
            <ChevronRight size={20} />
          </button>

          <motion.figure
            layoutId={photo.id}
            className="relative max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              className="max-h-[80vh] w-auto rounded-sm object-contain"
              priority
            />
            <figcaption className="mt-4 flex items-center justify-between gap-6">
              <span className="text-sm text-muted">{photo.alt}</span>
              <span className="font-mono text-xs tracking-widest text-muted">{photo.exif}</span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
