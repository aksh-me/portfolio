# [NAME] — Portfolio

A premium personal portfolio for a dual-craft creative (web design + photography).
Next.js 15 (App Router, TypeScript) · Tailwind CSS · Framer Motion · Lenis · Three.js + GSAP · next-themes.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Make it yours (3 steps)

### 1. Find and replace the placeholders

Search the whole project for these tokens and replace them:

| Token | Meaning |
| --- | --- |
| `[NAME]` | Your name |
| `[CITY]` | Your city |
| `[EMAIL]` | Your email |
| `[INSTAGRAM]` | Full Instagram URL |
| `[BEHANCE]` | Full Behance URL |

Almost all of them live in one place: **`data/content.ts`**.

### 2. Edit `data/content.ts`

Every word and image on the site comes from this single file:

- `site` — name, city, email, socials, deployed URL (used for SEO/sitemap).
- `hero` — headline (wrap one word in `*asterisks*` to make it the crimson
  dual-lens trigger), the two hero background images.
- `projects` — web design case studies (title, story, images, tags, `featured`
  controls the homepage grid). Cards also feed the 3D sphere gallery.
- `photos` — the photography gallery (category, EXIF caption, dimensions).
- `services` — packages, pricing, process steps.
- `testimonials`, `posts` (journal), `about`, `contact` — self-explanatory.

### 3. Replace the images

All images are `https://picsum.photos` placeholders, marked with
`REPLACE` comments. Drop your own photos into `/public` (e.g.
`public/work/aurelia-hero.jpg`) and change the URLs in `content.ts` to
`/work/aurelia-hero.jpg`. `next/image` handles the rest. If you keep any
remote images, add their host to `next.config.mjs → images.remotePatterns`.

## Contact form (Resend)

The form posts to `app/api/contact/route.ts`, which emails you via
[Resend](https://resend.com). It includes validation, loading/error states,
and spam protection (hidden honeypot + minimum fill-time check).

**Setup (~2 minutes, free):**

1. Sign up at [resend.com](https://resend.com) **using the email address where
   you want to receive submissions** (on the free tier without a verified
   domain, Resend can only deliver to your sign-up address).
2. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
3. In Vercel → your project → **Settings → Environment Variables**, add:
   - `RESEND_API_KEY` — the key from step 2
   - `CONTACT_TO_EMAIL` — your receiving email (optional; defaults to the one in
     `data/content.ts`)
4. Redeploy. Done — messages now land in your inbox, and replying goes straight
   to the sender.

To send from your own domain later, verify it in Resend and set
`CONTACT_FROM_EMAIL` (e.g. `Aksh Patel <hello@yourdomain.com>`).

See `.env.example` for all variables. For local testing, copy it to
`.env.local` and fill in the values.

## SEO & Google Search Console

Already wired up:

- **`/sitemap.xml`** — generated from your routes (`app/sitemap.ts`).
- **`/robots.txt`** — allows crawling, points to the sitemap (`app/robots.ts`).
- **Metadata** — titles, descriptions, canonical, Open Graph and Twitter cards,
  and per-page metadata via the Next.js Metadata API.

**Manual steps you need to do:**

1. **Set your real URL.** Add `NEXT_PUBLIC_SITE_URL` in Vercel (e.g.
   `https://your-domain.com`, no trailing slash). This makes the sitemap,
   canonical tags and social previews use the correct address.
2. **Verify in Search Console.** Go to
   [search.google.com/search-console](https://search.google.com/search-console),
   add your site as a **URL-prefix** property using your full URL. Choose the
   **HTML tag** method, copy the `content` value it gives you, and add it in
   Vercel as `GOOGLE_SITE_VERIFICATION`. Redeploy, then click **Verify**.
   (If you use a custom domain, the **Domain** property + DNS TXT record is even
   better.)
3. **Submit your sitemap.** In Search Console → **Sitemaps**, enter `sitemap.xml`
   and submit.
4. **Request indexing** (optional, speeds things up): use the **URL Inspection**
   tool on your homepage and click **Request indexing**.

Indexing readiness checklist (all satisfied): pages are server-rendered with
real content, none are `noindex`, every public route is in the sitemap, images
have `alt` text, and there are no crawl blocks except `/api/`.

## The sphere gallery (`/work`)

`components/work/SphereGallery.tsx` places every card from
`galleryItems` (projects + photos) on the inside of a sphere. Drag / scroll
to rotate, click a card to fly into it. It automatically falls back to the
flat list view on devices without WebGL or with `prefers-reduced-motion`,
and the bottom-left toggles switch views manually.

## Theming

Dark is the default. All colors are CSS variables in `app/globals.css`
(`:root` = light, `.dark` = dark) — change the palette there and every
component follows. The crimson accent is `--accent`.

## Deploy to Vercel

1. Push the repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → import the repo → deploy
   (zero config needed).
3. Add the environment variables from `.env.example` (contact form + SEO URL).
4. Set `NEXT_PUBLIC_SITE_URL` to your live domain so Open Graph tags and the
   sitemap point to the right place.
