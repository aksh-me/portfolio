import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import PhotoStrip from "@/components/home/PhotoStrip";
import TrailsTeaser from "@/components/home/TrailsTeaser";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesSnapshot from "@/components/home/ServicesSnapshot";
import Testimonials from "@/components/home/Testimonials";
import JournalTeaser from "@/components/home/JournalTeaser";
import CtaBand from "@/components/home/CtaBand";
import { getContent } from "@/lib/db";

// Live content — always reflects the latest admin save.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { hero } = await getContent();
  return (
    <>
      <Hero content={hero} />
      <SelectedWork />
      <PhotoStrip />
      <TrailsTeaser />
      <AboutTeaser />
      <ServicesSnapshot />
      <Testimonials />
      <JournalTeaser />
      <CtaBand />
    </>
  );
}
