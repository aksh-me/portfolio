"use client";

import React from "react";
import AdminSidebar from "./AdminSidebar";
import { ArrowUpRight } from "lucide-react";

interface AdminPageWrapperProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminPageWrapper({
  title,
  description,
  action,
  children,
}: AdminPageWrapperProps) {
  return (
    <div className="min-h-screen w-full bg-black text-white flex">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-950/50">
        {/* Top Header */}
        <header className="h-16 border-b border-neutral-800/80 px-8 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-30">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
            {description && (
              <p className="text-xs text-neutral-400 font-mono">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {action}
            <a
              href="https://www.axsh.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-700 transition"
            >
              <span>Live Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-6xl w-full mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
