"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/content";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

/** Three full-width hairline rows that expand on hover (and keyboard focus). */
export default function ServicesSnapshot() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-40">
      <SectionHeading eyebrow="Services" title="Two crafts, one *eye*" />

      <div className="mt-14">
        {services.snapshot.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.08}>
            <Link
              href="/services"
              className="group block border-t border-line py-8 transition-colors last:border-b hover:bg-surface/60 focus-visible:bg-surface/60 md:py-10"
            >
              <div className="flex items-center justify-between gap-6">
                <h3 className="font-display text-2xl font-medium transition-colors group-hover:text-accent md:text-4xl">
                  {service.title}
                </h3>
                <div className="flex items-center gap-6">
                  <span className="hidden font-mono text-xs tracking-widest text-muted md:inline">
                    0{i + 1}
                  </span>
                  <ArrowUpRight
                    className="text-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                    size={22}
                  />
                </div>
              </div>
              <div className="grid grid-rows-[0fr] transition-all duration-500 ease-out-expo group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="flex flex-wrap items-baseline justify-between gap-4 pt-4">
                    <p className="max-w-xl text-sm text-muted md:text-base">{service.line}</p>
                    <span className="font-mono text-sm text-accent">{service.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
