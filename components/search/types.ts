// ─────────────────────────────────────────────────────────────────────────────
// Shared Types for Search Components
// ─────────────────────────────────────────────────────────────────────────────

import type { FilterOption } from "./internals/filter-options";

export interface ChipPayload {
  type: "tag" | "author" | "before" | "after" | "during" | "sort";
  value: string;
  negated: boolean;
}

export interface SerializedPage {
  url: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    name: string;
  };
  date: {
    published: string;
  };
}

export type SortOrder = "newest" | "oldest" | "relevance";

// ─────────────────────────────────────────────────────────────────────────────
// Suggestion Types
// ─────────────────────────────────────────────────────────────────────────────

export type SuggestionResult =
  | { type: "options"; items: FilterOption[] }
  | { type: "tags"; prefix: string; items: string[] }
  | { type: "authors"; prefix: string; items: string[] }
  | { type: "sort"; prefix: string; items: string[] }
  | {
      type: "date";
      dateType: "before" | "after" | "during";
      isNegated: boolean;
    }
  | null;
