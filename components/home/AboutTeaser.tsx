import Image from "next/image";
import { about } from "@/data/content";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

export default function AboutTeaser() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pt-28 md:px-12 md:pt-40">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden">
            {/* REPLACE: portrait — swap for your own photo */}
            <Image
              src={about.portrait}
              alt="Portrait of [NAME]"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">About me</p>
          <p className="mt-6 max-w-lg font-display text-2xl font-medium leading-snug md:text-3xl">
            {about.teaser}
          </p>
          <div className="mt-10">
            <Button href="/about" variant="ghost">
              More about me
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
