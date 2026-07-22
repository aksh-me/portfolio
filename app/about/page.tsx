import type { Metadata } from "next";
import Image from "next/image";
import { Camera, Wrench } from "lucide-react";
import { getAboutData, getSiteData } from "@/lib/content-db";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "About — Photographer & Videographer in St. John's, NL",
  description:
    "Meet Aksh Patel — a photographer, videographer and web designer based in St. John's, Newfoundland, capturing the moments most people walk past.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [about, site] = await Promise.all([
    getAboutData(),
    getSiteData(),
  ]);

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <SectionHeading
        as="h1"
        size="display-1"
        eyebrow={`About — ${site.city}`}
        title="Two eyes, one *storyteller*"
      />

      <div className="mt-16 grid gap-12 md:grid-cols-[2fr_3fr] md:gap-20">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden md:sticky md:top-28">
            <Image
              src={about.portrait}
              alt={`Portrait of ${site.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        <div>
          {about.story?.map((paragraph: string, i: number) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className={`leading-relaxed ${i === 0 ? "font-display text-xl font-medium md:text-2xl" : "mt-8 text-muted"}`}>
                {paragraph}
              </p>
            </Reveal>
          ))}

          {/* tools */}
          <Reveal className="mt-16">
            <h2 className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              <Wrench size={14} className="text-accent" /> Tools of the trade
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {about.tools?.map((tool: string) => (
                <li
                  key={tool}
                  className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* camera bag */}
          <Reveal className="mt-12">
            <h2 className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-muted">
              <Camera size={14} className="text-accent" /> In the camera bag
            </h2>
            <ul className="mt-5 space-y-2">
              {about.gear?.map((item: string) => (
                <li key={item} className="font-mono text-sm text-muted">
                  — {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* milestones */}
          <Reveal className="mt-16">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Milestones</h2>
            <ol className="mt-6">
              {about.milestones?.map((m: any, idx: number) => (
                <li key={m.year + idx} className="flex gap-8 border-t border-line py-5 last:border-b">
                  <span className="font-mono text-sm text-accent">{m.year}</span>
                  <span className="text-sm text-ink">{m.text}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="mt-14">
            <Button href="/contact" variant="solid">
              Let&apos;s tell yours
            </Button>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
