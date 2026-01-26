import * as cheerio from "cheerio";
import type { OGMetadata } from "./types.js";

/**
 * Parse OpenGraph and Twitter Card metadata from HTML
 *
 * @param html - The HTML content to parse
 * @returns Extracted metadata
 */
export function parseOGMetadata(html: string): OGMetadata {
  const $ = cheerio.load(html);

  const getMeta = (selectors: string[]): string | undefined => {
    for (const selector of selectors) {
      const content = $(selector).attr("content");
      if (content) return content;
    }
    return undefined;
  };

  return {
    og: {
      title: getMeta(['meta[property="og:title"]']),
      description: getMeta(['meta[property="og:description"]']),
      image: getMeta(['meta[property="og:image"]']),
      url: getMeta(['meta[property="og:url"]']),
      type: getMeta(['meta[property="og:type"]']),
      siteName: getMeta(['meta[property="og:site_name"]']),
      locale: getMeta(['meta[property="og:locale"]']),
      imageWidth: getMeta(['meta[property="og:image:width"]']),
      imageHeight: getMeta(['meta[property="og:image:height"]']),
      imageAlt: getMeta(['meta[property="og:image:alt"]']),
    },
    twitter: {
      card: getMeta([
        'meta[name="twitter:card"]',
      ]) as OGMetadata["twitter"]["card"],
      title: getMeta(['meta[name="twitter:title"]']),
      description: getMeta(['meta[name="twitter:description"]']),
      image: getMeta(['meta[name="twitter:image"]']),
      site: getMeta(['meta[name="twitter:site"]']),
      creator: getMeta(['meta[name="twitter:creator"]']),
    },
    basic: {
      title: $("title").first().text() || undefined,
      description: getMeta(['meta[name="description"]']),
      canonical: $('link[rel="canonical"]').attr("href"),
    },
  };
}

/**
 * Fetch HTML from a URL and parse its OG metadata
 *
 * @param url - The URL to fetch
 * @returns Parsed metadata
 */
export async function fetchAndParseOGMetadata(
  url: string,
): Promise<OGMetadata> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "OG-Analyzer/1.0",
      Accept: "text/html",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  return parseOGMetadata(html);
}

/**
 * Get all meta tags from HTML (for debugging)
 *
 * @param html - The HTML content to parse
 * @returns Array of all meta tags with their attributes
 */
export function getAllMetaTags(
  html: string,
): Array<{ property?: string; name?: string; content?: string }> {
  const $ = cheerio.load(html);
  const metaTags: Array<{
    property?: string;
    name?: string;
    content?: string;
  }> = [];

  $("meta").each((_, element) => {
    const $el = $(element);
    const property = $el.attr("property");
    const name = $el.attr("name");
    const content = $el.attr("content");

    if (property || name) {
      metaTags.push({ property, name, content });
    }
  });

  return metaTags;
}
