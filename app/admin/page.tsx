"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import {
  Globe,
  Briefcase,
  Camera,
  BookOpen,
  Sparkles,
  User,
  Compass,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminDashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setData(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const sections = [
    { title: "Site & Hero", href: "/admin/site", icon: Globe, count: "General settings, Hero headline & EXIF slides" },
    { title: "Projects", href: "/admin/projects", icon: Briefcase, count: `${data?.projects?.length || 0} Web projects` },
    { title: "Photography", href: "/admin/photos", icon: Camera, count: `${data?.photos?.length || 0} Photographs` },
    { title: "Journal", href: "/admin/journal", icon: BookOpen, count: `${data?.posts?.length || 0} Blog posts` },
    { title: "Services", href: "/admin/services", icon: Sparkles, count: `${data?.services?.offerings?.length || 0} Service offerings` },
    { title: "About", href: "/admin/about", icon: User, count: "Bio, tools, gear & milestones" },
    { title: "Trails", href: "/admin/trails", icon: Compass, count: `${data?.trails?.list?.length || 0} Trails logged` },
  ];

  return (
    <AdminPageWrapper
      title="Dashboard Overview"
      description="Manage all content, photos, projects, and site settings for axsh.me"
    >
      {/* Database Connection Status Card */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-900/40 text-red-500 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Database Integration</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                <CheckCircle2 className="w-3 h-3" /> Supabase Ready
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Edits made in this dashboard are saved to your database and reflected live on your site instantly.
            </p>
          </div>
        </div>

        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono uppercase tracking-wider text-neutral-200 rounded-lg transition border border-neutral-700 whitespace-nowrap"
        >
          Open Supabase Dashboard
        </a>
      </div>

      {/* Grid of Content Sections */}
      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">
          Content Sections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link
                key={sec.href}
                href={sec.href}
                className="group p-6 rounded-2xl bg-neutral-900/40 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between h-44 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 text-neutral-600 group-hover:text-red-500 transition">
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition" />
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center text-neutral-300 group-hover:text-red-400 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-red-400 transition">
                      {sec.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-500 mt-1">
                      {loading ? "Loading..." : sec.count}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider group-hover:text-white transition">
                  Edit section →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminPageWrapper>
  );
}
