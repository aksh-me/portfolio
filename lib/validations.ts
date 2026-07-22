import { z } from "zod";

/**
 * Zod schemas for editable site content. Everything the admin dashboard can
 * change is validated against these on the SERVER before it's written, so a
 * malformed or malicious payload can never reach the database.
 *
 * This starts with the Hero section; add more sections here (and to
 * `portfolioSchema` + `defaultContent`) as they become editable.
 */

const cta = z.object({
  label: z.string().trim().max(60, "Button label is too long"),
  href: z.string().trim().max(300, "Link is too long"),
});

export const heroSchema = z.object({
  eyebrow: z.string().trim().max(160, "Eyebrow is too long"),
  headline: z
    .string()
    .trim()
    .min(1, "Headline is required")
    .max(240, "Headline is too long"),
  sub: z.string().trim().max(600, "Intro paragraph is too long"),
  ctaPrimary: cta,
  ctaSecondary: cta,
});
export type Hero = z.infer<typeof heroSchema>;

export const portfolioSchema = z.object({
  hero: heroSchema,
});
export type PortfolioContent = z.infer<typeof portfolioSchema>;
