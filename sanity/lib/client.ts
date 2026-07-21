import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/** Read client for fetching published content into the site. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // fast, cached; published content only
  perspective: "published",
});
