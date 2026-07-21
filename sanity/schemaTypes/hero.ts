import { defineArrayMember, defineField, defineType } from "sanity";

/** Home hero — headline, sub, buttons, and the carousel slides. Singleton. */
export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow (small caps line)", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: "Wrap a word in *asterisks* to make it the crimson italic accent, e.g. “…people *walk* *past*.”",
      validation: (r) => r.required(),
    }),
    defineField({ name: "sub", title: "Sub-paragraph", type: "text", rows: 3 }),
    defineField({
      name: "ctaPrimary",
      title: "Primary button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary button",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "slides",
      title: "Carousel slides",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption (EXIF)",
              type: "string",
              description: "e.g. “17mm · f/8 · ISO 125”",
            }),
          ],
          preview: { select: { title: "caption", media: "image" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Hero" }),
  },
});
