import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { hero } from "./hero";

// Content types shown in the /admin editor. More sections get added here as
// we migrate them (projects, photos, services, about, journal, contact).
export const schemaTypes: SchemaTypeDefinition[] = [siteSettings, hero];
