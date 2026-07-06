import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { posts } from "@/data/content";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: [{ url: post.cover }] },
  };
}

export default async function JournalPostPage({ params }: Params) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {" · "}
          {post.readTime}
        </p>
        <SectionHeading as="h1" size="display-2" title={post.title} className="mt-4" />
      </div>

      <Reveal className="mx-auto mt-12 max-w-5xl">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.cover}
            alt={`Cover for “${post.title}”`}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <div className="prose prose-lg mx-auto mt-16 max-w-3xl dark:prose-invert prose-p:leading-relaxed prose-p:text-ink/90">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl border-t border-line pt-8">
        <Link
          href="/journal"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to the journal
        </Link>
      </div>
    </article>
  );
}
