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
 *   1. Supabase  → set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Content is
 *      one row (id = 1) in a `site_content` table (jsonb column `data`). The
 *      service-role key is server-only and bypasses RLS.
 *   2. Local JSON file (dev only) → data/portfolio.local.json, so you can
 *      test the full edit→save→display loop with no cloud setup.
 *   3. Fallback defaults → the site still renders if nothing is configured.
 */

const TABLE = "site_content";
const ROW_ID = 1;
const LOCAL_FILE = path.join(process.cwd(), "data", "portfolio.local.json");

function hasSupabase() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Normalize to just the origin (https://<ref>.supabase.co) so a pasted
// trailing slash or stray path can't produce an "Invalid path" error.
function supabaseUrl() {
  const raw = process.env.SUPABASE_URL!.trim();
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

async function getSupabase() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(supabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Read the current content. Never throws — always returns valid content. */
export async function getContent(): Promise<PortfolioContent> {
  try {
    let raw: unknown;
    if (hasSupabase()) {
      const supabase = await getSupabase();
      const { data } = await supabase.from(TABLE).select("data").eq("id", ROW_ID).maybeSingle();
      raw = data?.data ?? null;
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
  if (hasSupabase()) {
    const supabase = await getSupabase();
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data, updated_at: new Date().toISOString() });
    if (error) {
      throw new Error(
        `Could not save to Supabase (${error.message}). Make sure the "site_content" table exists.`
      );
    }
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2), "utf8");
    return;
  }
  throw new Error(
    "No database configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment."
  );
}
