import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

/** The only large crimson surface on the site — make it count. */
export default function CtaBand() {
  return (
    <section className="mt-28 bg-accent md:mt-40">
      <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-10 px-6 py-24 md:flex-row md:items-end md:justify-between md:px-12 md:py-36">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
            New projects — welcome
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-display-1 font-medium text-white">
            Got a story to tell?
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <Button href="/contact" variant="invert" className="!px-10 !py-5 text-base">
            Let&apos;s talk
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
