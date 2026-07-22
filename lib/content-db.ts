import { createClient } from "@/lib/supabase/server";
import * as staticContent from "@/data/content";

export async function getSectionData<T>(sectionName: string, fallback: T): Promise<T> {
  try {
    const supabase = await createClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from("portfolio_content")
      .select("data")
      .eq("section", sectionName)
      .single();

    if (error || !data || !data.data) {
      return fallback;
    }

    return data.data as T;
  } catch (err) {
    console.error(`Error fetching section ${sectionName} from Supabase:`, err);
    return fallback;
  }
}

export async function getSiteData() {
  return getSectionData("site", staticContent.site);
}

export async function getHeroData() {
  return getSectionData("hero", staticContent.hero);
}

export async function getProjectsData() {
  return getSectionData("projects", staticContent.projects);
}

export async function getPhotosData() {
  return getSectionData("photos", staticContent.photos);
}

export async function getServicesData() {
  return getSectionData("services", staticContent.services);
}

export async function getProcessData() {
  return getSectionData("process", staticContent.process);
}

export async function getTestimonialsData() {
  return getSectionData("testimonials", staticContent.testimonials);
}

export async function getPostsData() {
  return getSectionData("posts", staticContent.posts);
}

export async function getAboutData() {
  return getSectionData("about", staticContent.about);
}

export async function getContactData() {
  return getSectionData("contact", staticContent.contact);
}

export async function getTrailsData() {
  return getSectionData("trails", staticContent.trails);
}

export async function getAllPortfolioData() {
  const [
    site,
    hero,
    projects,
    photos,
    services,
    process,
    testimonials,
    posts,
    about,
    contact,
    trails,
  ] = await Promise.all([
    getSiteData(),
    getHeroData(),
    getProjectsData(),
    getPhotosData(),
    getServicesData(),
    getProcessData(),
    getTestimonialsData(),
    getPostsData(),
    getAboutData(),
    getContactData(),
    getTrailsData(),
  ]);

  return {
    site,
    hero,
    projects,
    photos,
    services,
    process,
    testimonials,
    posts,
    about,
    contact,
    trails,
  };
}
