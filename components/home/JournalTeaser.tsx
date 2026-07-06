import Link from "next/link";
import Image from "next/image";
import { posts } from "@/data/content";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function JournalTeaser() {
  const latest = posts.slice(0, 2);

  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-40">
      <SectionHeading eyebrow="Journal" title="Notes from both *crafts*" />

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        {latest.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.1}>
            <Link href={`/journal/${post.slug}`} className="group block" data-cursor="Read">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.cover}
                  alt={`Cover for “${post.title}”`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                />
              </div>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                {" · "}
                {post.readTime}
              </p>
              <h3 className="mt-2 font-display text-xl font-medium transition-colors group-hover:text-accent md:text-2xl">
                {post.title}
              </h3>
              <p className="mt-2 max-w-lg text-sm text-muted">{post.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
