"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "invert";
  className?: string;
  type?: "button" | "submit";
};

/* Hover pops every variant to a brand-color state */
const variants: Record<string, string> = {
  solid:
    "bg-accent text-white hover:bg-accent-hover",
  ghost:
    "border border-line text-ink hover:border-accent hover:bg-accent hover:text-white",
  invert:
    "bg-bg text-ink hover:text-accent",
};

/* Stagger-hover text: matches the Framer "Stagger Hover Button" module —
   per-character flip where the visible copy slides up and out while a
   duplicate rises in from below (blur 3px → 0), spring bounce 0 / 0.8s,
   ~0.035s stagger per character. */
const spring = { type: "spring", bounce: 0, duration: 0.8 } as const;

const charTop = {
  rest: (i: number) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { ...spring, delay: i * 0.02 },
  }),
  hover: (i: number) => ({
    y: "-115%",
    opacity: 0,
    filter: "blur(3px)",
    transition: { ...spring, delay: i * 0.035 },
  }),
};

const charBottom = {
  rest: (i: number) => ({
    y: "115%",
    opacity: 0,
    filter: "blur(3px)",
    transition: { ...spring, delay: i * 0.02 },
  }),
  hover: (i: number) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { ...spring, delay: 0.04 + i * 0.035 },
  }),
};

/**
 * Per-character stagger label. Must live inside a motion parent that sets
 * `initial="rest" whileHover="hover"` — the variant names propagate down.
 * Reusable on any pill/link, not just <Button>.
 */
export function StaggerLabel({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const chars = text.split("");

  if (reduce) return <span>{text}</span>;

  return (
    <span className="relative inline-block overflow-hidden">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block whitespace-pre">
        {chars.map((char, i) => (
          <motion.span key={i} custom={i} variants={charTop} className="inline-block">
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </span>
      <span aria-hidden className="absolute inset-0 inline-block whitespace-pre">
        {chars.map((char, i) => (
          <motion.span key={i} custom={i} variants={charBottom} className="inline-block">
            {char === " " ? " " : char}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

/** Pill button: magnetic hover + stagger-hover label + brand-color pop. */
export default function Button({
  href,
  onClick,
  children,
  variant = "solid",
  className = "",
  type = "button",
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  const classes = `inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-body text-sm font-medium tracking-wide transition-colors duration-300 ${variants[variant]} ${className}`;

  // plain-string labels get the stagger treatment; anything else renders as-is
  const label = typeof children === "string" ? <StaggerLabel text={children} /> : children;

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block transition-transform duration-300 ease-out-expo"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={reduce ? undefined : { scale: 0.97 }}
    >
      {href ? (
        <Link href={href} className={classes}>
          {label}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={classes}>
          {label}
        </button>
      )}
    </motion.div>
  );
}
