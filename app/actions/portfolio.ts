"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { heroSchema } from "@/lib/validations";
import { getContent, saveContent } from "@/lib/db";

export type SaveState = { error?: string; success?: string } | null;

async function requireAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return Boolean(await verifySessionToken(token));
}

/** Validate + persist the Hero section, then refresh the public home page. */
export async function updateHeroAction(_prev: SaveState, formData: FormData): Promise<SaveState> {
  if (!(await requireAdmin())) {
    return { error: "Your session expired. Please log in again." };
  }

  const parsed = heroSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    headline: String(formData.get("headline") ?? ""),
    sub: String(formData.get("sub") ?? ""),
    ctaPrimary: {
      label: String(formData.get("ctaPrimaryLabel") ?? ""),
      href: String(formData.get("ctaPrimaryHref") ?? ""),
    },
    ctaSecondary: {
      label: String(formData.get("ctaSecondaryLabel") ?? ""),
      href: String(formData.get("ctaSecondaryHref") ?? ""),
    },
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Some fields are invalid." };
  }

  try {
    const current = await getContent();
    await saveContent({ ...current, hero: parsed.data });
    revalidatePath("/");
    return { success: "Saved — your home page is updated." };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not save your changes." };
  }
}
