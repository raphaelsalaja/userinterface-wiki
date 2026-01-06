import type { MetadataRoute } from "next";
import { SITE_MANIFEST } from "@/lib/site";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const articles = pages.map((page) => ({
    url: `${SITE_MANIFEST.url}${page.url}`,
    lastModified: page.data.date?.modified
      ? new Date(page.data.date.modified)
      : new Date(page.data.date.published),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_MANIFEST.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articles,
  ];
}
