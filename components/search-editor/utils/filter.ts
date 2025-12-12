import { parse, test, type LiqeQuery } from "liqe";
import { normalizeQuery, extractSort, type SortOption } from "./serializer";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FilterableDocument {
  title: string;
  author?: string;
  tag?: string | string[];
  date?: string | Date;
  [key: string]: unknown;
}

export interface FilterResult<T> {
  items: T[];
  sort: SortOption | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Document Adapter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prepare a document for liqe filtering.
 * Ensures consistent field names and formats.
 */
function prepareDocument<T extends FilterableDocument>(doc: T): Record<string, unknown> {
  const prepared: Record<string, unknown> = { ...doc };

  // Normalize date to ISO string for comparison
  if (doc.date) {
    prepared.date =
      doc.date instanceof Date ? doc.date.toISOString().split("T")[0] : String(doc.date).split("T")[0];
  }

  // Normalize tags to array
  if (doc.tag && !Array.isArray(doc.tag)) {
    prepared.tag = [doc.tag];
  }

  return prepared;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter documents using a query string.
 *
 * @example
 * const results = filterDocs(posts, "author:john tag:design");
 * // results.items = matching posts
 * // results.sort = null
 *
 * @example
 * const results = filterDocs(posts, "tag:react sort:newest");
 * // results.items = posts with tag:react
 * // results.sort = "newest"
 */
export function filterDocs<T extends FilterableDocument>(docs: T[], query: string): FilterResult<T> {
  // Extract sort before normalizing
  const sort = extractSort(query);

  // Remove sort from query for filtering
  const filterQuery = query.replace(/sort:\S+/gi, "").trim();

  // Normalize query for liqe
  const normalized = normalizeQuery(filterQuery);

  // Handle empty or wildcard queries
  if (normalized === "*" || !normalized) {
    return { items: [...docs], sort };
  }

  let parsedQuery: LiqeQuery;
  try {
    parsedQuery = parse(normalized);
  } catch (error) {
    // If parsing fails, return all docs
    console.warn("Failed to parse query:", normalized, error);
    return { items: [...docs], sort };
  }

  // Filter documents
  const filtered = docs.filter((doc) => {
    const prepared = prepareDocument(doc);
    try {
      return test(parsedQuery, prepared);
    } catch {
      return false;
    }
  });

  return { items: filtered, sort };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sort documents by the specified sort option.
 */
export function sortDocs<T extends FilterableDocument>(docs: T[], sort: SortOption | null): T[] {
  if (!sort) return docs;

  const sorted = [...docs];

  switch (sort) {
    case "newest":
      sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case "oldest":
      sorted.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });
      break;
    case "a-z":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "z-a":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }

  return sorted;
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined Filter & Sort
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter and sort documents in one call.
 */
export function filterAndSortDocs<T extends FilterableDocument>(docs: T[], query: string): T[] {
  const { items, sort } = filterDocs(docs, query);
  return sortDocs(items, sort);
}
