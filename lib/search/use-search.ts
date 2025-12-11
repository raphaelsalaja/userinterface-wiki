// lib/search/use-search.ts
"use client";

import * as React from "react";
import {
  parseSearchQuery,
  type SearchQuery,
  type SortOrder,
  serializeSearchQuery,
} from "./parser";

export interface UseSearchResult {
  // Raw input string
  input: string;
  setInput: (value: string) => void;

  // Parsed query object
  query: SearchQuery;

  // Derived sort order
  sort: SortOrder;

  // Add a filter programmatically (e.g., from suggestion click)
  addFilter: (type: "tag" | "author" | "sort", value: string) => void;

  // Remove a filter
  removeFilter: (type: "tag" | "author" | "sort", value: string) => void;

  // Add date filter
  addDateFilter: (type: "before" | "after" | "during", value: string) => void;

  // Clear everything
  clear: () => void;

  // Check if there's any search content
  hasContent: boolean;
}

export function useSearch(initialInput = ""): UseSearchResult {
  const [input, setInput] = React.useState(initialInput);

  // Parse on every input change
  const query = React.useMemo(() => parseSearchQuery(input), [input]);

  // Derive sort
  const sort = query.sort ?? "newest";

  // Add a filter programmatically
  const addFilter = React.useCallback(
    (type: "tag" | "author" | "sort", value: string) => {
      const current = parseSearchQuery(input);

      switch (type) {
        case "tag":
          current.tags = [...(current.tags ?? []), value];
          break;
        case "author":
          current.author = value;
          break;
        case "sort":
          current.sort = value as SortOrder;
          break;
      }

      setInput(serializeSearchQuery(current));
    },
    [input],
  );

  // Remove a filter
  const removeFilter = React.useCallback(
    (type: "tag" | "author" | "sort", value: string) => {
      const current = parseSearchQuery(input);

      switch (type) {
        case "tag":
          current.tags = current.tags?.filter((t) => t !== value);
          if (current.tags?.length === 0) delete current.tags;
          break;
        case "author":
          delete current.author;
          break;
        case "sort":
          delete current.sort;
          break;
      }

      setInput(serializeSearchQuery(current));
    },
    [input],
  );

  // Add date filter
  const addDateFilter = React.useCallback(
    (type: "before" | "after" | "during", value: string) => {
      // Just append to input - parser will handle it
      const prefix = input.trim() ? `${input.trim()} ` : "";
      setInput(`${prefix}${type}:${value}`);
    },
    [input],
  );

  // Clear everything
  const clear = React.useCallback(() => {
    setInput("");
  }, []);

  // Check if there's any content
  const hasContent =
    input.trim().length > 0 ||
    (query.tags?.length ?? 0) > 0 ||
    !!query.author ||
    query.text.length > 0;

  return {
    input,
    setInput,
    query,
    sort,
    addFilter,
    removeFilter,
    addDateFilter,
    clear,
    hasContent,
  };
}
