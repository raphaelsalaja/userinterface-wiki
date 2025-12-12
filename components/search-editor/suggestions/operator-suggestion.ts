import Suggestion from "@tiptap/suggestion";
import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";

import type { OperatorKey } from "../extensions/operator-token";

export interface OperatorSuggestionOptions {
  operators: OperatorKey[];
  onRender: (props: OperatorSuggestionRenderProps) => void;
  onHide: () => void;
}

export interface OperatorSuggestionRenderProps {
  items: OperatorKey[];
  command: (item: OperatorKey) => void;
  clientRect: (() => DOMRect | null) | null;
}

export const OperatorSuggestionPluginKey = new PluginKey("operatorSuggestion");

export const OperatorSuggestion = Extension.create<OperatorSuggestionOptions>({
  name: "operatorSuggestion",

  addOptions() {
    return {
      operators: ["author", "tag", "before", "after", "during", "sort"],
      onRender: () => {},
      onHide: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { operators, onRender, onHide } = this.options;

    return [
      Suggestion({
        editor: this.editor,
        pluginKey: OperatorSuggestionPluginKey,
        char: "", // Trigger on any character
        startOfLine: false,
        allowSpaces: false,
        
        items: ({ query }) => {
          const q = query.toLowerCase();
          // Only show operators when typing a potential operator (no colon yet)
          if (q.includes(":")) return [];
          
          return operators.filter((op) =>
            op.toLowerCase().startsWith(q),
          );
        },

        render: () => {
          return {
            onStart: (props) => {
              onRender({
                items: props.items as OperatorKey[],
                command: (item) => {
                  props.command({ id: item });
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onUpdate: (props) => {
              onRender({
                items: props.items as OperatorKey[],
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
          const operatorKey = props.id as OperatorKey;
          
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertOperator(operatorKey)
            .insertContent(" ")
            .run();
        },
      }),
    ];
  },
});
