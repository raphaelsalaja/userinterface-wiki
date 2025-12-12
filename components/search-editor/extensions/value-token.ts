import { mergeAttributes, Node } from "@tiptap/core";

export interface ValueTokenOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    valueToken: {
      /**
       * Insert a value token
       */
      insertValue: (value: string, valid?: boolean, negated?: boolean) => ReturnType;
    };
  }
}

export const ValueToken = Node.create<ValueTokenOptions>({
  name: "valueToken",

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
      value: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-value"),
        renderHTML: (attributes) => {
          if (!attributes.value) {
            return {};
          }
          return {
            "data-value": attributes.value,
          };
        },
      },
      valid: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-valid") === "true",
        renderHTML: (attributes) => {
          return {
            "data-valid": attributes.valid ? "true" : "false",
          };
        },
      },
      negated: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-negated") === "true",
        renderHTML: (attributes) => {
          if (!attributes.negated) {
            return {};
          }
          return {
            "data-negated": "true",
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-search-value]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const prefix = node.attrs.negated ? "-" : "";
    return [
      "span",
      mergeAttributes(
        { "data-search-value": "" },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      `${prefix}${node.attrs.value}`,
    ];
  },

  addCommands() {
    return {
      insertValue:
        (value: string, valid = true, negated = false) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { value, valid, negated },
          });
        },
    };
  },
});
