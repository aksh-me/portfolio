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
  name: "Aksh Patel",
  city: "St. John's, NL",
  role: "Photographer, videographer & web designer",
  email: "akanaiyalalp@mun.ca",
  instagram: "https://instagram.com/aksh.ae_",
  // Canonical site URL for SEO/OG/sitemap. NEXT_PUBLIC_SITE_URL in Vercel wins;
  // the fallback is the live custom domain.
  // (globalThis avoids clashing with the `process` steps array exported below)
  url: globalThis.process?.env?.NEXT_PUBLIC_SITE_URL || "https://www.axsh.me",
  studioLine: "Photography, film & websites by Aksh Patel",
};

/* ── Hero ──────────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "ST. JOHN'S, NL — PHOTO · VIDEO · WEB",
  // The word wrapped in *asterisks* becomes the crimson "dual-lens" trigger.
  headline: "I capture the moments most people walk past — every project starts with a *story*.",
  sub: "A photographer and filmmaker in St. John's, turning everyday moments into things worth keeping.",
  ctaPrimary: { label: "See the work", href: "/work" },
  ctaSecondary: { label: "Book a shoot", href: "/contact" },
  // The two hero background images the *story* word crossfades between.
  // The two backgrounds the *story* word crossfades between. Both are your
  // own night long-exposures for now — moody, not stock. When you add a real
  // web project later, you can point webImage at a screenshot of it.
  webImage: "/photos/cars/Image-1.jpg",
  photoImage: "/photos/portraits/harsh/Image-8.jpg",
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
  liveUrl?: string; // live site — embedded as a preview on the case study
  hero: string;
  images: [string, string];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "wedding-invitation",
    title: "Wedding Invitation",
    client: "Sarah & James",
    year: "2026",
    tags: ["DESIGN", "DEV"],
    role: "Design & build",
    stack: "Next.js · Tailwind · Framer Motion",
    summary: "A digital wedding invitation that feels like opening the envelope.",
    story:
      "A wedding invite shouldn't feel like a form — it should feel like a moment. I designed and built this one to unfold like the real thing: names, date and story revealed with soft motion, RSVP built right in. One link, sent with love, kept forever.",
    liveUrl: "https://wedding-invitation-steel-delta.vercel.app/wedding/sarah-james",
    // REPLACE: swap for real screenshots of the site (e.g. /work/wedding-1.jpg)
    hero: "https://picsum.photos/id/1073/1600/1000",
    images: ["https://picsum.photos/id/106/1600/1000", "https://picsum.photos/id/152/1600/1000"],
    featured: true,
  },
  {
    slug: "india-gate-restaurant",
    title: "India Gate Restaurant",
    client: "India Gate",
    year: "2026",
    tags: ["DESIGN", "DEV"],
    role: "Design & build",
    stack: "Next.js · Tailwind",
    summary: "A restaurant site that makes you hungry before the menu loads.",
    story:
      "India Gate needed more than a menu online — it needed the warmth of the place. I built the site around rich food imagery, a menu you can actually browse on your phone, and clear calls to order and visit. Simple to update, fast to load, easy to crave.",
    liveUrl: "https://india-gate-web.vercel.app/",
    // REPLACE: swap for real screenshots of the site (e.g. /work/indiagate-1.jpg)
    hero: "https://picsum.photos/id/292/1600/1000",
    images: ["https://picsum.photos/id/365/1600/1000", "https://picsum.photos/id/429/1600/1000"],
    featured: true,
  },
  {
    slug: "coffee-matters",
    title: "Coffee Matters",
    client: "Coffee Matters",
    year: "2026",
    tags: ["DESIGN", "DEV"],
    role: "Design & build",
    stack: "Next.js · Tailwind",
    summary: "A warm web home for a Newfoundland café that roasts its own beans.",
    story:
      "Coffee Matters has been pouring Newfoundland hospitality since 2007 — coffee roasted on-site, food made from scratch, two rooms with two personalities. The site had to feel like walking in out of the weather: warm tones, honest photography, a menu you can actually read, and locations a tap away. Come in out of it.",
    liveUrl: "https://coffee-matters.vercel.app/",
    // REPLACE: swap for real screenshots of the site (e.g. /work/coffee-1.jpg)
    hero: "https://picsum.photos/id/425/1600/1000",
    images: ["https://picsum.photos/id/766/1600/1000", "https://picsum.photos/id/1060/1600/1000"],
    featured: true,
  },
];

/* ── Photography ───────────────────────────────────────────────────────────── */

// Filter categories = the folders you organize your shots into.
// Rename these freely — the pills on /photography follow this list.
export type PhotoCategory = "Portraits" | "Streets" | "Nature" | "Cars";

export type Photo = {
  id: string;
  src: string; // local file in /public/photos — swap freely
  alt: string; // EDIT: describe each shot for accessibility + SEO
  category: PhotoCategory;
  exif: string; // real camera EXIF, shown in mono under the photo
  w: number;
  h: number;
  featured?: boolean; // featured shots appear in the /work sphere gallery
};

// Real images from /public/photos with authentic EXIF (Sony ZV-E10).
// The `alt` text is my best guess per shot — tweak to match what's actually
// in frame. Add or remove entries here to grow/shrink the gallery.
export const photos: Photo[] = [
  // ── Portraits ──
  { id: "ph-p1", src: "/photos/portraits/Image-1.jpg", alt: "Studio portrait in warm window light", category: "Portraits", exif: "f/7.1 · 50mm · ISO 100", w: 3718, h: 4648, featured: true },
  { id: "ph-p2", src: "/photos/portraits/Image-9.jpg", alt: "Portrait against a seamless backdrop", category: "Portraits", exif: "f/5.6 · 50mm · ISO 100", w: 4000, h: 5328, featured: true },
  { id: "ph-p3", src: "/photos/portraits/Image-4.jpg", alt: "Relaxed portrait in soft side light", category: "Portraits", exif: "f/5.6 · 39mm · ISO 100", w: 5142, h: 3860 },
  { id: "ph-p4", src: "/photos/portraits/Image-10.jpg", alt: "Portrait in even studio light", category: "Portraits", exif: "f/5.6 · 38mm · ISO 100", w: 3857, h: 5138 },
  { id: "ph-p5", src: "/photos/portraits/Image-12.jpg", alt: "Candid portrait, natural expression", category: "Portraits", exif: "f/5.6 · 41mm · ISO 100", w: 5328, h: 4000, featured: true },
  { id: "ph-v1", src: "/photos/portraits/vedant/Image-2.jpg", alt: "Vedant — outdoor portrait at golden hour", category: "Portraits", exif: "f/8 · 50mm · ISO 160", w: 4000, h: 5000, featured: true },
  { id: "ph-v2", src: "/photos/portraits/vedant/Image-9.jpg", alt: "Vedant — environmental portrait", category: "Portraits", exif: "f/6.3 · 33mm · ISO 125", w: 5000, h: 4000 },
  { id: "ph-v3", src: "/photos/portraits/vedant/Image-4.jpg", alt: "Vedant — standing portrait, open sky", category: "Portraits", exif: "f/8 · 50mm · ISO 160", w: 4000, h: 5000 },
  { id: "ph-v4", src: "/photos/portraits/vedant/Image-8.jpg", alt: "Vedant — candid moment outdoors", category: "Portraits", exif: "f/8 · 33mm · ISO 160", w: 4000, h: 5000, featured: true },
  { id: "ph-h1", src: "/photos/portraits/harsh/Image-8.jpg", alt: "Harsh — golden-hour portrait, wide frame", category: "Portraits", exif: "f/8 · 33mm · ISO 125", w: 6000, h: 4000, featured: true },
  { id: "ph-h2", src: "/photos/portraits/harsh/Image-12.jpg", alt: "Harsh — full-length outdoor portrait", category: "Portraits", exif: "f/8 · 50mm · ISO 125", w: 4000, h: 6000 },
  { id: "ph-h3", src: "/photos/portraits/harsh/Image-1.jpg", alt: "Harsh — relaxed portrait in daylight", category: "Portraits", exif: "f/8 · 50mm · ISO 160", w: 5000, h: 4000 },
  { id: "ph-h4", src: "/photos/portraits/harsh/Image-4.jpg", alt: "Harsh — portrait against open landscape", category: "Portraits", exif: "f/8 · 46mm · ISO 160", w: 4000, h: 5176, featured: true },

  // ── Streets ── (the red-car long exposures live under Cars — same files)
  { id: "ph-s2", src: "/photos/streets/Image-10.jpg", alt: "Traffic trails after dark, long exposure", category: "Streets", exif: "f/25 · 21mm · ISO 125 · 1/4s", w: 5328, h: 4000, featured: true },
  { id: "ph-s4", src: "/photos/streets/Image-8.jpg", alt: "Quiet street corner in afternoon light", category: "Streets", exif: "f/5.6 · 50mm · ISO 100", w: 4000, h: 5000, featured: true },
  { id: "ph-s5", src: "/photos/streets/Image-5.jpg", alt: "Passerby caught in warm afternoon light", category: "Streets", exif: "f/5.6 · 50mm · ISO 100", w: 3052, h: 3815 },
  { id: "ph-s6", src: "/photos/streets/Image-7.jpg", alt: "Tall vertical street scene", category: "Streets", exif: "f/1.8 · ISO 40", w: 5846, h: 7795 },
  { id: "ph-s7", src: "/photos/streets/Image-16.jpg", alt: "Vertical street frame, shallow depth", category: "Streets", exif: "f/1.8 · ISO 25", w: 3829, h: 5159, featured: true },
  { id: "ph-s8", src: "/photos/streets/Image-re-1.jpg", alt: "Street scene, wide crop", category: "Streets", exif: "f/1.8 · ISO 50", w: 7470, h: 7991 },

  // ── Nature ──
  { id: "ph-n1", src: "/photos/nature/Image-14.jpg", alt: "Wide mountain vista", category: "Nature", exif: "f/8 · 17mm · ISO 125", w: 5000, h: 4000, featured: true },
  { id: "ph-n2", src: "/photos/nature/Image-3.jpg", alt: "Mountain ridgeline at midday", category: "Nature", exif: "f/8 · 23mm · ISO 160", w: 5328, h: 4000, featured: true },
  { id: "ph-n3", src: "/photos/nature/Image-8.jpg", alt: "Distant peaks, telephoto compression", category: "Nature", exif: "f/8 · 50mm · ISO 160", w: 5328, h: 4000, featured: true },
  { id: "ph-n4", src: "/photos/nature/Image-7.jpg", alt: "Valley under a moving sky", category: "Nature", exif: "f/8 · 34mm · ISO 160", w: 5328, h: 4000 },
  { id: "ph-n5", src: "/photos/nature/Image-13.jpg", alt: "Rolling hills in soft haze", category: "Nature", exif: "f/8 · 46mm · ISO 125", w: 5000, h: 4000 },
  { id: "ph-n6", src: "/photos/nature/Image-6.jpg", alt: "Golden light across the slopes", category: "Nature", exif: "f/11 · 50mm · ISO 160", w: 5328, h: 4000 },

  // ── Cars ──
  { id: "ph-c1", src: "/photos/cars/Image-1.jpg", alt: "Parked car, downtown long exposure", category: "Cars", exif: "f/25 · 23mm · ISO 125 · 1/3s", w: 5327, h: 3999, featured: true },
  { id: "ph-c2", src: "/photos/cars/Image-2.jpg", alt: "Car detail under city lights", category: "Cars", exif: "f/29 · 40mm · ISO 125 · 1/3s", w: 3499, h: 4661 },
  { id: "ph-c3", src: "/photos/cars/Downtown.png", alt: "Downtown at blue hour", category: "Cars", exif: "Blue hour · long exposure", w: 1080, h: 1350 },
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
  // Only featured photos ride the sphere, kept ~24 cards total for 60fps.
  // Large local files are downscaled through the Next image optimizer so
  // Three.js loads a ~750px texture instead of the 5000px original.
  ...photos
    .filter((p) => p.featured)
    .map((p) => ({
      id: p.id,
      caption: p.category.toUpperCase(),
      title: p.alt,
      tags: ["PHOTO", p.category.toUpperCase()],
      year: "2025",
      image: `/_next/image?url=${encodeURIComponent(p.src)}&w=750&q=70`,
      href: "/photography",
    })),
];

/* ── Services ──────────────────────────────────────────────────────────────── */

export type ServicePackage = {
  name: string;
  price: string; // TODO: set your rates here, e.g. "from $150". "On request" for now.
  timeline: string;
  includes: string[];
};

// Four things Aksh offers. Pricing is "On request" until you settle on rates —
// just replace the `price` strings (e.g. "from $150") when you're ready.
export const services = {
  snapshot: [
    {
      title: "Photography",
      line: "Portraits, events, street and the outdoors — real moments, honest light.",
      price: "On request",
    },
    {
      title: "Videography",
      line: "Events, reels and short films that actually feel like the day.",
      price: "On request",
    },
    {
      title: "Social Media",
      line: "Content and a plan to keep your feed alive and growing.",
      price: "On request",
    },
    {
      title: "Web Design",
      line: "Clean, fast websites to show your work off properly.",
      price: "On request",
    },
  ],
  offerings: [
    {
      name: "Photography",
      price: "On request",
      timeline: "Portraits · Events · Outdoor",
      includes: [
        "A quick chat to plan the look and locations",
        "The shoot — relaxed, no stiff poses",
        "Hand-edited high-res images",
        "Private online gallery to share",
        "Fast turnaround, print-ready files",
      ],
    },
    {
      name: "Videography",
      price: "On request",
      timeline: "Events · Reels · Short films",
      includes: [
        "Concept and shot planning together",
        "Filming on the day",
        "Edit with music, pacing and color",
        "Short cuts sized for social",
        "Raw footage on request",
      ],
    },
    {
      name: "Social Media",
      price: "On request",
      timeline: "Monthly · Per campaign",
      includes: [
        "Simple content plan for the month",
        "Photo & video shot for feed and reels",
        "Captions, hashtags and scheduling",
        "Consistent posting, on-brand look",
        "A monthly check-in on what's working",
      ],
    },
    {
      name: "Web Design",
      price: "On request",
      timeline: "Landing page · Full site",
      includes: [
        "Design that fits your work",
        "Built responsive and fast (Next.js)",
        "Your photos and video, front and center",
        "Basic SEO so people find you",
        "Handover with everything documented",
      ],
    },
  ] as ServicePackage[],
};

export const process = [
  { step: "01", name: "Talk", text: "We start with a chat — what you need, who it's for, and the feeling you're going for. No pressure." },
  { step: "02", name: "Plan", text: "References, locations and a clear direction, so nothing on the day is a surprise." },
  { step: "03", name: "Create", text: "The shoot, the film, or the build. You get sneak peeks and progress the whole way through." },
  { step: "04", name: "Deliver", text: "Everything edited, handed over and yours to keep — plus a hand if you need anything after." },
];

/* ── Testimonials ──────────────────────────────────────────────────────────── */

// No testimonials yet — add them here as you collect them and the section
// will reappear on the home page automatically:
//   { quote: "…", name: "Client name", role: "What they do" }
export const testimonials: { quote: string; name: string; role: string }[] = [];

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
  portrait: "/photos/aksh.jpg", // your photo (4000x3000)
  teaser:
    "I've had a picture in my head of the kind of work I wanted to make for as long as I can remember — photography and video that hold on to the moments most people walk right past. This is me chasing that, one frame at a time.",
  story: [
    "I'm Aksh, a photographer and filmmaker based in St. John's, Newfoundland. The creative pull was there from the start — before I really knew what I was doing, I knew the kind of images and films I wanted to make. So I picked up a camera and started, and I haven't put it down since.",
    "What I love most is capturing the small things: the moments and the little events that slip by unnoticed. A look, a bit of light, the in-between seconds nobody thinks to photograph. Those are the frames I chase — the ones that turn an ordinary day into something you'll want to keep.",
    "I'm still early in this, and honestly that's the exciting part. I get a little better every time I try something new and put in the practice, and I want to build a whole career out of that. If you've got a moment, an event, or an idea worth capturing, I'd love to help you hold onto it.",
  ],
  // Confirm/adjust — pulled from your file EXIF (Sony ZV-E10).
  tools: ["Sony ZV-E10", "Lightroom", "Premiere Pro", "DaVinci Resolve", "Photoshop", "Canva", "Figma", "Meta Business Suite"],
  gear: ["Sony ZV-E10 — my main body", "Sony E 16–50mm kit lens", "Samsung Galaxy S25 FE — always in my pocket", "A tripod for the long exposures"],
  // Light, honest milestones — edit the years/text to match your story.
  milestones: [
    { year: "—", text: "Knew I wanted to make images and film, long before I owned a camera." },
    { year: "—", text: "Picked up my first camera and started shooting everything." },
    { year: "—", text: "Began shooting portraits and events for friends like Harsh and Vedant." },
    { year: "2026", text: "Launched this portfolio — the start of the career I'm building." },
  ],
};

/* ── Contact ───────────────────────────────────────────────────────────────── */

export const contact = {
  headline: "Got a moment to capture?",
  invitation:
    "Tell me what you're planning — a shoot, an event, a video, a website, or just an idea you're kicking around. I read every message myself and I'll get back to you quickly. No pressure, let's just talk.",
  projectTypes: ["Photography", "Videography", "Social media", "Web design", "Not sure yet"],
  budgets: ["Under $250", "$250 – $500", "$500 – $1,000", "$1,000+", "Not sure yet"],
};

/* ── Trails / hikes ────────────────────────────────────────────────────────── */

export type Trail = {
  name: string;
  location: string;
  distance: string;
  elevation: string;
  difficulty: string;
  duration: string;
  date: string;
  note: string;
  // REPLACE: drop your trail photo at /public/photos/trails/trail-N.jpg and
  // point this at "/photos/trails/trail-N.jpg". For now it reuses a nature shot.
  image: string;
};

export const trails = {
  intro:
    "Most of my landscape work starts with a walk. The good light rarely shows up where the car park is — so I hike out to meet it. Here's where the trail has taken me so far.",
  stats: [
    { value: "04", label: "Trails logged" },
    { value: "41 km", label: "Distance covered" },
    { value: "1,750 m", label: "Elevation gained" },
  ],
  list: [
    {
      name: "North Head Trail",
      location: "Signal Hill · St. John's, NL",
      distance: "3.4 km",
      elevation: "160 m gain",
      difficulty: "Moderate",
      duration: "1.5 hrs",
      date: "Sep 2025",
      note: "Right on my doorstep. Cliffs, the harbour narrows, and the North Atlantic throwing itself at the rocks. My warm-up hike and still my favourite at golden hour.",
      image: "/photos/nature/Image-14.jpg",
    },
    {
      name: "Skerwink Trail",
      location: "Port Rexton · Trinity Bay, NL",
      distance: "5.3 km",
      elevation: "180 m gain",
      difficulty: "Moderate",
      duration: "2 hrs",
      date: "Aug 2025",
      note: "Sea stacks, spruce and the odd whale offshore if you're lucky. Every corner opens onto a new frame — I filled a card and a half here.",
      image: "/photos/nature/Image-3.jpg",
    },
    {
      name: "Gros Morne Mountain",
      location: "Gros Morne National Park, NL",
      distance: "16 km",
      elevation: "806 m gain",
      difficulty: "Hard",
      duration: "6–8 hrs",
      date: "Jul 2025",
      note: "The big one. A long grind up the gully, then a plateau that feels like the top of the world. Thin air for Newfoundland, and the best summit light I've shot.",
      image: "/photos/nature/Image-8.jpg",
    },
    {
      name: "Spout Path",
      location: "East Coast Trail · Bay Bulls, NL",
      distance: "16 km",
      elevation: "620 m gain",
      difficulty: "Hard",
      duration: "6 hrs",
      date: "Jun 2025",
      note: "A wave-driven geyser at the halfway mark and headlands the whole way. Long, remote and worth every step — I'll be going back with the wide lens.",
      image: "/photos/nature/Image-7.jpg",
    },
  ] as Trail[],
};

/* ── Navigation & footer ───────────────────────────────────────────────────── */

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Photography", href: "/photography" },
  { label: "Trails", href: "/trails" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  explore: [
    { label: "Work", href: "/work" },
    { label: "Photography", href: "/photography" },
    { label: "Trails", href: "/trails" },
    { label: "Journal", href: "/journal" },
  ],
  connect: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
};
