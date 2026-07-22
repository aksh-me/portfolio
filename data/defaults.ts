import type { PortfolioContent } from "@/lib/validations";

/**
 * Fallback content. Used whenever the database is unconfigured or empty, so
 * the public site always renders correctly out of the box. Mirrors the
 * current live hero copy.
 */
export const defaultContent: PortfolioContent = {
  hero: {
    eyebrow: "ST. JOHN'S, NL — PHOTO · VIDEO · WEB DESIGN",
    headline: "I capture the moments most people *walk* *past*.",
    sub: "Hey, I'm Aksh — a photographer, filmmaker and web designer turning everyday light into things worth keeping.",
    ctaPrimary: { label: "Book a shoot", href: "/contact" },
    ctaSecondary: { label: "See the work", href: "/work" },
  },
};
