import type { Metadata } from "next";
import { Instagram, Mail } from "lucide-react";
import { contact, site } from "@/data/content";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell me what you're making — a site, a shoot, or both.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <div className="grid gap-16 md:grid-cols-2 md:gap-24">
        {/* left: warm invitation */}
        <div>
          <SectionHeading
            as="h1"
            size="display-1"
            eyebrow="Contact"
            title={contact.headline.replace("story", "*story*")}
          />
          <Reveal className="mt-8">
            <p className="max-w-md leading-relaxed text-muted">{contact.invitation}</p>
          </Reveal>

          <Reveal className="mt-12 space-y-4" delay={0.1}>
            <a
              href={`mailto:${site.email}`}
              className="group flex items-center gap-3 font-mono text-sm transition-colors hover:text-accent"
            >
              <Mail size={16} className="text-accent" />
              {site.email}
            </a>
            <a
              href={site.instagram}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 font-mono text-sm transition-colors hover:text-accent"
            >
              <Instagram size={16} className="text-accent" />
              @aksh.ae_
            </a>
          </Reveal>

          <Reveal className="mt-14 border-t border-line pt-8" delay={0.15}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
              Based in {site.city} — shooting anywhere the light is good.
            </p>
          </Reveal>
        </div>

        {/* right: the form */}
        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
