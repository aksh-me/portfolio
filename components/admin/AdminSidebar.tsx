"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Globe,
  Briefcase,
  Camera,
  BookOpen,
  Sparkles,
  User,
  Compass,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Site & Hero", href: "/admin/site", icon: Globe },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Photography", href: "/admin/photos", icon: Camera },
  { name: "Journal", href: "/admin/journal", icon: BookOpen },
  { name: "Services", href: "/admin/services", icon: Sparkles },
  { name: "About", href: "/admin/about", icon: User },
  { name: "Trails", href: "/admin/trails", icon: Compass },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Header Branding */}
        <div className="p-6 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              Admin Portal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            AKSH PATEL
          </h2>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-red-950/40 text-white font-medium border border-red-900/50 shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-red-500" : "text-neutral-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-neutral-800/80 space-y-2">
        <a
          href="https://www.axsh.me"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs font-mono text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:bg-red-950/30 rounded-lg transition border border-red-900/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
