"use client";

import { clsx } from "clsx";
import Link from "next/link";
import * as React from "react";
import { Code } from "@/components/icons";
import { SearchIcon } from "@/components/icons/search";
import {
  matchesQuery,
  parseSearchQuery,
  type SearchQuery,
  type SortOrder,
  sortPages,
} from "@/lib/search";

import styles from "./styles.module.css";

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

// UI representation of a committed filter chip
interface FilterChip {
  id: string;
  type: "tag" | "author" | "before" | "after" | "during" | "sort";
  value: string;
  negated: boolean;
}

// A segment is either a chip or a text span
type Segment =
  | { kind: "chip"; chip: FilterChip }
  | { kind: "text"; text: string; id: string };

interface FilterOption {
  key: string;
  label: string;
  description: string;
  example?: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    key: "tag:",
    label: "tag:",
    description: "Filter by tag",
    example: "tag:animation",
  },
  {
    key: "author:",
    label: "author:",
    description: "Filter by author",
    example: "author:John",
  },
  {
    key: "before:",
    label: "before:",
    description: "Published before date",
    example: "before:2024-01-01",
  },
  {
    key: "after:",
    label: "after:",
    description: "Published after date",
    example: "after:2024-01-01",
  },
  {
    key: "during:",
    label: "during:",
    description: "Published on exact date",
    example: "during:2024-06-15",
  },
  {
    key: "sort:",
    label: "sort:",
    description: "Sort results",
    example: "sort:oldest",
  },
];

// Extract filter type and value from a word like "tag:animation" or "-author:John"
function parseFilterWord(
  word: string,
): { type: FilterChip["type"]; value: string; negated: boolean } | null {
  const isNegated = word.startsWith("-");
  const checkWord = isNegated ? word.slice(1) : word;

  const filterTypes: FilterChip["type"][] = [
    "tag",
    "author",
    "before",
    "after",
    "during",
    "sort",
  ];

  for (const type of filterTypes) {
    const prefix = `${type}:`;
    if (checkWord.toLowerCase().startsWith(prefix)) {
      let value = checkWord.slice(prefix.length);
      // Handle quoted values
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (value) {
        return { type, value, negated: isNegated };
      }
    }
  }
  return null;
}

interface TagFilterProps {
  pages: SerializedPage[];
  allTags: string[];
}

export const TagFilter = ({ pages, allTags }: TagFilterProps) => {
  // Ordered segments: chips and text in the order they were entered
  const [segments, setSegments] = React.useState<Segment[]>([]);
  // Current text the user is typing (the active input at the end)
  const [inputValue, setInputValue] = React.useState("");
  const [showOptions, setShowOptions] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  // Extract all chips from segments for query building
  const chips = React.useMemo(
    () =>
      segments
        .filter(
          (s): s is { kind: "chip"; chip: FilterChip } => s.kind === "chip",
        )
        .map((s) => s.chip),
    [segments],
  );

  // Build a SearchQuery from segments + current input
  const query: SearchQuery = React.useMemo(() => {
    // Parse current input for any in-progress filters
    const inputQuery = parseSearchQuery(inputValue);

    // Start with text from segments + input text terms
    const textTerms = [...inputQuery.text];
    for (const seg of segments) {
      if (seg.kind === "text" && seg.text.trim()) {
        textTerms.push(seg.text.trim());
      }
    }

    const result: SearchQuery = { text: textTerms };

    const positiveTags: string[] = [];
    const negativeTags: string[] = [];
    let author: string | undefined;
    let negAuthor: string | undefined;
    let sort: SortOrder | undefined;
    let before: number | undefined;
    let after: number | undefined;
    let during: { start: number; end: number } | undefined;

    for (const chip of chips) {
      switch (chip.type) {
        case "tag":
          if (chip.negated) {
            negativeTags.push(chip.value);
          } else {
            positiveTags.push(chip.value);
          }
          break;
        case "author":
          if (chip.negated) {
            negAuthor = chip.value;
          } else {
            author = chip.value;
          }
          break;
        case "sort":
          sort = chip.value as SortOrder;
          break;
        case "before":
          before = new Date(chip.value).getTime() / 1000;
          break;
        case "after":
          after = new Date(chip.value).getTime() / 1000;
          break;
        case "during": {
          const start = new Date(chip.value).getTime() / 1000;
          during = { start, end: start + 86400 };
          break;
        }
      }
    }

    // Merge with any filters from current input (in case user is mid-typing)
    if (inputQuery.tags) {
      positiveTags.push(...inputQuery.tags);
    }
    if (inputQuery.not?.tags) {
      negativeTags.push(...inputQuery.not.tags);
    }
    if (inputQuery.author) author = inputQuery.author;
    if (inputQuery.not?.author) negAuthor = inputQuery.not.author;
    if (inputQuery.sort) sort = inputQuery.sort;
    if (inputQuery.date?.before) before = inputQuery.date.before;
    if (inputQuery.date?.after) after = inputQuery.date.after;
    if (inputQuery.date?.during) during = inputQuery.date.during;

    if (positiveTags.length > 0) result.tags = positiveTags;
    if (author) result.author = author;
    if (sort) result.sort = sort;
    if (before || after || during) {
      result.date = {};
      if (before) result.date.before = before;
      if (after) result.date.after = after;
      if (during) result.date.during = during;
    }
    if (negativeTags.length > 0 || negAuthor) {
      result.not = {};
      if (negativeTags.length > 0) result.not.tags = negativeTags;
      if (negAuthor) result.not.author = negAuthor;
    }

    return result;
  }, [chips, segments, inputValue]);

  // Get sort order (default to newest)
  const sort: SortOrder = query.sort ?? "newest";

  // Add a chip from current input
  const commitChip = (
    type: FilterChip["type"],
    value: string,
    negated: boolean,
  ) => {
    const newChip: FilterChip = {
      id: `chip-${Date.now()}-${Math.random()}`,
      type,
      value,
      negated,
    };
    setSegments((prev) => [...prev, { kind: "chip", chip: newChip }]);
  };

  // Commit plain text as a segment (before a chip)
  const commitText = (text: string) => {
    if (text.trim()) {
      setSegments((prev) => [
        ...prev,
        { kind: "text", text: text.trim(), id: `text-${Date.now()}` },
      ]);
    }
  };

  // Clear everything
  const clearAll = () => {
    setSegments([]);
    setInputValue("");
  };

  // Filter and sort pages using the new parser functions
  const filteredPages = React.useMemo(() => {
    // SerializedPage matches SearchablePage structure, use directly
    const filtered = pages.filter((page) => matchesQuery(page, query));
    return sortPages(filtered, sort);
  }, [pages, query, sort]);

  // Handle input change - auto-commit completed filters when space is pressed
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Check if user just typed a space (potential filter completion)
    if (newValue.endsWith(" ") && !inputValue.endsWith(" ")) {
      const words = newValue.trimEnd().split(" ");
      const lastWord = words[words.length - 1];

      if (lastWord) {
        const parsed = parseFilterWord(lastWord);

        // Only auto-commit if it's a valid complete filter
        if (parsed) {
          words.pop();
          // Commit any preceding plain text first
          const precedingText = words.join(" ").trim();
          if (precedingText) {
            commitText(precedingText);
          }
          // Then commit the chip
          commitChip(parsed.type, parsed.value, parsed.negated);
          setInputValue("");
          return;
        }
      }
    }

    setInputValue(newValue);
  };

  // Get suggestions based on current input
  const suggestions = React.useMemo(() => {
    const trimmed = inputValue.trimEnd();
    const lastWord = trimmed.split(" ").pop() || "";
    const lastWordLower = lastWord.toLowerCase();

    // Handle negated filters
    const isNegated = lastWordLower.startsWith("-");
    const checkWord = isNegated ? lastWordLower.slice(1) : lastWordLower;

    // Check for filter value suggestions FIRST (when typing after "filter:")
    if (checkWord.startsWith("tag:")) {
      const tagQuery = checkWord.slice(4).toLowerCase();
      const matchingTags = allTags.filter((tag) =>
        tag.toLowerCase().includes(tagQuery),
      );
      return {
        type: "tags" as const,
        prefix: isNegated ? "-tag:" : "tag:",
        items: matchingTags,
      };
    }

    if (checkWord.startsWith("author:")) {
      const authorQuery = checkWord.slice(7).toLowerCase();
      const authors = [...new Set(pages.map((p) => p.author.name))];
      const matchingAuthors = authors.filter((author) =>
        author.toLowerCase().includes(authorQuery),
      );
      return {
        type: "authors" as const,
        prefix: isNegated ? "-author:" : "author:",
        items: matchingAuthors,
      };
    }

    if (checkWord.startsWith("sort:")) {
      const sortQuery = checkWord.slice(5).toLowerCase();
      const sortOptions = ["newest", "oldest", "relevance"].filter((opt) =>
        opt.includes(sortQuery),
      );
      return {
        type: "sort" as const,
        prefix: "sort:",
        items: sortOptions,
      };
    }

    // Show filter options when empty or typing a partial filter keyword
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
      return {
        type: "options" as const,
        items: matchingOptions,
      };
    }

    return null;
  }, [inputValue, allTags, pages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace when input is empty - unwrap last segment back to text
    if (e.key === "Backspace" && inputValue === "" && segments.length > 0) {
      e.preventDefault();
      const lastSegment = segments[segments.length - 1];

      // Convert segment back to editable text
      let restoredText = "";
      if (lastSegment.kind === "chip") {
        const chip = lastSegment.chip;
        const prefix = chip.negated ? "-" : "";
        const value = chip.value.includes(" ") ? `"${chip.value}"` : chip.value;
        restoredText = `${prefix}${chip.type}:${value}`;
      } else {
        restoredText = lastSegment.text;
      }

      setSegments((prev) => prev.slice(0, -1));
      setInputValue(restoredText);
      return;
    }

    if (!showOptions || !suggestions) return;

    const itemCount = suggestions.items.length;
    if (itemCount === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => (i + 1) % itemCount);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => (i - 1 + itemCount) % itemCount);
        break;
      case "Tab":
      case "Enter":
        e.preventDefault();
        if (suggestions.type === "options") {
          const option = suggestions.items[highlightedIndex];
          if (option) {
            // Replace current word with filter prefix (continue typing)
            const trimmed = inputValue.trimEnd();
            const words = trimmed.split(" ");
            if (!inputValue.endsWith(" ") && words.length > 0) {
              words.pop();
            }
            const base = words.join(" ");
            setInputValue(base ? `${base} ${option.key}` : option.key);
          }
        } else {
          const item = suggestions.items[highlightedIndex];
          if (item) {
            // Commit as chip, clear from input
            const trimmed = inputValue.trimEnd();
            const words = trimmed.split(" ");
            const lastWord = words.pop() || "";

            // Determine negation and type from what user was typing
            const isNegated = lastWord.startsWith("-");
            const checkWord = isNegated ? lastWord.slice(1) : lastWord;
            let chipType: FilterChip["type"] = "tag";
            if (checkWord.startsWith("author:")) chipType = "author";
            else if (checkWord.startsWith("sort:")) chipType = "sort";
            else if (checkWord.startsWith("before:")) chipType = "before";
            else if (checkWord.startsWith("after:")) chipType = "after";
            else if (checkWord.startsWith("during:")) chipType = "during";

            // Commit any preceding plain text first
            const precedingText = words.join(" ").trim();
            if (precedingText) {
              commitText(precedingText);
            }

            // Add the chip
            commitChip(chipType, item, isNegated);

            // Clear input
            setInputValue("");
          }
        }
        break;
      case "Escape":
        setShowOptions(false);
        break;
    }
  };

  // Click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlight when input changes
  const prevInputRef = React.useRef(inputValue);
  if (prevInputRef.current !== inputValue) {
    prevInputRef.current = inputValue;
    if (highlightedIndex !== 0) {
      setHighlightedIndex(0);
    }
  }

  const hasContent = inputValue.length > 0 || segments.length > 0;

  // Focus input when clicking wrapper
  const handleWrapperClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.chip}`)) return;
    if ((e.target as HTMLElement).closest(`.${styles.textsegment}`)) return;
    inputRef.current?.focus();
  };

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: wrapper delegates to input */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: clickable wrapper for UX */}
      <div className={styles.search} onClick={handleWrapperClick}>
        <SearchIcon className={styles.icon} size={18} />

        <div ref={wrapperRef} className={styles.wrapper}>
          {segments.map((segment) =>
            segment.kind === "chip" ? (
              <span
                key={segment.chip.id}
                className={clsx(
                  styles.chip,
                  segment.chip.negated && styles.negated,
                )}
              >
                {segment.chip.negated && (
                  <span className={styles.chipnegated}>-</span>
                )}
                <span className={styles.chiptype}>{segment.chip.type}:</span>
                <span>{segment.chip.value}</span>
              </span>
            ) : (
              <span key={segment.id} className={styles.textsegment}>
                {segment.text}
              </span>
            ),
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowOptions(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              segments.length === 0 && !inputValue ? "Search articles…" : ""
            }
            className={styles.input}
          />
        </div>

        {hasContent && (
          <button
            type="button"
            className={styles.clear}
            onClick={clearAll}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {showOptions && suggestions && (
          <div ref={popupRef} className={styles.popup}>
            <div className={styles.popupheader}>
              <span className={styles.label}>Search Filters</span>
              <span className={styles.hint}>
                <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select
                · <kbd>Esc</kbd> to close
              </span>
            </div>

            {suggestions.type === "options" && (
              <div className={styles.list}>
                {suggestions.items.map((option, index) => (
                  <button
                    type="button"
                    key={option.key}
                    className={clsx(
                      styles.option,
                      index === highlightedIndex && styles.highlighted,
                    )}
                    onClick={() => {
                      const trimmed = inputValue.trimEnd();
                      const words = trimmed.split(" ");
                      if (!inputValue.endsWith(" ") && words.length > 0) {
                        words.pop();
                      }
                      const base = words.join(" ");
                      setInputValue(
                        base ? `${base} ${option.key}` : option.key,
                      );
                      inputRef.current?.focus();
                    }}
                  >
                    <span className={styles.optionkey}>{option.label}</span>
                    <span className={styles.optiondesc}>
                      {option.description}
                    </span>
                    {option.example && (
                      <span className={styles.optionexample}>
                        {option.example}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {(suggestions.type === "tags" ||
              suggestions.type === "authors" ||
              suggestions.type === "sort") && (
              <>
                <div className={styles.category}>
                  {suggestions.type === "tags"
                    ? "Tags"
                    : suggestions.type === "authors"
                      ? "Authors"
                      : "Sort Options"}
                </div>
                <div className={styles.list}>
                  {suggestions.items.length === 0 ? (
                    <div className={styles.empty}>No matches found</div>
                  ) : (
                    suggestions.items.map((item, index) => (
                      <button
                        type="button"
                        key={item}
                        className={clsx(
                          styles.option,
                          index === highlightedIndex && styles.highlighted,
                        )}
                        onClick={() => {
                          // Commit as chip, clear from input
                          const trimmed = inputValue.trimEnd();
                          const words = trimmed.split(" ");
                          const lastWord = words.pop() || "";

                          // Determine negation and type from what user was typing
                          const isNegated = lastWord.startsWith("-");
                          const checkWord = isNegated
                            ? lastWord.slice(1)
                            : lastWord;
                          let chipType: FilterChip["type"] = "tag";
                          if (checkWord.startsWith("author:"))
                            chipType = "author";
                          else if (checkWord.startsWith("sort:"))
                            chipType = "sort";
                          else if (checkWord.startsWith("before:"))
                            chipType = "before";
                          else if (checkWord.startsWith("after:"))
                            chipType = "after";
                          else if (checkWord.startsWith("during:"))
                            chipType = "during";

                          // Commit any preceding plain text first
                          const precedingText = words.join(" ").trim();
                          if (precedingText) {
                            commitText(precedingText);
                          }

                          // Add the chip
                          commitChip(chipType, item, isNegated);

                          // Clear input
                          setInputValue("");
                          inputRef.current?.focus();
                        }}
                      >
                        <span className={styles.optionkey}>{item}</span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}

            <div className={styles.popupfooter}>
              <span className={styles.tip}>
                Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes
                for spaces: <code>author:"John Doe"</code>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.resultcount}>
        {filteredPages.length}{" "}
        {filteredPages.length === 1 ? "article" : "articles"}
      </div>

      <div className={styles.posts}>
        {filteredPages.length === 0 ? (
          <div className={styles.noresults}>
            <p>No articles match your search.</p>
            <button
              type="button"
              onClick={clearAll}
              className={styles.clearbutton}
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredPages.map((page) => (
            <Link
              key={page.url}
              href={{ pathname: page.url }}
              className={clsx(styles.post)}
            >
              <div className={styles.details}>
                <div className={styles.preview}>
                  <Code />
                </div>
                <div>
                  <h2 className={styles.cardtitle}>{page.title}</h2>
                  <span className={styles.meta}>
                    <span>{page.author.name}</span>
                    <span className={styles.separator} />
                    <span>{page.date.published}</span>
                  </span>
                </div>
              </div>
              <div>
                <p className={styles.description}>{page.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};
