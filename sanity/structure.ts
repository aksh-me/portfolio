import type { StructureResolver } from "sanity/structure";

// Custom editor sidebar. Site Settings and Hero are singletons (one document
// each), so we open them directly instead of showing a "create new" list.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Hero")
        .id("hero")
        .child(S.document().schemaType("hero").documentId("hero")),
    ]);
