"use client";

import * as React from "react";
import type { SerializedPage } from "../types";
import {
  FILTER_OPTIONS,
  type FilterOption,
  SORT_OPTIONS,
} from "./filter-options";

// ─────────────────────────────────────────────────────────────────────────────
// Types
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

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useSuggestions(
  textContent: string,
  allTags: string[],
  pages: SerializedPage[],
) {
  const lastWord = React.useMemo(() => {
    const trimmed = textContent.trimEnd();
    return trimmed.split(" ").pop() || "";
  }, [textContent]);

  const lastWordLower = lastWord.toLowerCase();
  const isNegated = lastWordLower.startsWith("-");
  const checkWord = isNegated ? lastWordLower.slice(1) : lastWordLower;

  const suggestions = React.useMemo((): SuggestionResult => {
    if (checkWord.startsWith("tag:")) {
      const tagQuery = checkWord.slice(4).toLowerCase();
      const matchingTags = allTags.filter((tag) =>
        tag.toLowerCase().includes(tagQuery),
      );
      return {
        type: "tags",
        prefix: isNegated ? "-tag:" : "tag:",
        items: matchingTags,
      };
    }

    if (checkWord.startsWith("author:")) {
      const authorQuery = checkWord.slice(7).toLowerCase();
      const authors = [...new Set(pages.map((p) => p.author.name))];
      const matchingAuthors = authors.filter((a) =>
        a.toLowerCase().includes(authorQuery),
      );
      return {
        type: "authors",
        prefix: isNegated ? "-author:" : "author:",
        items: matchingAuthors,
      };
    }

    if (checkWord.startsWith("sort:")) {
      const sortQuery = checkWord.slice(5).toLowerCase();
      const sortOptions = SORT_OPTIONS.filter((opt) => opt.includes(sortQuery));
      return { type: "sort", prefix: "sort:", items: [...sortOptions] };
    }

    if (
      checkWord.startsWith("before:") ||
      checkWord.startsWith("after:") ||
      checkWord.startsWith("during:")
    ) {
      let dateType: "before" | "after" | "during" = "during";
      if (checkWord.startsWith("before:")) dateType = "before";
      else if (checkWord.startsWith("after:")) dateType = "after";
      return { type: "date", dateType, isNegated };
    }

    if (
      !lastWord ||
      (!checkWord.includes(":") &&
        FILTER_OPTIONS.some((opt) =>
          opt.key.slice(0, -1).startsWith(checkWord),
        ))
    ) {
      const matchingOptions = FILTER_OPTIONS.filter(
        (opt) => !checkWord || opt.key.toLowerCase().startsWith(checkWord),
      );
      return { type: "options", items: matchingOptions };
    }

    return null;
  }, [checkWord, isNegated, lastWord, allTags, pages]);

  return { suggestions, lastWord, isNegated, checkWord };
}
