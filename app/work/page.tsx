import type { Metadata } from "next";
import WorkClient from "@/components/work/WorkClient";
import { getProjectsData, getPhotosData } from "@/lib/content-db";

export const metadata: Metadata = {
  title: "Work — Websites & Photography from St. John's, NL",
  description:
    "Selected websites and photographs by Aksh Patel — step inside the spherical gallery.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const [projectsData, photosData] = await Promise.all([
    getProjectsData(),
    getPhotosData(),
  ]);

  return <WorkClient projectsData={projectsData} photosData={photosData} />;
}
