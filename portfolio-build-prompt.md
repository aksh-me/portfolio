# PORTFOLIO BUILD BRIEF — ONE-SHOT INSTRUCTION FILE

> **Instruction to Claude:** Read this ENTIRE file before writing any code. This is a complete
> specification for a premium, agency-level ($10K quality) personal portfolio website. Build the
> whole project in one shot — no follow-up questions needed. Everything you need is here. Where a
> placeholder like `[NAME]` appears, use it literally in the code so the owner can find-and-replace
> later. Do not skip sections. Do not simplify the design. Quality bar: Awwwards Site of the Day.

---

## 1. WHO THIS IS FOR

- **Owner:** `[NAME]` — a creative based in `[CITY]`.
- **Disciplines:** Web design + Photography (dual-craft creative).
- **Goal of the site:** Attract clients for web design projects AND photography bookings, and
  showcase creative work at a level that justifies premium pricing.
- **Audience:** Potential clients (small businesses, brands, couples/individuals for photo work),
  agencies looking to collaborate, and other creatives.
- **The single job of the homepage:** Make a visitor feel the owner's eye for visuals within 3
  seconds, then guide them toward viewing work or getting in touch.

## 2. TECH STACK (exact)

- **Framework:** Next.js 14+ (App Router, TypeScript).
- **Styling:** Tailwind CSS.
- **Animation:** Framer Motion (scroll reveals, parallax, page transitions, micro-interactions).
- **Smooth scrolling:** Lenis (`lenis` package) — buttery smooth scroll is mandatory for the
  Awwwards feel. Wrap the app in a Lenis provider.
- **3D:** Three.js (raw, not react-three-fiber) + **GSAP** — used ONLY for the spherical
  Work gallery (see section 4.2). Load the gallery as a client component with `dynamic()`
  import and `ssr: false` so it never breaks the Next.js build.
- **Theming:** `next-themes` for dark/light toggle. **Dark is the default theme.**
- **Icons:** `lucide-react`.
- **Fonts:** `next/font/google`.
- **Images:** `next/image` everywhere, with placeholder images from `https://picsum.photos` or
  local gray placeholders — clearly marked with comments like `{/* REPLACE: your photo here */}`.
- No CMS, no database. Content lives in a single `data/content.ts` file so the owner edits ONE
  file to update everything (projects, photos, services, prices, blog posts, testimonials).

## 3. DESIGN SYSTEM

### 3.1 Color — one primary: Crimson

Crimson is the ONLY accent. Use it with restraint so every appearance lands hard — cursor, links
on hover, the signature word in headlines, CTA buttons, active states. Never large crimson
backgrounds except the CTA band.

Dark theme (default):
- `--bg`: #0A0A0B (near-black, slightly warm)
- `--surface`: #131315
- `--text`: #F2F0ED (soft off-white, never pure white)
- `--muted`: #8A8784
- `--accent`: #DC143C (crimson)
- `--accent-hover`: #F03A5A
- `--line`: rgba(242,240,237,0.08) (hairline borders)

Light theme:
- `--bg`: #F7F5F2
- `--surface`: #FFFFFF
- `--text`: #121212
- `--muted`: #6E6A66
- `--accent`: #C01030 (deepened crimson for contrast on light bg — must pass WCAG AA)
- `--line`: rgba(18,18,18,0.08)

Implement as CSS variables on `:root` / `.dark` so components never hardcode hex values.

### 3.2 Typography

- **Display:** "Clash Display" via Fontshare CDN, or if unavailable use Google's **"Unbounded"**
  — used ONLY for h1/h2, tight tracking (-0.02em), weights 500–600.
- **Body:** **"Inter"** (Google) — 400/500, 1.6 line-height.
- **Utility/mono:** **"JetBrains Mono"** — for eyebrows, image captions, EXIF-style photo
  metadata (e.g. `f/1.8 · 35mm · ISO 400`), and the footer clock.
- Type scale: h1 clamp(3rem, 8vw, 7.5rem); h2 clamp(2rem, 5vw, 4rem); body 1rem–1.125rem.
- Headline treatment: h1/h2 words reveal line-by-line with a masked slide-up animation
  (Framer Motion, staggered).

### 3.3 The signature element

**The "dual-lens" hero:** the hero headline contains one crimson italic word that, on hover,
swaps the hero's background media between a web-design showcase state and a photography state
(two layered fullscreen images/videos crossfading). This embodies the dual craft. On mobile it
auto-crossfades every 5s. This is the one memorable risk — keep everything else disciplined.

### 3.4 Motion rules (Awwwards feel, not chaos)

- Lenis smooth scroll globally, `lerp: 0.1`.
- Scroll-triggered reveals: elements fade + rise 40px, staggered, once only.
- Parallax: hero media and section images move at 0.85–0.9 scroll speed (subtle).
- Custom cursor: small crimson dot + trailing ring; ring expands with the word "View" over
  project cards, "Open" over photos. Hidden on touch devices.
- Preloader: 0→100 counter in mono font, curtain wipe reveal, ~1.5s max, plays once per session
  (sessionStorage flag).
- Page transitions between routes: quick curtain/fade via Framer Motion `AnimatePresence`.
- Magnetic hover on buttons (translate toward cursor a few px).
- **Respect `prefers-reduced-motion`: disable parallax, cursor, preloader, and heavy animation.**

## 4. SITE STRUCTURE & PAGES

Routes: `/` (home), `/work` (all projects), `/work/[slug]` (case study), `/photography`
(gallery), `/journal` (blog), `/journal/[slug]` (post), `/about`, `/contact`,
`/services` (with pricing).

### 4.1 Home `/`

1. **Hero** — full viewport. Eyebrow in mono: `[CITY] — WEB DESIGNER & PHOTOGRAPHER`. Headline
   (storyteller voice): “I build websites and chase light — every project starts with a *story*.”
   (“story” is the crimson dual-lens trigger word, see 3.3). Below: scroll hint + two ghost
   buttons: “See the work” / “Book a shoot”.
2. **Selected Work** — 4 featured web projects, alternating large/small asymmetric grid, each
   card: image with parallax inner-zoom on hover, project name, mono tags (`DESIGN · DEV · 2026`).
   Section CTA: “Step inside the full gallery →” linking to the spherical `/work` experience.
3. **Photography strip** — horizontally scrolling (drag + scroll-linked) film-strip of 8 photos
   with EXIF captions in mono. Link: “Enter the gallery →”.
4. **About teaser** — portrait `[REPLACE: portrait]` + 2 warm sentences + “More about me”.
5. **Services snapshot** — 3 rows (Web Design, Photography, Brand + Content), each a full-width
   hairline-divided row that expands on hover showing a one-liner and “from $[PRICE]”.
6. **Testimonials** — 3 quotes, one at a time, auto-rotating with fade, client name + role.
7. **Journal teaser** — 2 latest posts.
8. **CTA band** — crimson background, huge display text: “Got a story to tell?” + “Let’s talk”
   button (inverts colors).
9. **Footer** — big name wordmark, nav columns, social links `[INSTAGRAM] [BEHANCE] [EMAIL]`,
   local time clock in mono (live, JS), © year, theme toggle also lives here.

### 4.2 Work `/work` — SPHERICAL 3D GALLERY (signature page, Phantom.land-style)

Reference: https://www.phantom.land/ — recreate the feel of that gallery as closely as
possible with Three.js + GSAP. This is the most important page; give it the most care.

**The concept:** the visitor is standing INSIDE a sphere, looking at a curved wall of project
cards wrapped around them on the sphere's inner surface.

**Exact behavior to build:**
- A fullscreen Three.js scene. Create a grid of card meshes (planes with image textures from
  `content.ts` — mix of web projects AND photography, ~20–30 cards) positioned on the inside
  of a large sphere (place each plane at a lat/long point on the sphere, rotated to face the
  center where the camera sits).
- Each card is a group: the image plane, plus small text labels above/below it (client name,
  project title, mono tags, year) rendered as canvas textures or HTML overlays projected to
  screen space — match the screenshot's layout: tiny caption top-left, title top-right, tag
  pills bottom, year bottom-right, hairline borders between cells.
- **Left-click + drag rotates the camera** around the inside of the sphere (both axes, with
  vertical clamped so you can't flip over the poles). Use GSAP or manual lerping for
  Lenis-style inertia/easing: dragging feels weighted, and on release the rotation glides to a
  stop smoothly. Scroll wheel also rotates (horizontal drift) with the same eased feel.
- Subtle idle drift when untouched. Slight fisheye/curvature feel from a wide FOV (~80–90).
- Hover on a card: it scales up slightly (~1.05), brightens, and the custom cursor ring shows
  "View". Non-hovered cards dim slightly.
- **Click on a card:** GSAP timeline — camera pushes toward the card while it scales to fill
  the viewport, scene fades, then Next.js routes to `/work/[slug]` with the page transition.
  The detail page can stay a basic template (see below); the gallery is the focus.
- UI chrome over the canvas, matching the screenshot's structure but in OUR design system:
  logo top-left, a short mono studio line top-center (“Websites & photographs by [NAME]”),
  local time top-right, “Let’s talk” pill button top-right corner, and a floating pill nav
  bottom-center (Work / About / Journal / Contact). Bottom-left: two small toggle buttons to
  switch between **sphere view** and a **flat list view** (simple fallback grid of the same
  cards — this doubles as the mobile/reduced-motion/no-WebGL fallback).
- Performance: reuse geometry, one texture loader with loading manager (tie it into the
  preloader counter), cap DPR at 2, dispose on unmount, target 60fps. Test by running the dev
  server and checking the browser console for errors; if a browser/devtools tool is available,
  use it to verify rendering and interaction, and fix until it's smooth.
- Fallbacks: touch devices get one-finger drag with the same easing; `prefers-reduced-motion`
  or no WebGL → auto-switch to the flat list view.

**Case studies `/work/[slug]`:** keep these as a basic clean template — fullscreen hero image,
mono meta table (client, role, year, stack), one paragraph of warm first-person narrative, 2
images, next-project link. Do not over-invest here; the gallery is the star.

### 4.3 Photography `/photography`

- Masonry grid (CSS columns), category filter pills: All / Portrait / Landscape / Street /
  Events.
- Click → custom lightbox (Framer Motion layoutId zoom, keyboard arrows, ESC to close, EXIF
  caption).
- 12 placeholder images.

### 4.4 Services `/services`

- Three packages per discipline. Example placeholder pricing (owner edits in `content.ts`):
  - Web: Landing Page — from $1,500 / Full Site — from $4,000 / Site + Brand — from $7,500.
  - Photo: Portrait Session — from $300 / Event Half-Day — from $900 / Brand Shoot — from $1,800.
- Each package: what's included (5 bullets), timeline, crimson “Start a project” CTA → contact.
- A short “How I work” 4-step process section (Discover → Design → Build/Shoot → Deliver).

### 4.5 Journal `/journal`

- 3 placeholder posts (MDX not required — plain data + a simple post template is fine).
- Post template: title, date, read time, cover image, prose styled with Tailwind typography.

### 4.6 About `/about`

- Large portrait, warm first-person story (write ~150 words of placeholder storyteller copy the
  owner can edit: how they fell into design through photography, what they believe about visual
  stories), tools/skills list in mono, camera-gear list (fun detail), 3–4 milestone timeline.

### 4.7 Contact `/contact`

- Split layout: left = warm invitation copy + email `[EMAIL]` + socials; right = form
  (name, email, project type select: Web / Photo / Both, budget select, message).
- Form uses a `mailto:` fallback or logs to console with a success animation — clearly comment
  where to plug in Formspree/Resend later.

## 5. VOICE & COPY RULES

- Warm, personal, storyteller. First person. Short sentences. No corporate filler, no
  “passionate about delivering solutions”.
- Examples of register: “Every brand has a story. I help you tell it — in pixels and in light.”
  / “Coffee first. Then we talk about your project.”
- Buttons say exactly what happens: “See the work”, “Book a shoot”, “Send message”.
- All copy lives in `data/content.ts` for easy editing.

## 6. QUALITY FLOOR (non-negotiable)

- Fully responsive: 360px → 1920px. Mobile nav = fullscreen overlay menu with staggered link
  reveal and a big crimson close button.
- Semantic HTML, alt text on all images, visible keyboard focus rings (crimson), skip-to-content
  link.
- WCAG AA contrast in both themes.
- SEO: metadata API per page, Open Graph tags, sitemap, favicon placeholder.
- Lighthouse-minded: lazy-load below-fold images, font `display: swap`, no layout shift on
  preloader.
- No console errors. Build must pass `next build` cleanly.

## 7. BUILD ORDER (do it in this sequence, one shot)

1. Scaffold Next.js + Tailwind + install: `framer-motion lenis next-themes lucide-react three
   gsap` (+ `@types/three`).
2. Set up CSS variables, fonts, Lenis provider, theme provider, custom cursor, preloader.
3. Build shared components: Nav (fixed, blurred backdrop, shrinks on scroll), Footer, Button,
   SectionHeading (with masked reveal), Reveal wrapper, Lightbox, ThemeToggle.
4. Create `data/content.ts` with ALL placeholder content.
5. Build the spherical Work gallery FIRST (it's the riskiest piece): Three.js scene, drag
   easing, hover, click-to-transition, list-view fallback. Run it in the browser and fix until
   drag feels smooth and clicks route correctly before moving on.
6. Then build remaining pages: Home → Case study template → Photography → Services → Journal →
   About → Contact.
7. Final pass: responsive check, reduced-motion check, WebGL fallback check, run `next build`,
   fix all errors.
8. Finish with a short README: how to replace images, edit `content.ts`, deploy to Vercel.

---

**Final reminder to Claude:** Do not ask clarifying questions. Do not deliver a partial site.
Follow this file exactly; where it is silent, make the choice a senior design lead at a
boutique studio would make — specific to a storyteller who shoots photos and designs websites,
never a generic template.
