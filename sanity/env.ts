// Public Sanity values. Fallbacks are the real project's public IDs, so the
// studio build and content reads work even if the env vars aren't set.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "480o7clx";
