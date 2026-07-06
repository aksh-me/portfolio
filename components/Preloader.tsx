"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const DURATION = 1300; // 0 → 100 in ~1.3s, well under the 1.5s budget

/**
 * First-visit preloader: a 0→100 counter in mono, then a curtain wipe.
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

  return (
    <AnimatePresence>
      {show && !done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[180] flex items-end justify-between bg-bg p-6 md:p-12"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Loading the story
          </span>
          <span className="font-display text-[clamp(4rem,12vw,9rem)] leading-none tabular-nums">
            {count}
            <span className="text-accent">%</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
