import type { Metadata } from "next";
import { Check } from "lucide-react";
import { services, process, type ServicePackage } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Services",
  description: "Web design and photography packages — clear pricing, no surprises.",
};

function PackageCard({ pkg, delay }: { pkg: ServicePackage; delay: number }) {
  return (
    <Reveal delay={delay} className="flex">
      <div className="flex w-full flex-col border border-line bg-surface p-8 transition-colors hover:border-accent/40">
        <h3 className="font-display text-2xl font-medium">{pkg.name}</h3>
        <p className="mt-2 font-mono text-sm text-accent">{pkg.price}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {pkg.timeline}
        </p>
        <ul className="mt-8 flex-1 space-y-3">
          {pkg.includes.map((line) => (
            <li key={line} className="flex items-start gap-3 text-sm text-muted">
              <Check size={14} className="mt-1 shrink-0 text-accent" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Button href="/contact" variant="solid" className="w-full">
            Start a project
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <SectionHeading
        as="h1"
        size="display-1"
        eyebrow="Services & pricing"
        title="Pick your *story*"
      />
      <p className="mt-6 max-w-xl text-muted">
        Clear packages, honest pricing, no surprises halfway through. Every
        project starts with a conversation — coffee first.
      </p>

      {/* Web design packages */}
      <section className="mt-24">
        <SectionHeading eyebrow="01 — Web design" title="Websites" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.web.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* Photography packages */}
      <section className="mt-24">
        <SectionHeading eyebrow="02 — Photography" title="Shoots" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.photo.map((pkg, i) => (
            <PackageCard key={pkg.name} pkg={pkg} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* How I work */}
      <section className="mt-28">
        <SectionHeading eyebrow="How I work" title="Four steps, no *mystery*" />
        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-4">
          {process.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08} className="bg-bg">
              <div className="h-full p-8">
                <span className="font-mono text-xs text-accent">{step.step}</span>
                <h3 className="mt-4 font-display text-xl font-medium">{step.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
