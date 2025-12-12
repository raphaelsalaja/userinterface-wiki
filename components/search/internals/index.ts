// ─────────────────────────────────────────────────────────────────────────────
// Internals - Not part of public API
// ─────────────────────────────────────────────────────────────────────────────

export type { SerializedChipNode } from "./chip-node";
export { $createChipNode, $isChipNode, ChipNode } from "./chip-node";
export type {
  SearchActions,
  SearchContextValue,
  SearchProviderProps,
  SearchState,
} from "./context";
export { SearchProvider, useSearchContext } from "./context";
export type { FilterOption } from "./filter-options";
export { FILTER_OPTIONS, SORT_OPTIONS } from "./filter-options";
export type {
  DateRange,
  SearchablePage,
  SearchQuery,
  SortOrder,
} from "./parser";
export {
  matchesQuery,
  parseSearchQuery,
  SearchString,
  serializeSearchQuery,
  sortPages,
} from "./parser";
export { SingleLinePlugin } from "./plugins";

export type { SuggestionResult } from "./use-suggestions";
export { useSuggestions } from "./use-suggestions";
