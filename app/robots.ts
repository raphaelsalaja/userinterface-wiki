import type { MetadataRoute } from "next";
import { SITE_MANIFEST } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/quote/og/*"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_MANIFEST.url}/sitemap.xml`,
  };
}
