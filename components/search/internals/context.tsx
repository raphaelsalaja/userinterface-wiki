"use client";

import type { LexicalEditor } from "lexical";
import * as React from "react";
import type { ChipPayload, SerializedPage, SortOrder } from "../types";

export interface SearchState {
  textContent: string;
  chips: ChipPayload[];

  open: boolean;
  highlightedIndex: number;

  filteredPages: SerializedPage[];
  sortOrder: SortOrder;
}

export interface SearchActions {
  setTextContent: (text: string) => void;
  setChips: (chips: ChipPayload[]) => void;
  setOpen: (open: boolean) => void;
  setHighlightedIndex: (index: number) => void;
  addChip: (chip: ChipPayload) => void;
  removeChip: (index: number) => void;
  clearAll: () => void;
  replaceLastWordWithChip: (
    type: ChipPayload["type"],
    value: string,
    negated: boolean,
  ) => void;
}

export interface SearchContextValue {
  state: SearchState;
  actions: SearchActions;

  pages: SerializedPage[];
  allTags: string[];

  editorRef: React.RefObject<LexicalEditor | null>;
  popupRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLDivElement | null>;

  getDataAttributes: () => Record<string, string>;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

export function useSearchContext(): SearchContextValue {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error(
      "Search compound components must be used within <Search.Root>",
    );
  }
  return context;
}

export interface SearchProviderProps {
  children: React.ReactNode;
  pages: SerializedPage[];
  allTags: string[];
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onQueryChange?: (query: { text: string; chips: ChipPayload[] }) => void;
}

export function SearchProvider({
  children,
  pages,
  allTags,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  onQueryChange,
}: SearchProviderProps) {
  const [textContent, setTextContentInternal] = React.useState("");
  const [chips, setChipsInternal] = React.useState<ChipPayload[]>([]);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);

  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  const editorRef = React.useRef<LexicalEditor | null>(null);
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLDivElement | null>(null);

  const setTextContent = React.useCallback(
    (text: string) => {
      setTextContentInternal(text);
      onQueryChange?.({ text, chips });
    },
    [chips, onQueryChange],
  );

  const setChips = React.useCallback(
    (newChips: ChipPayload[]) => {
      setChipsInternal(newChips);
      onQueryChange?.({ text: textContent, chips: newChips });
    },
    [textContent, onQueryChange],
  );

  const { filteredPages, sortOrder } = useFilteredPages({
    pages,
    textContent,
    chips,
  });

  const addChip = React.useCallback(
    (chip: ChipPayload) => {
      setChips([...chips, chip]);
    },
    [chips, setChips],
  );

  const removeChip = React.useCallback(
    (index: number) => {
      setChips(chips.filter((_, i) => i !== index));
    },
    [chips, setChips],
  );

  const clearAll = React.useCallback(() => {
    setTextContentInternal("");
    setChipsInternal([]);
    onQueryChange?.({ text: "", chips: [] });

    if (editorRef.current) {
      editorRef.current.update(() => {
        const { $getRoot, $isParagraphNode } = require("lexical");
        const root = $getRoot();
        root.clear();
        const firstChild = root.getFirstChild();
        if (firstChild && $isParagraphNode(firstChild)) {
          firstChild.select();
        }
      });
    }
  }, [onQueryChange]);

  const replaceLastWordWithChip = React.useCallback(
    (type: ChipPayload["type"], value: string, negated: boolean) => {
      if (!editorRef.current) return;

      editorRef.current.update(() => {
        const {
          $getSelection,
          $isRangeSelection,
          $isTextNode,
          $createTextNode,
        } = require("lexical");
        const { $createChipNode } = require("./chip-node");

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
    [],
  );

  const getDataAttributes = React.useCallback(() => {
    const hasContent = textContent.trim().length > 0 || chips.length > 0;
    return {
      "data-popup-open": open ? "" : undefined,
      "data-has-content": hasContent ? "" : undefined,
      "data-empty": !hasContent ? "" : undefined,
    } as Record<string, string>;
  }, [open, textContent, chips]);

  const state: SearchState = React.useMemo(
    () => ({
      textContent,
      chips,
      open,
      highlightedIndex,
      filteredPages,
      sortOrder,
    }),
    [textContent, chips, open, highlightedIndex, filteredPages, sortOrder],
  );

  const actions: SearchActions = React.useMemo(
    () => ({
      setTextContent,
      setChips,
      setOpen,
      setHighlightedIndex,
      addChip,
      removeChip,
      clearAll,
      replaceLastWordWithChip,
    }),
    [
      setTextContent,
      setChips,
      setOpen,
      addChip,
      removeChip,
      clearAll,
      replaceLastWordWithChip,
    ],
  );

  const contextValue: SearchContextValue = React.useMemo(
    () => ({
      state,
      actions,
      pages,
      allTags,
      editorRef,
      popupRef,
      inputRef,
      getDataAttributes,
    }),
    [state, actions, pages, allTags, getDataAttributes],
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}

function useFilteredPages({
  pages,
  textContent,
  chips,
}: {
  pages: SerializedPage[];
  textContent: string;
  chips: ChipPayload[];
}) {
  return React.useMemo(() => {
    const { matchesQuery, parseSearchQuery, sortPages } = require("./parser");

    const inputQuery = parseSearchQuery(textContent);
    const textTerms = [...(inputQuery.text || [])];

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
          if (chip.negated) negativeTags.push(chip.value);
          else positiveTags.push(chip.value);
          break;
        case "author":
          if (chip.negated) negAuthor = chip.value;
          else author = chip.value;
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

    if (inputQuery.tags) positiveTags.push(...inputQuery.tags);
    if (inputQuery.not?.tags) negativeTags.push(...inputQuery.not.tags);
    if (inputQuery.author) author = inputQuery.author;
    if (inputQuery.not?.author) negAuthor = inputQuery.not.author;
    if (inputQuery.sort) sort = inputQuery.sort;
    if (inputQuery.date?.before) before = inputQuery.date.before;
    if (inputQuery.date?.after) after = inputQuery.date.after;
    if (inputQuery.date?.during) during = inputQuery.date.during;

    const query: Record<string, unknown> = { text: textTerms };
    if (positiveTags.length > 0) query.tags = positiveTags;
    if (author) query.author = author;
    if (sort) query.sort = sort;
    if (before || after || during) {
      query.date = {};
      if (before) (query.date as Record<string, unknown>).before = before;
      if (after) (query.date as Record<string, unknown>).after = after;
      if (during) (query.date as Record<string, unknown>).during = during;
    }
    if (negativeTags.length > 0 || negAuthor) {
      query.not = {};
      if (negativeTags.length > 0)
        (query.not as Record<string, unknown>).tags = negativeTags;
      if (negAuthor) (query.not as Record<string, unknown>).author = negAuthor;
    }

    const sortOrder: SortOrder = (sort as SortOrder) ?? "newest";
    const filtered = pages.filter((page: SerializedPage) =>
      matchesQuery(page, query),
    );
    const sorted = sortPages(filtered, sortOrder);

    return { filteredPages: sorted, sortOrder };
  }, [pages, textContent, chips]);
}
