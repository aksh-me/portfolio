"use client";

import { useActionState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { loginAction, type AuthState } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, null);

  return (
    <form action={action} className="w-full max-w-sm">
      <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-muted">
        <Lock size={13} className="text-accent" /> Admin access
      </div>
      <h1 className="font-display text-3xl font-medium">Sign in</h1>
      <p className="mt-2 text-sm text-muted">Enter your admin password to edit the site.</p>

      <label htmlFor="password" className="mt-8 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoFocus
        required
        autoComplete="current-password"
        className="mt-2 w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
        placeholder="••••••••••"
      />

      {state?.error && (
        <p role="alert" className="mt-4 text-sm text-accent">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={15} className="animate-spin" /> Signing in…
          </>
        ) : (
          "Enter"
        )}
      </button>
    </form>
  );
}
