"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/content";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

/** 4 featured projects in an alternating asymmetric grid. */
export default function SelectedWork({ projectsData }: { projectsData?: typeof projects }) {
  const currentProjects = projectsData || projects;
  const featured = currentProjects.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-40">
      <SectionHeading eyebrow="Selected work" title="Websites with a *pulse*" />

      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-12">
        {featured.map((project, i) => {
          const big = i % 2 === 0;
          return (
            <Reveal
              key={project.slug}
              delay={0.1}
              className={
                big
                  ? "md:col-span-7"
                  : "md:col-span-5 md:mt-24"
              }
            >
              <Link href={`/work/${project.slug}`} data-cursor="View" className="group block">
                <div className={`relative overflow-hidden ${big ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <Image
                    src={project.hero}
                    alt={`${project.title} — website design`}
                    fill
                    sizes="(max-width: 768px) 100vw, 58vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.07]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-6">
                  <h3 className="font-display text-xl font-medium transition-colors group-hover:text-accent md:text-2xl">
                    {project.title}
                  </h3>
                  <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    {[...project.tags, project.year].join(" · ")}
                  </span>
                </div>
                <p className="mt-2 max-w-md text-sm text-muted">{project.summary}</p>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-20">
        <Link
          href="/work"
          className="group inline-flex items-center gap-3 font-display text-xl font-medium transition-colors hover:text-accent md:text-2xl"
        >
          Step inside the full gallery
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" size={22} />
        </Link>
      </Reveal>
    </section>
  );
}
