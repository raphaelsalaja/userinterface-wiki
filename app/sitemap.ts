import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

const SITE_URL = "https://userinterface.wiki";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages();

  const articles = pages.map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: page.data.date?.modified
      ? new Date(page.data.date.modified)
      : new Date(page.data.date.published),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articles,
  ];
}
