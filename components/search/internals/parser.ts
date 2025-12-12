import SearchString from "search-string";

export type SortOrder = "relevance" | "newest" | "oldest";

export interface DateRange {
  before?: number; // unix timestamp (seconds)
  after?: number;
  during?: { start: number; end: number };
}

export interface SearchQuery {
  text: string[]; // free text tokens
  tags?: string[]; // tag:
  author?: string; // author:
  sort?: SortOrder; // sort:
  date?: DateRange; // before: after: during:
  not?: {
    tags?: string[];
    author?: string;
  };
}

// The SearchString library types
interface TextSegment {
  text: string;
  negated: boolean;
}

interface Condition {
  keyword: string;
  value: string;
  negated: boolean;
}

export function parseSearchQuery(input: string): SearchQuery {
  const parsed = SearchString.parse(input);
  const textSegments: TextSegment[] = parsed.getTextSegments();
  const conditions: Condition[] = parsed.getConditionArray();

  const result: SearchQuery = { text: [] };
  const notBucket: NonNullable<SearchQuery["not"]> = {};

  // Process text segments (free text)
  for (const seg of textSegments) {
    if (seg.text.trim()) {
      result.text.push(seg.text);
    }
  }

  // Process conditions (operator:value pairs)
  for (const cond of conditions) {
    const keyword = cond.keyword.toLowerCase();
    const value = cond.value;
    const target = cond.negated ? notBucket : result;

    switch (keyword) {
      case "tag":
        pushArrayField(target, "tags", value);
        break;
      case "author":
      case "from":
        setField(target, "author", value);
        break;
      case "sort":
        result.sort = parseSort(value);
        break;
      case "before": {
        const ts = parseDateOrRelative(value);
        if (!ts) break;
        result.date = result.date ?? {};
        result.date.before = ts;
        break;
      }
      case "after": {
        const ts = parseDateOrRelative(value);
        if (!ts) break;
        result.date = result.date ?? {};
        result.date.after = ts;
        break;
      }
      case "during": {
        const range = parseDuring(value);
        if (!range) break;
        result.date = result.date ?? {};
        result.date.during = range;
        break;
      }
    }
  }

  if (Object.keys(notBucket).length > 0) {
    result.not = notBucket;
  }

  return result;
}

/* ===========================
   Helpers
   =========================== */

function setField<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K],
) {
  obj[key] = value;
}

function pushArrayField<T extends Record<string, unknown>>(
  obj: T,
  key: keyof T,
  value: string,
) {
  const existing = obj[key];
  if (!existing) {
    (obj as Record<string, unknown>)[key as string] = [value];
    return;
  }
  if (Array.isArray(existing)) {
    existing.push(value);
    return;
  }
  (obj as Record<string, unknown>)[key as string] = [existing, value];
}

function parseSort(value: string): SortOrder {
  switch (value.toLowerCase()) {
    case "new":
    case "newest":
      return "newest";
    case "old":
    case "oldest":
      return "oldest";
    default:
      return "relevance";
  }
}

/**
 * Parses date values:
 * - ISO date strings: 2024-01-01
 * - Relative values: 3d, 6h, 10m, 2w
 * Returns unix timestamp in seconds.
 */
function parseDateOrRelative(value: string): number | null {
  // Relative, like 3d, 6h, 10m
  const relMatch = value.match(/^(\d+)([smhdw])$/);
  if (relMatch) {
    const amount = Number(relMatch[1]);
    const unit = relMatch[2];

    const now = Date.now();
    let deltaMs = 0;

    switch (unit) {
      case "s":
        deltaMs = amount * 1000;
        break;
      case "m":
        deltaMs = amount * 60 * 1000;
        break;
      case "h":
        deltaMs = amount * 60 * 60 * 1000;
        break;
      case "d":
        deltaMs = amount * 24 * 60 * 60 * 1000;
        break;
      case "w":
        deltaMs = amount * 7 * 24 * 60 * 60 * 1000;
        break;
    }

    const target = now - deltaMs;
    return Math.floor(target / 1000);
  }

  // Try absolute date
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return Math.floor(date.getTime() / 1000);
  }

  return null;
}

/**
 * during:2024-01-01
 * Interprets as "that entire day" in UTC
 */
function parseDuring(value: string): { start: number; end: number } | null {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;

  const start = Math.floor(date.getTime() / 1000);
  const end = start + 24 * 60 * 60; // plus one day

  return { start, end };
}

/* ===========================
   Serialization (query -> string)
   =========================== */

export function serializeSearchQuery(query: SearchQuery): string {
  const parts: string[] = [];

  // Tags
  if (query.tags) {
    for (const tag of query.tags) {
      parts.push(tag.includes(" ") ? `tag:"${tag}"` : `tag:${tag}`);
    }
  }

  // Negated tags
  if (query.not?.tags) {
    for (const tag of query.not.tags) {
      parts.push(tag.includes(" ") ? `-tag:"${tag}"` : `-tag:${tag}`);
    }
  }

  // Author
  if (query.author) {
    parts.push(
      query.author.includes(" ")
        ? `author:"${query.author}"`
        : `author:${query.author}`,
    );
  }

  // Negated author
  if (query.not?.author) {
    parts.push(
      query.not.author.includes(" ")
        ? `-author:"${query.not.author}"`
        : `-author:${query.not.author}`,
    );
  }

  // Sort
  if (query.sort && query.sort !== "relevance") {
    parts.push(`sort:${query.sort}`);
  }

  // Date filters (serialize as ISO dates for readability)
  if (query.date?.before) {
    const d = new Date(query.date.before * 1000);
    parts.push(`before:${d.toISOString().split("T")[0]}`);
  }
  if (query.date?.after) {
    const d = new Date(query.date.after * 1000);
    parts.push(`after:${d.toISOString().split("T")[0]}`);
  }
  if (query.date?.during) {
    const d = new Date(query.date.during.start * 1000);
    parts.push(`during:${d.toISOString().split("T")[0]}`);
  }

  // Free text
  for (const t of query.text) {
    parts.push(t.includes(" ") ? `"${t}"` : t);
  }

  return parts.join(" ");
}

/* ===========================
   Matching (for filtering pages)
   =========================== */

export interface SearchablePage {
  title: string;
  description: string;
  tags: string[];
  author: { name: string };
  date: { published: string };
}

export function matchesQuery(
  page: SearchablePage,
  query: SearchQuery,
): boolean {
  // Check tags (AND logic - all must match)
  if (query.tags) {
    for (const tag of query.tags) {
      if (!page.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))) {
        return false;
      }
    }
  }

  // Check negated tags (must NOT match any)
  if (query.not?.tags) {
    for (const tag of query.not.tags) {
      if (page.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))) {
        return false;
      }
    }
  }

  // Check author
  if (query.author) {
    if (!page.author.name.toLowerCase().includes(query.author.toLowerCase())) {
      return false;
    }
  }

  // Check negated author
  if (query.not?.author) {
    if (
      page.author.name.toLowerCase().includes(query.not.author.toLowerCase())
    ) {
      return false;
    }
  }

  // Check date filters
  if (query.date) {
    const pageTs = Math.floor(new Date(page.date.published).getTime() / 1000);

    if (query.date.before && pageTs >= query.date.before) {
      return false;
    }
    if (query.date.after && pageTs <= query.date.after) {
      return false;
    }
    if (query.date.during) {
      if (pageTs < query.date.during.start || pageTs >= query.date.during.end) {
        return false;
      }
    }
  }

  // Check free text (AND logic - all must match in title or description)
  for (const term of query.text) {
    const lower = term.toLowerCase();
    if (
      !page.title.toLowerCase().includes(lower) &&
      !page.description.toLowerCase().includes(lower)
    ) {
      return false;
    }
  }

  return true;
}

export function sortPages<T extends SearchablePage>(
  pages: T[],
  sort: SortOrder,
): T[] {
  if (sort === "relevance") {
    // For now, relevance = original order
    return pages;
  }

  return [...pages].sort((a, b) => {
    const dateA = new Date(a.date.published).getTime();
    const dateB = new Date(b.date.published).getTime();
    return sort === "newest" ? dateB - dateA : dateA - dateB;
  });
}

/* ===========================
   Re-export SearchString for UI use
   =========================== */

export { SearchString };
