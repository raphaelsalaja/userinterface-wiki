// lib/search/index.ts
export {
  type DateRange,
  matchesQuery,
  parseSearchQuery,
  type SearchablePage,
  type SearchQuery,
  type SortOrder,
  serializeSearchQuery,
  sortPages,
} from "./parser";

export { type UseSearchResult, useSearch } from "./use-search";
