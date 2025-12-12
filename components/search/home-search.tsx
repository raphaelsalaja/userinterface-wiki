"use client";

import { clsx } from "clsx";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from "lexical";
import Link from "next/link";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { Code } from "@/components/icons";
import { SearchIcon } from "@/components/icons/search";

import { $createChipNode } from "./internals/chip-node";
import { useSearchContext } from "./internals/context";
import type { FilterOption } from "./internals/filter-options";
import { useSuggestions } from "./internals/use-suggestions";
import { Input } from "./primitives/input";
import { Root } from "./primitives/root";
import styles from "./styles.module.css";
import type { ChipPayload, SerializedPage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface HomeSearchProps {
  pages: SerializedPage[];
  allTags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function HomeSearch({ pages, allTags }: HomeSearchProps) {
  return (
    <Root pages={pages} allTags={allTags}>
      <SearchInner pages={pages} allTags={allTags} />
    </Root>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Inner
// ─────────────────────────────────────────────────────────────────────────────

function SearchInner({ pages, allTags }: HomeSearchProps) {
  const { state, actions, editorRef } = useSearchContext();
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLDivElement>(null);

  const { suggestions, isNegated, checkWord } = useSuggestions(
    state.textContent,
    allTags,
    pages,
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Chip Handling
  // ───────────────────────────────────────────────────────────────────────────

  const replaceLastWordWithChip = React.useCallback(
    (type: ChipPayload["type"], value: string, negated: boolean) => {
      if (!editorRef.current) return;

      editorRef.current.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if ($isTextNode(anchorNode)) {
          const text = anchorNode.getTextContent();
          const offset = anchor.offset;

          let wordStart = offset;
          while (wordStart > 0 && text[wordStart - 1] !== " ") {
            wordStart--;
          }

          const beforeWord = text.slice(0, wordStart);
          const afterWord = text.slice(offset);

          anchorNode.setTextContent(beforeWord);

          const chipNode = $createChipNode({ type, value, negated });

          if (beforeWord) {
            anchorNode.insertAfter(chipNode);
          } else {
            const parent = anchorNode.getParent();
            if (parent) {
              anchorNode.remove();
              parent.append(chipNode);
            }
          }

          const afterNode = $createTextNode(afterWord || " ");
          chipNode.insertAfter(afterNode);
          afterNode.select(afterWord ? 0 : 1, afterWord ? 0 : 1);
        }
      });
    },
    [editorRef],
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Selection Handlers
  // ───────────────────────────────────────────────────────────────────────────

  const handleSelectSuggestion = React.useCallback(
    (item: string, type: ChipPayload["type"]) => {
      replaceLastWordWithChip(type, item, isNegated);
      actions.setOpen(false);
    },
    [replaceLastWordWithChip, isNegated, actions],
  );

  const handleSelectFilterOption = React.useCallback(
    (option: FilterOption) => {
      if (!editorRef.current) return;

      editorRef.current.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if ($isTextNode(anchorNode)) {
          const text = anchorNode.getTextContent();
          const offset = anchor.offset;

          let wordStart = offset;
          while (wordStart > 0 && text[wordStart - 1] !== " ") {
            wordStart--;
          }

          const beforeWord = text.slice(0, wordStart);
          anchorNode.setTextContent(beforeWord + option.key);
          anchorNode.select(beforeWord.length + option.key.length);
        } else {
          const textNode = $createTextNode(option.key);
          selection.insertNodes([textNode]);
          textNode.select(option.key.length);
        }
      });
      editorRef.current.focus();
    },
    [editorRef],
  );

  const handleSelectDate = React.useCallback(
    (date: Date, dateType: "before" | "after" | "during", negated: boolean) => {
      const formatted = date.toISOString().split("T")[0];
      replaceLastWordWithChip(dateType, formatted, negated);
      actions.setOpen(false);
      editorRef.current?.focus();
    },
    [replaceLastWordWithChip, actions, editorRef],
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Keyboard Navigation
  // ───────────────────────────────────────────────────────────────────────────

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.open || !suggestions) return;

      if (suggestions.type === "date") {
        if (e.key === "Escape") {
          actions.setOpen(false);
        }
        return;
      }

      const itemCount = suggestions.items?.length ?? 0;
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
            if (option) handleSelectFilterOption(option);
          } else if ("items" in suggestions && suggestions.items) {
            const item = suggestions.items[highlightedIndex];
            if (item) {
              let chipType: ChipPayload["type"] = "tag";
              if (checkWord.startsWith("author:")) chipType = "author";
              else if (checkWord.startsWith("sort:")) chipType = "sort";
              handleSelectSuggestion(item, chipType);
            }
          }
          break;
        case "Escape":
          actions.setOpen(false);
          break;
      }
    },
    [
      state.open,
      suggestions,
      highlightedIndex,
      checkWord,
      handleSelectFilterOption,
      handleSelectSuggestion,
      actions,
    ],
  );

  // ───────────────────────────────────────────────────────────────────────────
  // Effects
  // ───────────────────────────────────────────────────────────────────────────

  // Click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        actions.setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actions]);

  // Reset highlight when text changes
  const prevTextRef = React.useRef(state.textContent);
  if (prevTextRef.current !== state.textContent) {
    prevTextRef.current = state.textContent;
    if (highlightedIndex !== 0) {
      setHighlightedIndex(0);
    }
  }

  // Open popup when there are valid suggestions and input has focus
  React.useEffect(() => {
    const isFocused =
      inputRef.current?.contains(document.activeElement) ?? false;
    if (isFocused && suggestions && !state.open) {
      actions.setOpen(true);
    }
  }, [suggestions, state.open, actions]);

  // ───────────────────────────────────────────────────────────────────────────
  // Derived State
  // ───────────────────────────────────────────────────────────────────────────

  const hasContent =
    state.textContent.trim().length > 0 || state.chips.length > 0;

  const getChipType = (): ChipPayload["type"] => {
    if (checkWord.startsWith("author:")) return "author";
    if (checkWord.startsWith("sort:")) return "sort";
    return "tag";
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <React.Fragment>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: editor wrapper */}
      <div
        ref={inputRef}
        className={styles.search}
        onClick={() => editorRef.current?.focus()}
        onKeyDown={handleKeyDown}
      >
        <SearchIcon className={styles.icon} size={18} />

        <Input
          className={styles.wrapper}
          onFocus={() => actions.setOpen(true)}
        />

        {hasContent && (
          <button
            type="button"
            className={styles.clear}
            onClick={() => actions.clearAll()}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        {state.open && suggestions && (
          <div ref={popupRef} className={styles.popup}>
            <PopupHeader />

            {suggestions.type === "options" && (
              <FilterOptionsList
                options={suggestions.items}
                highlightedIndex={highlightedIndex}
                onSelect={handleSelectFilterOption}
              />
            )}

            {(suggestions.type === "tags" ||
              suggestions.type === "authors" ||
              suggestions.type === "sort") && (
              <ValueSuggestionsList
                type={suggestions.type}
                items={suggestions.items}
                highlightedIndex={highlightedIndex}
                onSelect={(item: string) =>
                  handleSelectSuggestion(item, getChipType())
                }
              />
            )}

            {suggestions.type === "date" && (
              <DatePickerSection
                dateType={suggestions.dateType}
                isNegated={suggestions.isNegated}
                onSelect={handleSelectDate}
              />
            )}

            <PopupFooter />
          </div>
        )}
      </div>

      <SearchResultsList />
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup Header
// ─────────────────────────────────────────────────────────────────────────────

function PopupHeader() {
  return (
    <div className={styles.popupheader}>
      <span className={styles.label}>Search Filters</span>
      <span className={styles.hint}>
        <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select ·{" "}
        <kbd>Esc</kbd> to close
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup Footer
// ─────────────────────────────────────────────────────────────────────────────

function PopupFooter() {
  return (
    <div className={styles.popupfooter}>
      <span className={styles.tip}>
        Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes for
        spaces: <code>author:"John Doe"</code>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Options List
// ─────────────────────────────────────────────────────────────────────────────

interface FilterOptionsListProps {
  options: FilterOption[];
  highlightedIndex: number;
  onSelect: (option: FilterOption) => void;
}

function FilterOptionsList({
  options,
  highlightedIndex,
  onSelect,
}: FilterOptionsListProps) {
  return (
    <div className={styles.list}>
      {options.map((option, index) => (
        <button
          type="button"
          key={option.key}
          className={clsx(
            styles.option,
            index === highlightedIndex && styles.highlighted,
          )}
          onClick={() => onSelect(option)}
        >
          <span className={styles.optionkey}>{option.label}</span>
          <span className={styles.optiondesc}>{option.description}</span>
          {option.example && (
            <span className={styles.optionexample}>{option.example}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Value Suggestions List
// ─────────────────────────────────────────────────────────────────────────────

interface ValueSuggestionsListProps {
  type: "tags" | "authors" | "sort";
  items: string[];
  highlightedIndex: number;
  onSelect: (item: string) => void;
}

function ValueSuggestionsList({
  type,
  items,
  highlightedIndex,
  onSelect,
}: ValueSuggestionsListProps) {
  const categoryLabel =
    type === "tags" ? "Tags" : type === "authors" ? "Authors" : "Sort Options";

  return (
    <>
      <div className={styles.category}>{categoryLabel}</div>
      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>No matches found</div>
        ) : (
          items.map((item, index) => (
            <button
              type="button"
              key={item}
              className={clsx(
                styles.option,
                index === highlightedIndex && styles.highlighted,
              )}
              onClick={() => onSelect(item)}
            >
              <span className={styles.optionkey}>{item}</span>
            </button>
          ))
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Picker Section
// ─────────────────────────────────────────────────────────────────────────────

interface DatePickerSectionProps {
  dateType: "before" | "after" | "during";
  isNegated: boolean;
  onSelect: (
    date: Date,
    dateType: "before" | "after" | "during",
    isNegated: boolean,
  ) => void;
}

function DatePickerSection({
  dateType,
  isNegated,
  onSelect,
}: DatePickerSectionProps) {
  return (
    <div className={styles.datepicker}>
      <DayPicker
        mode="single"
        onSelect={(date) => {
          if (date) {
            onSelect(date, dateType, isNegated);
          }
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Results List
// ─────────────────────────────────────────────────────────────────────────────

function SearchResultsList() {
  const { state, actions } = useSearchContext();
  const { filteredPages } = state;

  return (
    <>
      <div className={styles.resultcount}>
        {filteredPages.length}{" "}
        {filteredPages.length === 1 ? "article" : "articles"}
      </div>

      <div className={styles.posts}>
        {filteredPages.length === 0 ? (
          <NoResults onClear={() => actions.clearAll()} />
        ) : (
          filteredPages.map((page) => (
            <ArticleCard key={page.url} page={page} />
          ))
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// No Results
// ─────────────────────────────────────────────────────────────────────────────

interface NoResultsProps {
  onClear: () => void;
}

function NoResults({ onClear }: NoResultsProps) {
  return (
    <div className={styles.noresults}>
      <p>No articles match your search.</p>
      <button type="button" onClick={onClear} className={styles.clearbutton}>
        Clear filters
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Article Card
// ─────────────────────────────────────────────────────────────────────────────

interface ArticleCardProps {
  page: SerializedPage;
}

function ArticleCard({ page }: ArticleCardProps) {
  return (
    <Link href={{ pathname: page.url }} className={clsx(styles.post)}>
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
  );
}
