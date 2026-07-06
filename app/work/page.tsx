import type { Metadata } from "next";
import WorkClient from "@/components/work/WorkClient";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected websites and photographs — step inside the spherical gallery.",
};

export default function WorkPage() {
  return <WorkClient />;
}
