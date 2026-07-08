"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { contact } from "@/data/content";
import Button from "@/components/Button";

const inputClasses =
  "w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent";

type Status = "idle" | "sending" | "sent" | "error";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const renderedAt = useRef(Date.now()); // used for the anti-bot timing check

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return; // guard against double submit
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    // ── client-side validation (server re-validates too) ──
    if ((data.name ?? "").trim().length < 2) return setError("Please enter your name.");
    if (!isEmail((data.email ?? "").trim())) return setError("Please enter a valid email address.");
    if ((data.message ?? "").trim().length < 10) return setError("Please add a little more detail to your message.");

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, elapsed: Date.now() - renderedAt.current }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Check your connection and try again.");
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-full min-h-[420px] flex-col items-center justify-center border border-line bg-surface p-10 text-center"
        role="status"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white"
        >
          <Check size={28} />
        </motion.span>
        <h3 className="mt-8 font-display text-2xl font-medium">Message sent</h3>
        <p className="mt-3 max-w-xs text-sm text-muted">
          Thank you — I read every message myself and I&apos;ll reply within two
          days. Coffee&apos;s on me.
        </p>
      </motion.div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} className="space-y-8" aria-label="Contact form" noValidate>
      {/* honeypot — hidden from humans, catches bots. Do not remove. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Your name
          </label>
          <input id="name" name="name" type="text" required placeholder="Jane Doe" className={inputClasses} disabled={sending} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required placeholder="jane@studio.com" className={inputClasses} disabled={sending} />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Project type
          </label>
          <select id="projectType" name="projectType" required className={inputClasses} disabled={sending}>
            {contact.projectTypes.map((type) => (
              <option key={type} value={type} className="bg-surface text-ink">
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Budget
          </label>
          <select id="budget" name="budget" required className={inputClasses} disabled={sending}>
            {contact.budgets.map((budget) => (
              <option key={budget} value={budget} className="bg-surface text-ink">
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          Your story
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell me what you're making, when you need it, and anything else that matters."
          className={`${inputClasses} resize-none`}
          disabled={sending}
        />
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm text-accent">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </p>
      )}

      <Button type="submit" variant="solid" className={sending ? "pointer-events-none opacity-70" : ""}>
        {sending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
