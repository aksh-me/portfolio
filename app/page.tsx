import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import PhotoStrip from "@/components/home/PhotoStrip";
import TrailsTeaser from "@/components/home/TrailsTeaser";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesSnapshot from "@/components/home/ServicesSnapshot";
import Testimonials from "@/components/home/Testimonials";
import JournalTeaser from "@/components/home/JournalTeaser";
import CtaBand from "@/components/home/CtaBand";
import {
  getSiteData,
  getHeroData,
  getProjectsData,
  getPhotosData,
} from "@/lib/content-db";

export default async function HomePage() {
  const [siteData, heroData, projectsData, photosData] = await Promise.all([
    getSiteData(),
    getHeroData(),
    getProjectsData(),
    getPhotosData(),
  ]);

  return (
    <>
      <Hero heroData={heroData} siteData={siteData} />
      <SelectedWork projectsData={projectsData} />
      <PhotoStrip photosData={photosData} />
      <TrailsTeaser />
      <AboutTeaser />
      <ServicesSnapshot />
      <Testimonials />
      <JournalTeaser />
      <CtaBand />
    </>
  );
}
