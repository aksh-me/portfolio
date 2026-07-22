import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The site chrome (nav/footer/cursor) is already stripped on /admin by
// AppShell — the admin pages render their own standalone UI.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100svh] bg-bg text-ink">{children}</div>;
}
