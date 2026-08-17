"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DURATION = 1400; // 000 → 100 in ~1.4s
const EASE = [0.76, 0, 0.24, 1] as const;

// EXIF-style status line, swapped as the counter climbs
const STATUS = ["Calibrating lens", "Metering light", "Developing frames"];

/**
 * First-visit preloader, built from the site's camera language: a centred
 * viewfinder frame with crimson corner ticks, a blinking REC dot, a 000→100
 * counter and a filling exposure line. It exits like a shutter opening —
 * the content fades, then the screen splits apart from the middle.
 *
 * Plays once per browser session (sessionStorage flag). Skipped entirely
 * for reduced-motion users.
 */
export default function Preloader() {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("preloader-shown")) return;

    setShow(true);
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      // ease-out so the counter sprints early and settles at the end
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("preloader-shown", "1");
        setDone(true);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const status = STATUS[Math.min(Math.floor(count / 34), STATUS.length - 1)];

  return (
    <AnimatePresence>
      {show && !done && (
        <motion.div key="preloader" className="fixed inset-0 z-[180]" aria-hidden>
          {/* shutter halves — split apart on exit */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-bg"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[50.5%] bg-bg"
            exit={{ y: "100%" }}
            transition={{ duration: 0.75, delay: 0.2, ease: EASE }}
          />

          {/* viewfinder */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative w-full max-w-[min(78vw,540px)] border border-line p-5 md:p-7"
            >
              {/* crimson corner ticks */}
              <span className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-accent" />
              <span className="absolute -right-px -top-px h-5 w-5 border-r-2 border-t-2 border-accent" />
              <span className="absolute -bottom-px -left-px h-5 w-5 border-b-2 border-l-2 border-accent" />
              <span className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-accent" />

              {/* top row: wordmark · REC */}
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                <span>Aksh Patel</span>
                <span className="flex items-center gap-2">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-accent"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Rec
                </span>
              </div>

              {/* counter */}
              <div className="flex items-end justify-between gap-4 py-8 md:py-10">
                <span className="font-display text-[clamp(3.5rem,11vw,7rem)] font-medium leading-[0.85] tabular-nums">
                  {String(count).padStart(3, "0")}
                  <span className="text-accent">%</span>
                </span>
                <span className="hidden pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:block">
                  St. John&apos;s, NL
                </span>
              </div>

              {/* exposure line */}
              <div className="h-px w-full bg-line">
                <div
                  className="h-px bg-accent transition-[width] duration-100 ease-linear"
                  style={{ width: `${count}%` }}
                />
              </div>

              {/* status */}
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                <span>{status}</span>
                <span>f/1.8</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
