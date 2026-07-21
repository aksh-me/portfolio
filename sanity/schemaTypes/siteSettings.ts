import { defineField, defineType } from "sanity";

/** Global site info — name, contact, socials. Singleton. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "city", title: "City", type: "string" }),
    defineField({ name: "role", title: "Role / tagline", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.required() }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({
      name: "studioLine",
      title: "Studio line (small print)",
      type: "string",
      description: "e.g. “Photography, film & websites by Aksh Patel”",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
