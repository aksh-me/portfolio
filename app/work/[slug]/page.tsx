import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/content";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: { images: [{ url: project.hero }] },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      {/* fullscreen hero */}
      <div className="relative h-[72vh] min-h-[420px] md:h-[86vh]">
        <Image
          src={project.hero}
          alt={`${project.title} — hero`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        {/* subtle top band so the nav stays readable over bright photos */}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-bg via-bg/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-6 pb-12 md:px-12">
          <SectionHeading as="h1" size="display-1" title={project.title} eyebrow={project.summary} />
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        {/* mono meta table */}
        <Reveal className="mt-14 grid grid-cols-2 gap-y-8 border-y border-line py-8 font-mono text-sm md:grid-cols-4">
          {[
            ["Client", project.client],
            ["Role", project.role],
            ["Year", project.year],
            ["Stack", project.stack],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[10px] uppercase tracking-[0.3em] text-muted">{label}</dt>
              <dd className="mt-2">{value}</dd>
            </div>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-20 max-w-3xl">
          <p className="font-display text-xl font-medium leading-relaxed md:text-2xl">
            {project.story}
          </p>
        </Reveal>

        {/* Live site embedded — the real thing, not a screenshot */}
        {project.liveUrl && (
          <Reveal className="mt-20">
            <p className="mb-4 hidden font-mono text-xs uppercase tracking-[0.3em] text-muted md:block">
              Live preview
            </p>
            {/* embedded preview is desktop-only; phones get the button below */}
            <div className="relative hidden overflow-hidden rounded-sm border border-line bg-surface md:block md:aspect-[16/10]">
              <iframe
                src={project.liveUrl}
                title={`${project.title} — live site preview`}
                loading="lazy"
                className="h-full w-full"
              />
            </div>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Visit the live site
              <ArrowRight size={16} />
            </a>
          </Reveal>
        )}

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {project.images.map((src, i) => (
            <Reveal key={src} delay={i * 0.1}>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={src}
                  alt={`${project.title} — detail ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* next project */}
        <Reveal className="mt-28 border-t border-line pt-12">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Next project</p>
          <Link
            href={`/work/${next.slug}`}
            data-cursor="View"
            className="group mt-4 inline-flex items-center gap-4 font-display text-3xl font-medium transition-colors hover:text-accent md:text-5xl"
          >
            {next.title}
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" size={32} />
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
