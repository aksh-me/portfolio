import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { portfolioSchema, type PortfolioContent } from "@/lib/validations";
import { defaultContent } from "@/data/defaults";

/**
 * Server-only content store. Read/write happens ONLY here (and only from
 * Server Actions / server components) — the client bundle never sees any of
 * these credentials.
 *
 * Backends, in order of preference:
 *   1. Upstash Redis  → set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *      (the production database; also works locally).
 *   2. Local JSON file (dev only) → data/portfolio.local.json, so you can
 *      test the full edit→save→display loop with no cloud setup.
 *   3. Fallback defaults → the site still renders if nothing is configured.
 */

const REDIS_KEY = "portfolio:content";
const LOCAL_FILE = path.join(process.cwd(), "data", "portfolio.local.json");

function hasRedis() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/** Read the current content. Never throws — always returns valid content. */
export async function getContent(): Promise<PortfolioContent> {
  try {
    let raw: unknown;
    if (hasRedis()) {
      raw = await (await getRedis()).get(REDIS_KEY);
    } else {
      const file = await fs.readFile(LOCAL_FILE, "utf8").catch(() => null);
      raw = file ? JSON.parse(file) : null;
    }
    if (!raw) return defaultContent;
    // validate stored data too — a bad record can't corrupt the site
    const parsed = portfolioSchema.safeParse(raw);
    return parsed.success ? parsed.data : defaultContent;
  } catch {
    return defaultContent;
  }
}

/** Persist validated content. Throws with a clear message if no store exists. */
export async function saveContent(data: PortfolioContent): Promise<void> {
  if (hasRedis()) {
    await (await getRedis()).set(REDIS_KEY, data);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
    return;
  }
  throw new Error(
    "No database configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment."
  );
}
