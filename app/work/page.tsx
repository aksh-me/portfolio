import type { Metadata } from "next";
import WorkClient from "@/components/work/WorkClient";

export const metadata: Metadata = {
  title: "Work — Websites & Photography from St. John's, NL",
  description:
    "Selected websites and photographs by Aksh Patel — step inside the spherical gallery.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <WorkClient />;
}
