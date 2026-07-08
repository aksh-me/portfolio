import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/data/content";
import { ownerEmail, clientEmail } from "@/lib/emails";

/**
 * Contact form backend (Resend). Sends TWO emails per submission:
 *   1. An enquiry notification to the owner (critical — failure = error).
 *   2. A branded auto-reply to the visitor (best-effort — never blocks #1).
 *
 * Env vars (set these in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY      required — from https://resend.com/api-keys
 *   CONTACT_TO_EMAIL    optional — where enquiries land (default: site.email)
 *   CONTACT_FROM_EMAIL  optional — sender (default: Resend's onboarding sender,
 *                       which works with no domain setup, but can only deliver
 *                       to your Resend signup address. The visitor auto-reply
 *                       only reaches arbitrary inboxes once you verify a domain
 *                       in Resend — until then it's skipped gracefully.)
 *
 * Spam protection: a hidden honeypot field + a minimum fill-time check. Both
 * are silently accepted (200) so bots get no signal, but no email is sent.
 */

export const runtime = "nodejs";

const FROM = process.env.CONTACT_FROM_EMAIL || "Aksh Patel <onboarding@resend.dev>";
const TO = process.env.CONTACT_TO_EMAIL || site.email;
const MIN_FILL_MS = 2500; // anything faster than this is almost certainly a bot

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
  const enquiry = { name, email, projectType, budget, message };

  try {
    // 1. Owner notification — this one must succeed.
    const owner = ownerEmail(enquiry);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email, // hitting "reply" reaches the visitor directly
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    });

    if (error) {
      console.error("Resend owner-email error:", error);
      return NextResponse.json({ error: "Something went wrong sending your message." }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong sending your message." }, { status: 500 });
  }

  // 2. Auto-reply to the visitor — best-effort. Requires a verified domain to
  //    reach arbitrary inboxes; if it fails we still report success, since the
  //    owner already got the enquiry.
  try {
    const reply = clientEmail(enquiry);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [email],
      replyTo: TO, // if they reply to the confirmation, it reaches the owner
      subject: reply.subject,
      html: reply.html,
      text: reply.text,
    });
    if (error) console.warn("Auto-reply not sent (verify a domain in Resend to enable):", error);
  } catch (err) {
    console.warn("Auto-reply threw:", err);
  }

  return NextResponse.json({ ok: true });
}
