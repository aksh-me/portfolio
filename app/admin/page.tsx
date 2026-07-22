import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { getContent } from "@/lib/db";
import { logoutAction } from "@/app/actions/auth";
import HeroEditor from "./HeroEditor";

// Always show the latest saved content in the editor.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getContent();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-medium">Edit your site</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            View site <ExternalLink size={13} />
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Log out <LogOut size={13} />
            </button>
          </form>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <HeroEditor hero={content.hero} />

        <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          More sections — projects, photos, about, services — coming next
        </p>
      </div>
    </main>
  );
}
