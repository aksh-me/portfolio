import type { MetadataRoute } from "next";
import { posts, projects, site } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/photography", "/trails", "/services", "/journal", "/about", "/contact"].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
    })
  );

  return [
    ...staticRoutes,
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((p) => ({
      url: `${site.url}/journal/${p.slug}`,
      lastModified: new Date(p.date),
    })),
  ];
}
