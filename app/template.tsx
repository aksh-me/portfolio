"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page transition: a quick crimson-tinted curtain wipe + content fade on
 * every route change (template.tsx remounts per navigation).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[150] bg-surface"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        style={{ transformOrigin: "top" }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
}
