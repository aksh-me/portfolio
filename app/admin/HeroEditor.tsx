"use client";

import { useActionState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { updateHeroAction, type SaveState } from "@/app/actions/portfolio";
import type { Hero } from "@/lib/validations";

const field = "w-full border-b border-line bg-transparent px-0 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent";
const label = "block font-mono text-[10px] uppercase tracking-[0.3em] text-muted";

export default function HeroEditor({ hero }: { hero: Hero }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(updateHeroAction, null);

  return (
    <form action={action} className="border border-line bg-surface p-6 md:p-8">
      <h2 className="font-display text-xl font-medium">Hero</h2>
      <p className="mt-1 text-sm text-muted">
        The top of your home page. Wrap a word in <code className="text-accent">*asterisks*</code> to make it the crimson accent.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label className={label} htmlFor="eyebrow">Eyebrow</label>
          <input id="eyebrow" name="eyebrow" defaultValue={hero.eyebrow} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="headline">Headline</label>
          <textarea id="headline" name="headline" defaultValue={hero.headline} rows={2} className={`${field} resize-none`} />
        </div>
        <div>
          <label className={label} htmlFor="sub">Intro paragraph</label>
          <textarea id="sub" name="sub" defaultValue={hero.sub} rows={3} className={`${field} resize-none`} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="ctaPrimaryLabel">Primary button — text</label>
            <input id="ctaPrimaryLabel" name="ctaPrimaryLabel" defaultValue={hero.ctaPrimary.label} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="ctaPrimaryHref">Primary button — link</label>
            <input id="ctaPrimaryHref" name="ctaPrimaryHref" defaultValue={hero.ctaPrimary.href} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="ctaSecondaryLabel">Secondary button — text</label>
            <input id="ctaSecondaryLabel" name="ctaSecondaryLabel" defaultValue={hero.ctaSecondary.label} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="ctaSecondaryHref">Secondary button — link</label>
            <input id="ctaSecondaryHref" name="ctaSecondaryHref" defaultValue={hero.ctaSecondary.href} className={field} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? (<><Loader2 size={15} className="animate-spin" /> Saving…</>) : "Save changes"}
        </button>
        {state?.success && (
          <span className="flex items-center gap-1.5 text-sm text-green-500"><Check size={15} /> {state.success}</span>
        )}
        {state?.error && (
          <span className="flex items-center gap-1.5 text-sm text-accent"><AlertCircle size={15} /> {state.error}</span>
        )}
      </div>
    </form>
  );
}
