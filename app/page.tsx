import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import PhotoStrip from "@/components/home/PhotoStrip";
import TrailsTeaser from "@/components/home/TrailsTeaser";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesSnapshot from "@/components/home/ServicesSnapshot";
import Testimonials from "@/components/home/Testimonials";
import JournalTeaser from "@/components/home/JournalTeaser";
import CtaBand from "@/components/home/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
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
