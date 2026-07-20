/**
 * Wiki content index - server-side helpers over the generated content index.
 *
 * The index is produced at build time by `scripts/generators/content-index`
 * and shared by the Ask AI route, llms.txt, and the markdown endpoints.
 */

import contentIndex from "./generated/content-index.json";

export interface WikiEntry {
  slug: string;
  title: string;
  description: string;
  date: string;
  markdown: string;
  text: string;
}

export const wikiEntries: WikiEntry[] = contentIndex;

export function getWikiEntry(slug: string): WikiEntry | undefined {
  return wikiEntries.find((entry) => entry.slug === slug);
}

export interface WikiSearchResult {
  slug: string;
  title: string;
  url: string;
  excerpt: string;
  score: number;
}

const EXCERPT_RADIUS = 240;

/**
 * Simple term-frequency search over the wiki. Title matches are weighted
 * heavily so direct article lookups rank first.
 */
export function searchWiki(query: string, limit = 3): WikiSearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2);

  if (terms.length === 0) return [];

  const results: WikiSearchResult[] = [];

  for (const entry of wikiEntries) {
    const titleLower = entry.title.toLowerCase();
    const textLower = entry.text.toLowerCase();

    let score = 0;
    let firstMatchIndex = -1;

    for (const term of terms) {
      if (titleLower.includes(term)) score += 10;
      if (entry.description.toLowerCase().includes(term)) score += 5;

      let index = textLower.indexOf(term);
      while (index !== -1) {
        score += 1;
        if (firstMatchIndex === -1) firstMatchIndex = index;
        index = textLower.indexOf(term, index + term.length);
      }
    }

    if (score === 0) continue;

    const start = Math.max(
      0,
      (firstMatchIndex === -1 ? 0 : firstMatchIndex) - 40,
    );
    const excerpt = entry.text.slice(start, start + EXCERPT_RADIUS).trim();

    results.push({
      slug: entry.slug,
      title: entry.title,
      url: `/${entry.slug}`,
      excerpt: `${start > 0 ? "…" : ""}${excerpt}…`,
      score,
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
