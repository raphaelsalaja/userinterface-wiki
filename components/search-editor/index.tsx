"use client";

import { EditorContent } from "@tiptap/react";
import * as React from "react";
import { useSearchEditor } from "./hooks/use-search-editor";
import styles from "./styles.module.css";
import type { MenuHandlers, MenuState, SearchEditorProps } from "./types";
import type { OperatorKey } from "./utils";
import { OPERATOR_CONFIG } from "./utils/config";

export function SearchEditor({
  authors = [],
  tags = [],
  onQueryChange,
  placeholder = "Search…",
  className,
  autoFocus = false,
}: SearchEditorProps) {
  const { editor, menuState, handlers } = useSearchEditor({
    authors,
    tags,
    placeholder,
    autoFocus,
    onQueryChange,
  });

  return (
    <search
      className={className}
      data-search-editor=""
      onKeyDownCapture={handlers.onKeyDown}
    >
      <EditorContent editor={editor} />
      <SuggestionMenu state={menuState} handlers={handlers} />
    </search>
  );
}

interface SuggestionMenuProps {
  state: MenuState;
  handlers: MenuHandlers;
}

function SuggestionMenu({ state, handlers }: SuggestionMenuProps) {
  const { isOpen, items, selectedIndex, activeOperator } = state;
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const wasOpenRef = React.useRef(false);

  // Freeze content during exit animation
  const frozenStateRef = React.useRef<{
    items: string[];
    selectedIndex: number;
    activeOperator: OperatorKey | null;
  } | null>(null);

  const hasContent = isOpen && items.length > 0;

  React.useEffect(() => {
    if (hasContent && !wasOpenRef.current) {
      // Menu opening for the first time
      setShouldRender(true);
      setIsExiting(false);
      frozenStateRef.current = null;
      wasOpenRef.current = true;
    }

    if (hasContent && wasOpenRef.current) {
      // Menu content changed but staying open
      setShouldRender(true);
      setIsExiting(false);
      frozenStateRef.current = null;
    }

    if (!hasContent && wasOpenRef.current) {
      // Menu closing - freeze current state
      frozenStateRef.current = { items, selectedIndex, activeOperator };
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
        frozenStateRef.current = null;
        wasOpenRef.current = false;
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hasContent, items, selectedIndex, activeOperator]);

  if (!shouldRender) {
    return null;
  }

  // Use frozen state during exit, otherwise use live state
  const displayItems =
    isExiting && frozenStateRef.current ? frozenStateRef.current.items : items;
  const displaySelectedIndex =
    isExiting && frozenStateRef.current
      ? frozenStateRef.current.selectedIndex
      : selectedIndex;
  const displayActiveOperator =
    isExiting && frozenStateRef.current
      ? frozenStateRef.current.activeOperator
      : activeOperator;

  return (
    <div
      className={styles.menu}
      data-suggestion-menu=""
      data-exiting={isExiting}
    >
      <div className={styles.header}>
        <span className={styles.title}>
          {displayActiveOperator
            ? `Select ${displayActiveOperator}`
            : "SEARCH FILTERS"}
        </span>
        {!displayActiveOperator && (
          <span className={styles.shortcuts}>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select ·{" "}
            <kbd>Esc</kbd> to close
          </span>
        )}
      </div>

      <div className={styles.items}>
        {displayItems.map((item, index) => (
          <button
            key={item}
            type="button"
            className={styles.item}
            data-suggestion-item=""
            data-selected={index === displaySelectedIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (displayActiveOperator) {
                handlers.onValueSelect(item);
              } else {
                handlers.onOperatorSelect(item as OperatorKey);
              }
            }}
          >
            {displayActiveOperator ? (
              item
            ) : (
              <>
                <span className={styles.left}>
                  <span className={styles.operator}>{item}:</span>
                  <span className={styles.hint}>
                    {OPERATOR_CONFIG[item as OperatorKey]?.hint}
                  </span>
                </span>
                <span className={styles.example}>
                  {OPERATOR_CONFIG[item as OperatorKey]?.example}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {!displayActiveOperator && (
        <div className={styles.footer}>
          Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes for
          spaces: <code>author:"John Doe"</code>
        </div>
      )}
    </div>
  );
}
