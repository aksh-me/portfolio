import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/data/content";

/**
 * Contact form backend (Resend).
 *
 * Env vars (set these in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      required — from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL    optional — where submissions land (default: site.email)
 *   CONTACT_FROM_EMAIL  optional — sender (default: Resend's onboarding sender,
 *                       which works with no domain setup as long as TO_EMAIL is
 *                       the address you signed up to Resend with)
 *
 * Spam protection: a hidden honeypot field + a minimum fill-time check. Both
 * are silently accepted (200) so bots get no signal, but no email is sent.
 */

export const runtime = "nodejs";

const FROM = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || site.email;
const MIN_FILL_MS = 2500; // anything faster than this is almost certainly a bot

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const projectType = String(body.projectType ?? "").trim();
  const budget = String(body.budget ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? "").trim(); // hidden field
  const elapsed = Number(body.elapsed ?? 0); // ms since the form rendered

  // ── spam gates: pretend success, send nothing ──
  if (honeypot || (elapsed > 0 && elapsed < MIN_FILL_MS)) {
    return NextResponse.json({ ok: true });
  }

  // ── validation ──
  const errors: string[] = [];
  if (name.length < 2) errors.push("Please enter your name.");
  if (!isEmail(email)) errors.push("Please enter a valid email.");
  if (message.length < 10) errors.push("Please add a little more detail to your message.");
  if (message.length > 5000) errors.push("That message is a bit too long.");
  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration — surface clearly in logs, generic message to the user.
    console.error("RESEND_API_KEY is not set — cannot send contact email.");
    return NextResponse.json(
      { error: "The contact form isn't fully set up yet. Please email me directly." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email, // reply goes straight to the sender
      subject: `New enquiry — ${projectType || "Portfolio"} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType || "—"}`,
        `Budget: ${budget || "—"}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#121212">
          <h2 style="margin:0 0 16px">New enquiry from your portfolio</h2>
          <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 4px"><strong>Project type:</strong> ${escapeHtml(projectType) || "—"}</p>
          <p style="margin:0 0 16px"><strong>Budget:</strong> ${escapeHtml(budget) || "—"}</p>
          <p style="white-space:pre-wrap;border-top:1px solid #eee;padding-top:16px">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json({ error: "Something went wrong sending your message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong sending your message." }, { status: 500 });
  }
}
