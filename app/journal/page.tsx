import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { posts } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on design, photography, and the places where they overlap.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <SectionHeading
        as="h1"
        size="display-1"
        eyebrow="Journal"
        title="Field *notes*"
      />
      <p className="mt-6 max-w-xl text-muted">
        Short essays on design, photography, and the places where the two
        crafts teach each other.
      </p>

      <div className="mt-16 space-y-16">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.06}>
            <Link
              href={`/journal/${post.slug}`}
              data-cursor="Read"
              className="group grid gap-8 border-t border-line pt-10 md:grid-cols-[2fr_3fr] md:items-center"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.cover}
                  alt={`Cover for “${post.title}”`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  {" · "}
                  {post.readTime}
                </p>
                <h2 className="mt-3 font-display text-2xl font-medium transition-colors group-hover:text-accent md:text-4xl">
                  {post.title}
                </h2>
                <p className="mt-4 max-w-xl text-muted">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
