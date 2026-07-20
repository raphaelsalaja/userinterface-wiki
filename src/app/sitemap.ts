import type { MetadataRoute } from "next";
import { SITE_MANIFEST } from "@/lib/site";
import { glossarySource, source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const articles = pages.map((page) => ({
    url: `${SITE_MANIFEST.url}${page.url}`,
    lastModified: new Date(page.data.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const glossaryEntries = glossarySource.getPages().map((page) => ({
    url: `${SITE_MANIFEST.url}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const surfaces = ["/glossary", "/vault"].map((path) => ({
    url: `${SITE_MANIFEST.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_MANIFEST.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articles,
    ...surfaces,
    ...glossaryEntries,
  ];
}
