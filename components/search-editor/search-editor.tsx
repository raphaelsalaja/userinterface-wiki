"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import * as React from "react";

import { OperatorToken } from "./extensions";
import { ValueToken } from "./extensions";
import {
  OperatorSuggestion,
  ValueSuggestion,
  useSuggestionFloating,
  type OperatorSuggestionRenderProps,
  type ValueSuggestionRenderProps,
} from "./suggestions";
import { serializeQuery } from "./utils/serializer";
import styles from "./styles.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchEditorProps {
  /** Available authors for autocomplete */
  authors?: string[];
  /** Available tags for autocomplete */
  tags?: string[];
  /** Callback when query changes */
  onQueryChange?: (query: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class name */
  className?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SearchEditor({
  authors = [],
  tags = [],
  onQueryChange,
  placeholder = "Search…",
  className,
  autoFocus = false,
}: SearchEditorProps) {
  // Suggestion state
  const [operatorSuggestion, setOperatorSuggestion] = React.useState<OperatorSuggestionRenderProps | null>(null);
  const [valueSuggestion, setValueSuggestion] = React.useState<ValueSuggestionRenderProps | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Floating UI for suggestions
  const operatorFloating = useSuggestionFloating();
  const valueFloating = useSuggestionFloating();

  // Update floating position when suggestions change
  React.useEffect(() => {
    if (operatorSuggestion?.clientRect) {
      const rect = operatorSuggestion.clientRect();
      if (rect) operatorFloating.updatePosition(rect);
    }
  }, [operatorSuggestion, operatorFloating]);

  React.useEffect(() => {
    if (valueSuggestion?.clientRect) {
      const rect = valueSuggestion.clientRect();
      if (rect) valueFloating.updatePosition(rect);
    }
  }, [valueSuggestion, valueFloating]);

  // Previous items reference for comparison
  const prevOperatorItems = React.useRef(operatorSuggestion?.items);
  const prevValueItems = React.useRef(valueSuggestion?.items);

  // Reset selected index when suggestions change
  if (prevOperatorItems.current !== operatorSuggestion?.items || prevValueItems.current !== valueSuggestion?.items) {
    prevOperatorItems.current = operatorSuggestion?.items;
    prevValueItems.current = valueSuggestion?.items;
    if (selectedIndex !== 0) {
      setSelectedIndex(0);
    }
  }

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      OperatorToken,
      ValueToken,
      OperatorSuggestion.configure({
        operators: ["author", "tag", "before", "after", "during", "sort"],
        onRender: (props) => {
          if (props.items.length > 0) {
            setOperatorSuggestion(props);
          } else {
            setOperatorSuggestion(null);
          }
        },
        onHide: () => setOperatorSuggestion(null),
      }),
      ValueSuggestion.configure({
        authors,
        tags,
        sortOptions: ["newest", "oldest", "a-z", "z-a"],
        onRender: (props) => {
          if (props.items.length > 0) {
            setValueSuggestion(props);
          } else {
            setValueSuggestion(null);
          }
        },
        onHide: () => setValueSuggestion(null),
      }),
    ],
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: styles.editor,
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      const query = serializeQuery(editor.getJSON());
      onQueryChange?.(query);
    },
  });

  // Keyboard navigation for suggestions
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const currentSuggestion = operatorSuggestion || valueSuggestion;
      if (!currentSuggestion) return;

      const items = currentSuggestion.items;
      if (items.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + items.length) % items.length);
          break;
        case "Enter":
        case "Tab": {
          e.preventDefault();
          const selectedItem = items[selectedIndex];
          if (selectedItem) {
            // Cast to any to handle union type
            (currentSuggestion.command as (item: string) => void)(selectedItem);
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          setOperatorSuggestion(null);
          setValueSuggestion(null);
          break;
      }
    },
    [operatorSuggestion, valueSuggestion, selectedIndex],
  );

  const hasContent = (editor?.getText().trim().length ?? 0) > 0;

  return (
    <search className={className} data-search-editor="" onKeyDownCapture={handleKeyDown}>
      <EditorContent editor={editor} />

      {/* Operator Suggestions */}
      {operatorSuggestion && operatorSuggestion.items.length > 0 && (
        <div
          ref={operatorFloating.refs.setFloating}
          style={operatorFloating.floatingStyles}
          className={styles.menu}
          data-suggestion-menu=""
        >
          {operatorSuggestion.items.map((item, index) => (
            <button
              key={item}
              type="button"
              className={styles.item}
              data-suggestion-item=""
              data-selected={index === selectedIndex}
              onClick={() => operatorSuggestion.command(item)}
            >
              <span className={styles.operator}>{item}:</span>
              <span className={styles.hint}>Filter by {item}</span>
            </button>
          ))}
        </div>
      )}

      {/* Value Suggestions */}
      {valueSuggestion && valueSuggestion.items.length > 0 && (
        <div
          ref={valueFloating.refs.setFloating}
          style={valueFloating.floatingStyles}
          className={styles.menu}
          data-suggestion-menu=""
        >
          {valueSuggestion.items.map((item, index) => (
            <button
              key={item}
              type="button"
              className={styles.item}
              data-suggestion-item=""
              data-selected={index === selectedIndex}
              onClick={() => valueSuggestion.command(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Clear button */}
      {hasContent && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => editor?.commands.clearContent()}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </search>
  );
}
