"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionHeadingProps = {
  title: string; // wrap a word in *asterisks* to render it crimson italic
  eyebrow?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  size?: "display-1" | "display-2";
};

/**
 * Headline with a masked, word-by-word slide-up reveal.
 * `*word*` in the title renders as the crimson italic accent word.
 */
export default function SectionHeading({
  title,
  eyebrow,
  as: Tag = "h2",
  className = "",
  size = "display-2",
}: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const words = title.split(" ");

  return (
    <div className={className}>
      {eyebrow && (
        <motion.p
          className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {eyebrow}
        </motion.p>
      )}
      <Tag className={`font-display font-medium ${size === "display-1" ? "text-display-1" : "text-display-2"}`}>
        {words.map((word, i) => {
          const accented = word.startsWith("*");
          const clean = word.replace(/\*/g, "");
          return (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${accented ? "italic text-accent" : ""}`}
                initial={reduce ? false : { y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                {clean}
              </motion.span>
              {i < words.length - 1 && <span>&nbsp;</span>}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
