import { site } from "@/data/content";

/**
 * Structured data (JSON-LD) for local SEO. Tells Google this is a real
 * local business + person in St. John's, NL, what services it offers, and
 * how it's connected to Instagram. Rendered once in the root layout.
 * Validate anytime at https://search.google.com/test/rich-results
 */
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#business`,
        name: `${site.name} — Photography, Video & Web Design`,
        url: site.url,
        email: site.email,
        image: `${site.url}/photos/cars/Image-1.jpg`,
        description:
          "Photography, videography, social media content and web design in St. John's, Newfoundland and Labrador.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "St. John's",
          addressRegion: "NL",
          addressCountry: "CA",
        },
        areaServed: [
          { "@type": "City", name: "St. John's" },
          { "@type": "State", name: "Newfoundland and Labrador" },
        ],
        priceRange: "$$",
        sameAs: [site.instagram],
        makesOffer: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Portrait photography" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event photography" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Videography" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Social media content" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web design" } },
        ],
        founder: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        jobTitle: "Photographer, Videographer & Web Designer",
        url: site.url,
        email: site.email,
        image: `${site.url}/photos/aksh.jpg`,
        homeLocation: { "@type": "City", name: "St. John's, Newfoundland and Labrador" },
        sameAs: [site.instagram],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON in a script tag — this is the standard Next.js pattern
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
