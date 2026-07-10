import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { trails } from "@/data/content";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

/** Compact home-page band: a few stats + the trail thumbnails, linking out. */
export default function TrailsTeaser() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Off the clock" title="On the *trail*" />
        <Reveal>
          <div className="flex gap-8">
            {trails.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-medium md:text-3xl">{s.value}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {trails.list.map((trail, i) => (
          <Reveal key={trail.name} delay={i * 0.08}>
            <Link href="/trails" data-cursor="Open" className="group block">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={trail.image}
                  alt={`${trail.name} — ${trail.location}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-display text-sm font-medium transition-colors group-hover:text-accent md:text-base">
                {trail.name}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {trail.distance} · {trail.difficulty}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <Link
          href="/trails"
          className="group inline-flex items-center gap-3 font-display text-xl font-medium transition-colors hover:text-accent md:text-2xl"
        >
          Walk the trails
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" size={22} />
        </Link>
      </Reveal>
    </section>
  );
}
