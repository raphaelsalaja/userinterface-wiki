import Suggestion from "@tiptap/suggestion";
import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";

import type { OperatorKey } from "../extensions/operator-token";

export interface ValueSuggestionOptions {
  authors: string[];
  tags: string[];
  sortOptions: string[];
  onRender: (props: ValueSuggestionRenderProps) => void;
  onHide: () => void;
}

export interface ValueSuggestionRenderProps {
  items: string[];
  operatorContext: OperatorKey | null;
  command: (item: string) => void;
  clientRect: (() => DOMRect | null) | null;
}

export const ValueSuggestionPluginKey = new PluginKey("valueSuggestion");

/**
 * Finds the operator context by looking backwards from current position
 */
function findOperatorContext(
  state: { doc: { nodeAt: (pos: number) => unknown } },
  pos: number,
): OperatorKey | null {
  // Look backwards for an operator token
  for (let i = pos - 1; i >= 0; i--) {
    const node = state.doc.nodeAt(i);
    if (node && (node as { type?: { name?: string } }).type?.name === "operatorToken") {
      return (node as { attrs?: { key?: OperatorKey } }).attrs?.key ?? null;
    }
    // If we hit a value token or significant text, stop looking
    if (node && (node as { type?: { name?: string } }).type?.name === "valueToken") {
      return null;
    }
  }
  return null;
}

export const ValueSuggestion = Extension.create<ValueSuggestionOptions>({
  name: "valueSuggestion",

  addOptions() {
    return {
      authors: [],
      tags: [],
      sortOptions: ["newest", "oldest", "a-z", "z-a"],
      onRender: () => {},
      onHide: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { authors, tags, sortOptions, onRender, onHide } = this.options;

    return [
      Suggestion({
        editor: this.editor,
        pluginKey: ValueSuggestionPluginKey,
        char: " ", // Trigger after space (following operator)
        startOfLine: false,
        allowSpaces: false,

        items: ({ query, editor }) => {
          const state = editor.state;
          const pos = state.selection.from;
          const operatorContext = findOperatorContext(state as unknown as {
            doc: { nodeAt: (pos: number) => unknown };
          }, pos);

          if (!operatorContext) return [];

          const q = query.toLowerCase();

          switch (operatorContext) {
            case "author":
              return authors.filter((a) => a.toLowerCase().includes(q));
            case "tag":
              return tags.filter((t) => t.toLowerCase().includes(q));
            case "sort":
              return sortOptions.filter((s) => s.toLowerCase().includes(q));
            case "before":
            case "after":
            case "during":
              // Return date format hints or empty for date picker
              return [];
            default:
              return [];
          }
        },

        render: () => {
          let currentOperatorContext: OperatorKey | null = null;

          return {
            onStart: (props) => {
              const state = props.editor.state;
              const pos = state.selection.from;
              currentOperatorContext = findOperatorContext(state as unknown as {
                doc: { nodeAt: (pos: number) => unknown };
              }, pos);

              onRender({
                items: props.items as string[],
                operatorContext: currentOperatorContext,
                command: (item) => {
                  props.command({ id: item });
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onUpdate: (props) => {
              const state = props.editor.state;
              const pos = state.selection.from;
              currentOperatorContext = findOperatorContext(state as unknown as {
                doc: { nodeAt: (pos: number) => unknown };
              }, pos);

              onRender({
                items: props.items as string[],
                operatorContext: currentOperatorContext,
                command: (item) => {
                  props.command({ id: item });
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                onHide();
                return true;
              }
              return false;
            },
            onExit: () => {
              onHide();
            },
          };
        },

        command: ({ editor, range, props }) => {
          const value = props.id as string;

          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertValue(value)
            .insertContent(" ")
            .run();
        },
      }),
    ];
  },
});
