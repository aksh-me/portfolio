import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import GalleryClient from "@/components/photography/GalleryClient";

export const metadata: Metadata = {
  title: "Photography",
  description: "Portraits, landscapes, street and events — honest light, no stiff poses.",
};

export default function PhotographyPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 pt-36 md:px-12 md:pt-44">
      <SectionHeading
        as="h1"
        size="display-1"
        eyebrow="Photography"
        title="Chasing *light*"
      />
      <p className="mt-6 max-w-xl text-muted">
        A rolling selection from recent shoots. Every frame here was made for a
        real person or a real brand — no staged stock, ever.
      </p>
      <GalleryClient />
    </div>
  );
}
