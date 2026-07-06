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

## Hooking up the contact form

The form currently logs to the console and shows the success state. To make
it real, open `components/contact/ContactForm.tsx` — the comment block inside
`onSubmit` explains both options (Formspree in ~1 minute, or Resend via an
API route).

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
3. Set `site.url` in `data/content.ts` to your live domain so Open Graph
   tags and the sitemap point to the right place.
