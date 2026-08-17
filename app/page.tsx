import Hero from "@/components/home/Hero";
import PhotoStrip from "@/components/home/PhotoStrip";
import TrailsTeaser from "@/components/home/TrailsTeaser";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesSnapshot from "@/components/home/ServicesSnapshot";
import Testimonials from "@/components/home/Testimonials";
import JournalTeaser from "@/components/home/JournalTeaser";
import CtaBand from "@/components/home/CtaBand";
import { getSiteData, getHeroData, getPhotosData } from "@/lib/content-db";

// NOTE: the "Selected work" web-projects section is temporarily removed while
// the client demo sites are paused on Vercel. To restore it, re-add the
// SelectedWork import + getProjectsData fetch and drop <SelectedWork
// projectsData={projectsData} /> back in above <PhotoStrip />.
export default async function HomePage() {
  const [siteData, heroData, photosData] = await Promise.all([
    getSiteData(),
    getHeroData(),
    getPhotosData(),
  ]);

  return (
    <>
      <Hero heroData={heroData} siteData={siteData} />
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
