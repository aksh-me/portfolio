/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTENT — edit this ONE file to update everything on the site.
 *
 *  Find-and-replace the placeholders:
 *    [NAME]       your name
 *    [CITY]       your city
 *    [EMAIL]      your email address
 *    [INSTAGRAM]  your instagram URL
 *    [BEHANCE]    your behance URL
 *
 *  Every image below is a picsum.photos placeholder.
 *  REPLACE: swap the `src`/`image` URLs for your own photos (drop them in
 *  /public and use e.g. "/work/aurelia-hero.jpg").
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "[NAME]",
  city: "[CITY]",
  role: "Web designer & photographer",
  email: "[EMAIL]",
  instagram: "[INSTAGRAM]", // REPLACE: full URL, e.g. https://instagram.com/you
  behance: "[BEHANCE]", // REPLACE: full URL, e.g. https://behance.net/you
  url: "https://example.com", // REPLACE: your deployed domain (used for SEO/OG)
  studioLine: "Websites & photographs by [NAME]",
};

/* ── Hero ──────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "[CITY] — WEB DESIGNER & PHOTOGRAPHER",
  // The word wrapped in *asterisks* becomes the crimson "dual-lens" trigger.
  headline: "I build websites and chase light — every project starts with a *story*.",
  sub: "Design in the browser, stories through a lens. Two crafts, one eye.",
  ctaPrimary: { label: "See the work", href: "/work" },
  ctaSecondary: { label: "Book a shoot", href: "/contact" },
  // REPLACE: the two hero background images (web-design state / photography state)
  webImage: "https://picsum.photos/id/180/1920/1280",
  photoImage: "https://picsum.photos/id/1015/1920/1280",
};

/* ── Projects (web design) ─────────────────────────────────────────────────── */

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  tags: string[];
  role: string;
  stack: string;
  summary: string;
  story: string;
  hero: string;
  images: [string, string];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "aurelia-atelier",
    title: "Aurelia Atelier",
    client: "Aurelia",
    year: "2026",
    tags: ["DESIGN", "DEV"],
    role: "Design & build",
    stack: "Next.js · Tailwind · Sanity",
    summary: "A hushed, editorial home for a slow-fashion atelier.",
    story:
      "Aurelia makes twelve garments a year, each one by hand. The site had to move at that same pace — generous whitespace, one photograph at a time, type that breathes. We cut everything that didn't serve the clothes and let the lookbook do the talking.",
    hero: "https://picsum.photos/id/1011/1600/1000",
    images: ["https://picsum.photos/id/1012/1600/1000", "https://picsum.photos/id/1013/1600/1000"],
    featured: true,
  },
  {
    slug: "northbound-coffee",
    title: "Northbound Coffee",
    client: "Northbound",
    year: "2026",
    tags: ["DESIGN", "DEV", "SHOP"],
    role: "Design, build & product photography",
    stack: "Next.js · Shopify · Tailwind",
    summary: "Roastery e-commerce with photography shot in their own bar.",
    story:
      "Northbound didn't want a coffee site that looked like every other coffee site. So we shot their bags on the actual bar, steam and all, and built the store around those frames. Checkout in three taps. Sales doubled the first quarter.",
    hero: "https://picsum.photos/id/1060/1600/1000",
    images: ["https://picsum.photos/id/766/1600/1000", "https://picsum.photos/id/425/1600/1000"],
    featured: true,
  },
  {
    slug: "studio-marrow",
    title: "Studio Marrow",
    client: "Marrow Architects",
    year: "2025",
    tags: ["DESIGN", "DEV"],
    role: "Design & build",
    stack: "Next.js · Framer Motion",
    summary: "An architecture portfolio that gets out of the buildings' way.",
    story:
      "Architects are the hardest clients — they see everything. Marrow wanted their concrete to feel heavy on screen. We used oversized imagery, a strict grid, and almost no words. The homepage is one building at a time, full-bleed, and nothing else.",
    hero: "https://picsum.photos/id/1081/1600/1000",
    images: ["https://picsum.photos/id/122/1600/1000", "https://picsum.photos/id/342/1600/1000"],
    featured: true,
  },
  {
    slug: "wildlane-journal",
    title: "Wildlane Journal",
    client: "Wildlane",
    year: "2025",
    tags: ["DESIGN", "DEV", "EDITORIAL"],
    role: "Design & build",
    stack: "Next.js · MDX · Tailwind",
    summary: "A travel journal that reads like a well-worn paperback.",
    story:
      "Wildlane's writers file stories from places with no wifi. The reading experience had to honor that effort — big serif headlines, photography that bleeds off the page, and load times fast enough for a hostel connection. It's the site I open when I miss the road.",
    hero: "https://picsum.photos/id/1036/1600/1000",
    images: ["https://picsum.photos/id/1043/1600/1000", "https://picsum.photos/id/1018/1600/1000"],
    featured: true,
  },
  {
    slug: "harbor-and-pine",
    title: "Harbor & Pine",
    client: "Harbor & Pine Hotel",
    year: "2025",
    tags: ["DESIGN", "DEV"],
    role: "Design, build & photography",
    stack: "Next.js · Tailwind",
    summary: "A boutique hotel site shot and built in the same week.",
    story:
      "Eleven rooms on a cold coastline. I stayed three nights, shot everything at golden hour, and designed the booking flow at their kitchen table. The site smells like salt and woodsmoke, or at least it tries to.",
    hero: "https://picsum.photos/id/1040/1600/1000",
    images: ["https://picsum.photos/id/164/1600/1000", "https://picsum.photos/id/1039/1600/1000"],
    featured: false,
  },
  {
    slug: "fable-records",
    title: "Fable Records",
    client: "Fable",
    year: "2024",
    tags: ["DESIGN", "DEV", "MOTION"],
    role: "Design & build",
    stack: "Next.js · Three.js · GSAP",
    summary: "An indie label site that moves like a record spins.",
    story:
      "Fable signs bands nobody has heard of yet and believes in them loudly. The site needed that same energy — album art you can spin, liner notes you can actually read, and a release calendar that feels like a gig poster wall.",
    hero: "https://picsum.photos/id/453/1600/1000",
    images: ["https://picsum.photos/id/96/1600/1000", "https://picsum.photos/id/39/1600/1000"],
    featured: false,
  },
  {
    slug: "cartography-co",
    title: "Cartography Co.",
    client: "Cartography Co.",
    year: "2024",
    tags: ["DESIGN", "SHOP"],
    role: "Design & art direction",
    stack: "Shopify · Tailwind",
    summary: "A print shop for people who still hang maps on walls.",
    story:
      "They screen-print maps of coastlines and mountain ranges in editions of fifty. We designed the shop like a flat-file drawer: browse by range, by coast, by decade. The product pages zoom close enough to see the ink texture.",
    hero: "https://picsum.photos/id/211/1600/1000",
    images: ["https://picsum.photos/id/28/1600/1000", "https://picsum.photos/id/29/1600/1000"],
    featured: false,
  },
  {
    slug: "the-grain-exchange",
    title: "The Grain Exchange",
    client: "Grain Exchange Bakery",
    year: "2024",
    tags: ["DESIGN", "DEV"],
    role: "Design, build & photography",
    stack: "Astro · Tailwind",
    summary: "A bakery site warm enough to fog your screen.",
    story:
      "They bake forty loaves a day and sell out by ten. The site's whole job is telling you what came out of the oven this morning — one photo, one list, updated daily from a phone. Simple on purpose.",
    hero: "https://picsum.photos/id/312/1600/1000",
    images: ["https://picsum.photos/id/365/1600/1000", "https://picsum.photos/id/1080/1600/1000"],
    featured: false,
  },
];

/* ── Photography ───────────────────────────────────────────────────────────── */

export type PhotoCategory = "Portrait" | "Landscape" | "Street" | "Events";

export type Photo = {
  id: string;
  src: string;
  alt: string;
  category: PhotoCategory;
  exif: string; // shown in JetBrains Mono under the photo
  w: number;
  h: number;
};

export const photos: Photo[] = [
  { id: "ph-01", src: "https://picsum.photos/id/1005/900/1200", alt: "Portrait of a man in window light", category: "Portrait", exif: "f/1.8 · 85mm · ISO 200", w: 900, h: 1200 },
  { id: "ph-02", src: "https://picsum.photos/id/1015/1200/800", alt: "River winding through a mountain valley", category: "Landscape", exif: "f/8 · 24mm · ISO 100", w: 1200, h: 800 },
  { id: "ph-03", src: "https://picsum.photos/id/1062/900/1200", alt: "Dog waiting at a rainy crosswalk", category: "Street", exif: "f/2.8 · 35mm · ISO 800", w: 900, h: 1200 },
  { id: "ph-04", src: "https://picsum.photos/id/1027/900/1200", alt: "Portrait of a woman with freckles", category: "Portrait", exif: "f/2 · 50mm · ISO 400", w: 900, h: 1200 },
  { id: "ph-05", src: "https://picsum.photos/id/1016/1200/800", alt: "Canyon walls at dusk", category: "Landscape", exif: "f/11 · 16mm · ISO 100", w: 1200, h: 800 },
  { id: "ph-06", src: "https://picsum.photos/id/1083/1200/800", alt: "First dance at a barn wedding", category: "Events", exif: "f/1.8 · 35mm · ISO 1600", w: 1200, h: 800 },
  { id: "ph-07", src: "https://picsum.photos/id/21/1200/800", alt: "Shoes on cobblestone, morning market", category: "Street", exif: "f/4 · 28mm · ISO 400", w: 1200, h: 800 },
  { id: "ph-08", src: "https://picsum.photos/id/177/1200/800", alt: "Fog rolling over a pine ridge", category: "Landscape", exif: "f/8 · 70mm · ISO 100", w: 1200, h: 800 },
  { id: "ph-09", src: "https://picsum.photos/id/338/900/1200", alt: "Bride laughing during the toast", category: "Events", exif: "f/2 · 85mm · ISO 800", w: 900, h: 1200 },
  { id: "ph-10", src: "https://picsum.photos/id/453/1200/800", alt: "Neon reflections after rain", category: "Street", exif: "f/1.4 · 35mm · ISO 3200", w: 1200, h: 800 },
  { id: "ph-11", src: "https://picsum.photos/id/823/900/1200", alt: "Portrait in late-summer field", category: "Portrait", exif: "f/1.8 · 135mm · ISO 100", w: 900, h: 1200 },
  { id: "ph-12", src: "https://picsum.photos/id/1052/1200/800", alt: "Confetti at the closing set", category: "Events", exif: "f/2.8 · 24mm · ISO 1600", w: 1200, h: 800 },
];

/* ── Spherical work gallery (mix of projects + photographs) ────────────────── */

export type GalleryItem = {
  id: string;
  caption: string; // tiny mono caption, top-left
  title: string; // top-right
  tags: string[]; // pill row, bottom-left
  year: string; // bottom-right
  image: string;
  href: string;
};

export const galleryItems: GalleryItem[] = [
  ...projects.map((p) => ({
    id: `pr-${p.slug}`,
    caption: p.client.toUpperCase(),
    title: p.title,
    tags: p.tags,
    year: p.year,
    image: p.hero.replace("/1600/1000", "/800/500"),
    href: `/work/${p.slug}`,
  })),
  ...photos.map((p) => ({
    id: p.id,
    caption: p.category.toUpperCase(),
    title: p.alt,
    tags: ["PHOTO", p.category.toUpperCase()],
    year: "2025",
    image: p.src.replace(/\/\d+\/\d+$/, p.w > p.h ? "/800/500" : "/500/800"),
    href: "/photography",
  })),
];

/* ── Services ──────────────────────────────────────────────────────────────── */

export type ServicePackage = {
  name: string;
  price: string; // owner edits freely, e.g. "from $1,500"
  timeline: string;
  includes: string[];
};

export const services = {
  snapshot: [
    {
      title: "Web Design",
      line: "Sites that feel hand-made because they are.",
      price: "from $1,500",
    },
    {
      title: "Photography",
      line: "Portraits, weddings, brands — honest light, no stiff poses.",
      price: "from $300",
    },
    {
      title: "Brand + Content",
      line: "The full story: identity, site, and the photos to fill it.",
      price: "from $2,500",
    },
  ],
  web: [
    {
      name: "Landing Page",
      price: "from $1,500",
      timeline: "2–3 weeks",
      includes: [
        "One-page design & build (Next.js)",
        "Copy polish & content structure",
        "Mobile-first, tested on real devices",
        "Basic SEO & analytics setup",
        "30 days of post-launch tweaks",
      ],
    },
    {
      name: "Full Site",
      price: "from $4,000",
      timeline: "4–6 weeks",
      includes: [
        "Up to 6 pages, designed & built",
        "CMS so you can edit everything",
        "Motion & interaction design",
        "Performance & accessibility pass",
        "60 days of post-launch support",
      ],
    },
    {
      name: "Site + Brand",
      price: "from $7,500",
      timeline: "6–9 weeks",
      includes: [
        "Everything in Full Site",
        "Logo, type & color system",
        "Brand photography half-day",
        "Social & OG template kit",
        "Launch-day hand-holding included",
      ],
    },
  ] as ServicePackage[],
  photo: [
    {
      name: "Portrait Session",
      price: "from $300",
      timeline: "1 hour · 20+ finals",
      includes: [
        "Location scouting together",
        "1 hour of shooting, no rush",
        "20+ edited high-res images",
        "Private online gallery",
        "Delivery within 5 days",
      ],
    },
    {
      name: "Event Half-Day",
      price: "from $900",
      timeline: "4 hours · 150+ finals",
      includes: [
        "4 hours of coverage",
        "150+ edited images",
        "Sneak peek within 48 hours",
        "Private gallery for guests",
        "Print rights included",
      ],
    },
    {
      name: "Brand Shoot",
      price: "from $1,800",
      timeline: "Full day · full library",
      includes: [
        "Creative direction & shot list",
        "Full-day shoot, 2 locations",
        "Full commercial usage rights",
        "Library sized for web & social",
        "Quarterly refresh option",
      ],
    },
  ] as ServicePackage[],
};

export const process = [
  { step: "01", name: "Discover", text: "Coffee first. Then we talk about your project — what it's for, who it's for, and what winning looks like." },
  { step: "02", name: "Design", text: "Moodboards, type tests, and one strong direction. You see the real thing early, not a mystery reveal." },
  { step: "03", name: "Build / Shoot", text: "Code gets written, shutters get pressed. You get progress links and sneak peeks the whole way." },
  { step: "04", name: "Deliver", text: "Launch day or gallery day. Everything handed over, documented, and yours — plus support after." },
];

/* ── Testimonials ──────────────────────────────────────────────────────────── */

export const testimonials = [
  {
    quote: "He asked better questions than agencies twice the price. The site paid for itself in a month — and the photos still stop me mid-scroll.",
    name: "Mara Ellison",
    role: "Founder, Northbound Coffee",
  },
  {
    quote: "We hired a web designer and somehow got a documentary photographer too. Our architecture finally looks online the way it feels in person.",
    name: "Daniel Reyes",
    role: "Partner, Studio Marrow",
  },
  {
    quote: "Our wedding gallery made my mother cry, twice. Then he rebuilt my studio's website and my bookings tripled. I don't understand it either.",
    name: "Priya Nair",
    role: "Ceramicist & very happy bride",
  },
];

/* ── Journal ───────────────────────────────────────────────────────────────── */

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  readTime: string;
  cover: string;
  excerpt: string;
  body: string[]; // paragraphs
};

export const posts: Post[] = [
  {
    slug: "why-i-shoot-before-i-design",
    title: "Why I shoot before I design",
    date: "2026-05-14",
    readTime: "4 min read",
    cover: "https://picsum.photos/id/250/1600/900",
    excerpt: "Every site I've ever rescued was drowning in stock photos. Here's why the camera comes out before Figma opens.",
    body: [
      "Every site I've ever been asked to rescue had the same disease: beautiful layout, dead photography. Stock images are wallpaper. They fill space and say nothing, and visitors can smell it in half a second.",
      "So I flipped my process. Before I open Figma, I visit the client. I shoot their hands, their room, their tools, their mess. Not portfolio shots — evidence. Proof that a real person does real work here.",
      "Then the design becomes easy, because it has something true to hold. The grid bends around the photographs instead of the other way around. Type gets quieter. Colors come from the images themselves.",
      "If you're building a site right now and it feels generic, the fix probably isn't another font pairing. It's a camera, an afternoon, and the courage to show the real thing.",
    ],
  },
  {
    slug: "golden-hour-is-a-deadline",
    title: "Golden hour is a deadline",
    date: "2026-03-02",
    readTime: "3 min read",
    cover: "https://picsum.photos/id/110/1600/900",
    excerpt: "The sun taught me more about project management than any book. You can't negotiate with light.",
    body: [
      "The sun does not care about your shot list. At 7:41 it will be perfect, at 8:05 it will be gone, and no amount of talent buys you an extension.",
      "Photography taught me to prepare ruthlessly and then improvise calmly. Scout early. Know your frame before the light arrives. And when the moment comes, stop fiddling and shoot.",
      "I run web projects the same way now. Decide the non-negotiables early, prepare everything you can control, and treat launch like a sunset — fixed, beautiful, and worth being ready for.",
    ],
  },
  {
    slug: "the-35mm-rule-for-homepages",
    title: "The 35mm rule for homepages",
    date: "2026-01-20",
    readTime: "5 min read",
    cover: "https://picsum.photos/id/319/1600/900",
    excerpt: "One focal length forces honesty. One message per screen does the same thing to a homepage.",
    body: [
      "For a whole year I shot everything on a 35mm lens. No zoom, no options. If I wanted a closer shot, I walked closer. It was infuriating for a month and then it made me better forever.",
      "Constraints force honesty. With one focal length, you stop hiding behind gear and start actually seeing. Composition becomes a decision instead of an accident.",
      "Homepages need the same rule. One message per screen. Not three CTAs, not a carousel of maybes — one clear thing, then the next. Visitors scroll like a camera pans: give them one composed frame at a time.",
      "When a client asks me to 'just add one more section,' I hear myself a year ago, reaching for the zoom. Walk closer instead. Cut the section. Say the one thing louder.",
    ],
  },
];

/* ── About ─────────────────────────────────────────────────────────────────── */

export const about = {
  portrait: "https://picsum.photos/id/64/900/1200", // REPLACE: your portrait
  teaser:
    "I fell into web design through a camera lens — I built my first site just to hang my photographs somewhere. Fifteen years later I still do both, and I still believe every pixel should earn its place in the story.",
  story: [
    "I didn't choose between design and photography — the camera chose first. I was nineteen, borrowing my uncle's beat-up DSLR, shooting everything that stood still long enough. When I ran out of walls to hang prints on, I taught myself HTML to build a place for them online. That scrappy little gallery was my first website, and I was hooked twice over.",
    "Fifteen years on, the two crafts have grown into one. Photography taught me to see — light, timing, what to leave out of the frame. Design taught me to build — structure, rhythm, how a story unfolds as you scroll. Every project I take on uses both eyes.",
    "I believe visual stories beat clever slogans, that whitespace is a feature, and that the best work happens when clients feel like collaborators. If you've got a story worth telling, I'd love to help you tell it — in pixels, in light, or both.",
  ],
  tools: ["Figma", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Lightroom", "Capture One", "Photoshop", "DaVinci Resolve"],
  gear: ["Fujifilm X-T5 (daily carry)", "Canon R6 II (events)", "35mm f/1.4 — the one lens", "85mm f/1.8 (portraits)", "16-35mm f/4 (landscapes)", "A tripod older than my career"],
  milestones: [
    { year: "2011", text: "Borrowed a camera. Never really gave it back." },
    { year: "2015", text: "First paid website — a bakery, traded partly for bread." },
    { year: "2020", text: "Went full-time freelance. Terrifying. Correct." },
    { year: "2025", text: "100th project shipped, 40th wedding shot, zero regrets." },
  ],
};

/* ── Contact ───────────────────────────────────────────────────────────────── */

export const contact = {
  headline: "Got a story to tell?",
  invitation:
    "Tell me what you're making. A site, a wedding, a brand, a wild idea — I read every message myself and reply within two days. Coffee first. Then we talk about your project.",
  projectTypes: ["Web design", "Photography", "Both"],
  budgets: ["Under $1,000", "$1,000 – $3,000", "$3,000 – $7,500", "$7,500+", "Not sure yet"],
};

/* ── Navigation & footer ───────────────────────────────────────────────────── */

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Photography", href: "/photography" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  explore: [
    { label: "Work", href: "/work" },
    { label: "Photography", href: "/photography" },
    { label: "Journal", href: "/journal" },
  ],
  connect: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
};
