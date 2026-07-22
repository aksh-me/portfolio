import type { Metadata } from "next";
import Image from "next/image";
import { getTrailsData, getSiteData } from "@/lib/content-db";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Trails",
  description: "The hikes behind the landscape work — trails logged around Newfoundland.",
};

export default async function TrailsPage() {
  const [trails, site] = await Promise.all([
    getTrailsData(),
    getSiteData(),
  ]);

  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <SectionHeading
        as="h1"
        size="display-1"
        eyebrow={`Trails — ${site.city}`}
        title="Where the light *lives*"
      />
      <p className="mt-6 max-w-xl text-muted">{trails.intro}</p>

      {/* stats */}
      <Reveal className="mt-14 grid grid-cols-3 gap-6 border-y border-line py-8">
        {trails.stats?.map((s: any) => (
          <div key={s.label}>
            <p className="font-display text-3xl font-medium md:text-5xl">{s.value}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </Reveal>

      {/* trail list — alternating editorial rows */}
      <div className="mt-16 space-y-16 md:mt-24 md:space-y-28">
        {trails.list?.map((trail: any, i: number) => (
          <Reveal key={trail.name}>
            <article
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${
                i % 2 ? "md:[&>figure]:order-2" : ""
              }`}
            >
              <figure className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={trail.image}
                  alt={`${trail.name} — ${trail.location}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <figcaption className="absolute left-4 top-4 rounded-full bg-bg/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")} / {trail.difficulty}
                </figcaption>
              </figure>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {trail.location}
                </p>
                <h2 className="mt-2 font-display text-3xl font-medium md:text-4xl">{trail.name}</h2>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-5 font-mono text-sm sm:grid-cols-4">
                  {[
                    ["Distance", trail.distance],
                    ["Elevation", trail.elevation],
                    ["Time", trail.duration],
                    ["Hiked", trail.date],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</dt>
                      <dd className="mt-1.5">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 max-w-md leading-relaxed text-muted">{trail.note}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
