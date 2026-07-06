"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { contact } from "@/data/content";
import Button from "@/components/Button";

const inputClasses =
  "w-full border-b border-line bg-transparent px-0 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    /* ─────────────────────────────────────────────────────────────────
       PLUG IN A REAL BACKEND HERE.
       Easiest options:
       - Formspree: change <form> to
           <form action="https://formspree.io/f/YOUR_ID" method="POST">
         and remove this handler entirely.
       - Resend / API route: POST `data` to /api/contact and send with
         resend.emails.send() there.
       For now we log the message and show the success state.
    ───────────────────────────────────────────────────────────────── */
    console.log("Contact form submission:", data);
    setSent(true);
  };

  if (sent) {
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

  return (
    <form onSubmit={onSubmit} className="space-y-8" aria-label="Contact form">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Your name
          </label>
          <input id="name" name="name" type="text" required placeholder="Jane Doe" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required placeholder="jane@studio.com" className={inputClasses} />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="projectType" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            Project type
          </label>
          <select id="projectType" name="projectType" required className={inputClasses}>
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
          <select id="budget" name="budget" required className={inputClasses}>
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
        />
      </div>

      <Button type="submit" variant="solid">
        Send message
      </Button>
    </form>
  );
}
