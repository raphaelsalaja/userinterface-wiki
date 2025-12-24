import type { Element, Root, Text } from "hast";
import { visitParents } from "unist-util-visit-parents";
import { normalizeWord } from "@/lib/utils/strings";

const SKIP_TAGS = new Set([
  "code",
  "pre",
  "kbd",
  "var",
  "samp",
  "style",
  "script",
]);

export function rehypeWordSpans() {
  return (tree: Root) => {
    let counter = 0;

    visitParents(tree, "text", (node, ancestors) => {
      const textNode = node as Text;
      if (!textNode.value.trim()) return;

      const parent = ancestors[ancestors.length - 1] as
        | Element
        | Root
        | undefined;
      if (
        !parent ||
        !("children" in parent) ||
        !Array.isArray(parent.children)
      ) {
        return;
      }

      const parentElement = parent as Element;
      if (
        parentElement.tagName &&
        SKIP_TAGS.has(parentElement.tagName.toLowerCase())
      ) {
        return;
      }

      const isFootnote = ancestors.some((ancestor) => {
        const element = ancestor as Element;
        return element.properties?.dataFootnotes !== undefined;
      });
      if (isFootnote) {
        return;
      }

      const index = parent.children.indexOf(node as Element | Text);
      if (index === -1) return;

      const segments = textNode.value.split(/(\s+)/);
      if (segments.length <= 1) return;

      const replacements = segments.map((segment: string) => {
        if (!segment.trim()) {
          return { type: "text", value: segment } satisfies Text;
        }

        const normalized = normalizeWord(segment);
        if (!normalized) {
          return { type: "text", value: segment } satisfies Text;
        }

        return {
          type: "element",
          tagName: "span",
          properties: {
            "data-word-id": `word-${counter++}`,
            "data-word-normalized": normalized,
          },
          children: [{ type: "text", value: segment }],
        } satisfies Element;
      });

      parent.children.splice(index, 1, ...replacements);
      return index + replacements.length;
    });
  };
}
