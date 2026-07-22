"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnconfigured = searchParams.get("error") === "unconfigured";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createClient();
    if (!supabase) {
      setErrorMsg("Supabase is not configured yet. Please set environment variables in Vercel.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-950 border border-neutral-800/80 rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-sm">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-950/40 border border-red-900/50 text-red-500 mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
          Portfolio CMS · Aksh Patel
        </p>
      </div>

      {isUnconfigured && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-900/50 text-amber-300 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-mono font-semibold uppercase">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Supabase Setup Required</span>
          </div>
          <p>
            Please add your <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your Vercel project environment variables to enable authentication.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-xs flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/60 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/60 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs uppercase tracking-widest font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-lg shadow-red-950/50"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-neutral-900 text-center">
        <a
          href="https://www.axsh.me"
          className="text-xs text-neutral-500 hover:text-neutral-300 font-mono transition"
        >
          ← Back to live portfolio
        </a>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden w-full">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-950/20 blur-[120px] rounded-full pointer-events-none" />
      <Suspense fallback={<div className="text-neutral-500 font-mono text-xs">Loading admin login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
