import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Build an optimized image URL from a Sanity image reference. */
export const urlFor = (source: Parameters<typeof builder.image>[0]) => builder.image(source);
