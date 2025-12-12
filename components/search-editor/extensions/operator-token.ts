import { mergeAttributes, Node } from "@tiptap/core";

export type OperatorKey =
  | "author"
  | "tag"
  | "before"
  | "after"
  | "during"
  | "sort";

export interface OperatorTokenOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    operatorToken: {
      /**
       * Insert an operator token
       */
      insertOperator: (key: OperatorKey) => ReturnType;
    };
  }
}

export const OperatorToken = Node.create<OperatorTokenOptions>({
  name: "operatorToken",

  group: "inline",

  inline: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      key: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-key"),
        renderHTML: (attributes) => {
          if (!attributes.key) {
            return {};
          }
          return {
            "data-key": attributes.key,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-search-operator]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { "data-search-operator": "" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      `${node.attrs.key}:`,
    ];
  },

  addCommands() {
    return {
      insertOperator:
        (key: OperatorKey) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { key },
          });
        },
    };
  },
});
