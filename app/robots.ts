import type { MetadataRoute } from "next";
import { SITE_MANIFEST } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_MANIFEST.url}/sitemap.xml`,
  };
}
