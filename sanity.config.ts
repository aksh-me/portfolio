import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

// The editor mounted at axsh.me/admin. Sanity's own login gates it —
// only invited project members can sign in and edit.
export default defineConfig({
  basePath: "/admin",
  name: "axsh_portfolio",
  title: "Aksh Patel — Content",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
