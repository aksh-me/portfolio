import { site } from "@/data/content";

/**
 * Branded HTML email templates for the contact form.
 *
 * Email clients are ~2005-era renderers: table layouts, inline styles, no
 * flexbox/grid, no external CSS. Everything here is inline and table-based so
 * it renders consistently in Gmail, Apple Mail, Outlook, etc. Each builder
 * returns { subject, html, text } — always send a plain-text alternative too,
 * it helps deliverability and accessibility.
 */

/* brand tokens (light email — safest, most readable across clients) */
const ACCENT = "#DC143C";
const ACCENT_DARK = "#C01030"; // AA-contrast crimson for text on white
const INK = "#161514";
const MUTED = "#6E6A66";
const LINE = "#EAE7E2";
const PAGE = "#F4F2EF";
const DARK = "#0A0A0B";
const PAPER = "#FFFFFF";
const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] || "there";

/** Outer shell: hidden preheader, dark header bar, white card, footer. */
function shell({ preheader, tag, body }: { preheader: string; tag: string; body: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
</head>
<body style="margin:0;padding:0;background:${PAGE};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${PAGE};">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${PAPER};border:1px solid ${LINE};border-radius:14px;overflow:hidden;">
          <!-- header -->
          <tr>
            <td style="background:${DARK};padding:22px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${SANS};font-size:18px;font-weight:700;letter-spacing:-0.02em;color:#F2F0ED;">
                    ${escapeHtml(site.name)}<span style="color:${ACCENT};">.</span>
                  </td>
                  <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:0.22em;color:${ACCENT};text-transform:uppercase;">
                    ${escapeHtml(tag)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${body}
          <!-- footer -->
          <tr>
            <td style="padding:22px 32px;border-top:1px solid ${LINE};">
              <p style="margin:0;font-family:${MONO};font-size:11px;letter-spacing:0.06em;color:${MUTED};">
                Sent from <a href="${site.url}" style="color:${ACCENT_DARK};text-decoration:none;">${site.url.replace(/^https?:\/\//, "")}</a> · ${escapeHtml(site.city)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid ${LINE};font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};width:130px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:12px 0;border-bottom:1px solid ${LINE};font-family:${SANS};font-size:15px;font-weight:600;color:${INK};">${value}</td>
  </tr>`;
}

type EnquiryData = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
};

/* ── 1. Enquiry notification → sent to the owner ─────────────────────────── */
export function ownerEmail(d: EnquiryData) {
  const first = firstNameOf(d.name);
  const body = `
    <tr><td style="padding:40px 32px 0;">
      <h1 style="margin:0;font-family:${SANS};font-size:26px;font-weight:700;letter-spacing:-0.02em;color:${INK};">New enquiry</h1>
      <p style="margin:10px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${MUTED};">Someone reached out through your portfolio.</p>
    </td></tr>
    <tr><td style="padding:24px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Name", escapeHtml(d.name))}
        ${detailRow("Email", `<a href="mailto:${escapeHtml(d.email)}" style="color:${ACCENT_DARK};text-decoration:none;">${escapeHtml(d.email)}</a>`)}
        ${detailRow("Project", escapeHtml(d.projectType) || "—")}
        ${detailRow("Budget", escapeHtml(d.budget) || "—")}
      </table>
    </td></tr>
    <tr><td style="padding:26px 32px 0;">
      <p style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};">Message</p>
      <div style="border-left:3px solid ${ACCENT};padding:2px 0 2px 16px;font-family:${SANS};font-size:15px;line-height:1.65;color:${INK};white-space:pre-wrap;">${escapeHtml(d.message)}</div>
    </td></tr>
    <tr><td style="padding:30px 32px 40px;">
      <a href="mailto:${escapeHtml(d.email)}?subject=${encodeURIComponent(`Re: your enquiry — ${site.name}`)}"
         style="display:inline-block;background:${ACCENT};color:#ffffff;font-family:${SANS};font-size:14px;font-weight:600;text-decoration:none;padding:13px 26px;border-radius:999px;">
        Reply to ${escapeHtml(first)} &rarr;
      </a>
    </td></tr>`;

  return {
    subject: `New enquiry — ${d.projectType || "Portfolio"} — ${d.name}`,
    html: shell({ preheader: `${d.name}: ${d.message.slice(0, 90)}`, tag: "New enquiry", body }),
    text: [
      `New enquiry from your portfolio`,
      ``,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Project: ${d.projectType || "—"}`,
      `Budget: ${d.budget || "—"}`,
      ``,
      d.message,
      ``,
      `Reply directly to this email to reach ${first}.`,
    ].join("\n"),
  };
}

/* ── 2. Auto-reply → sent to the person who contacted ────────────────────── */
export function clientEmail(d: EnquiryData) {
  const first = firstNameOf(d.name);
  const instaHandle = site.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "");
  const body = `
    <tr><td style="padding:40px 32px 0;">
      <h1 style="margin:0;font-family:${SANS};font-size:26px;font-weight:700;letter-spacing:-0.02em;color:${INK};">Thanks for reaching out.</h1>
    </td></tr>
    <tr><td style="padding:18px 32px 0;">
      <p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.7;color:${INK};">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.7;color:${INK};">Your message just landed safely — thank you for getting in touch. I read every message myself, so this isn't a bot pretending to care.</p>
      <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.7;color:${INK};">I'll be in touch as soon as I can, usually within a day or two. If anything's time-sensitive, just reply straight to this email.</p>
    </td></tr>
    <tr><td style="padding:26px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAGE};border-radius:10px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 10px;font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};">What you sent</p>
          <p style="margin:0 0 6px;font-family:${SANS};font-size:14px;color:${INK};"><strong style="color:${MUTED};font-weight:600;">Project:</strong> ${escapeHtml(d.projectType) || "—"}</p>
          <p style="margin:0;font-family:${SANS};font-size:14px;line-height:1.6;color:${INK};white-space:pre-wrap;">${escapeHtml(d.message)}</p>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:30px 32px 40px;">
      <p style="margin:0 0 4px;font-family:${SANS};font-size:15px;line-height:1.6;color:${INK};">Talk soon,</p>
      <p style="margin:0;font-family:${SANS};font-size:17px;font-weight:700;letter-spacing:-0.01em;color:${INK};">${escapeHtml(site.name)}</p>
      <p style="margin:2px 0 16px;font-family:${MONO};font-size:11px;letter-spacing:0.1em;color:${MUTED};text-transform:uppercase;">${escapeHtml(site.role)} · ${escapeHtml(site.city)}</p>
      <a href="${site.instagram}" style="display:inline-block;font-family:${SANS};font-size:13px;font-weight:600;color:${ACCENT_DARK};text-decoration:none;">${escapeHtml(instaHandle)} &rarr;</a>
    </td></tr>`;

  return {
    subject: `Thanks for reaching out, ${first} — ${site.name}`,
    html: shell({ preheader: `Got your message — I'll be in touch soon. — ${site.name}`, tag: "Confirmation", body }),
    text: [
      `Hi ${first},`,
      ``,
      `Your message just landed safely — thank you for getting in touch. I read every message myself, so this isn't a bot pretending to care.`,
      ``,
      `I'll be in touch as soon as I can, usually within a day or two. If anything's time-sensitive, just reply straight to this email.`,
      ``,
      `What you sent —`,
      `Project: ${d.projectType || "—"}`,
      `${d.message}`,
      ``,
      `Talk soon,`,
      `${site.name}`,
      `${site.role} · ${site.city}`,
      `${site.instagram}`,
    ].join("\n"),
  };
}
