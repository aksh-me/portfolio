import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Content Editor",
  robots: { index: false, follow: false },
};

// The editor is hosted on Sanity (axsh-portfolio.sanity.studio). This route
// is the friendly door at axsh.me/admin — it forwards you there once the
// studio is deployed. Set NEXT_PUBLIC_STUDIO_URL in Vercel to that address.
const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL;

export default function AdminPage() {
  if (STUDIO_URL) redirect(STUDIO_URL);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Content editor</p>
      <h1 className="font-display text-2xl font-medium text-ink">Almost ready.</h1>
      <p className="max-w-sm text-sm text-muted">
        The editor is being set up. Once it&apos;s deployed, this page will take
        you straight to it — sign in with your Sanity account to edit the site.
      </p>
    </main>
  );
}
