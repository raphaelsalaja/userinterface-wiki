import type { Element, Root, Text } from "hast";
import { visit } from "unist-util-visit";
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

    const parentMap = new WeakMap<Element, Element | null>();
    visit(tree, "element", (node, _index, parent) => {
      parentMap.set(node, parent as Element | null);
    });

    const isInFootnotes = (element: Element): boolean => {
      let current: Element | null = element;
      while (current) {
        if (current.properties?.dataFootnotes !== undefined) {
          return true;
        }
        current = parentMap.get(current) ?? null;
      }
      return false;
    };

    visit(tree, "text", (node, index, parent) => {
      if (typeof index !== "number" || !parent) return;

      const textNode = node as Text;
      if (!textNode.value.trim()) return;

      const parentElement = parent as Element;
      if (
        parentElement.tagName &&
        SKIP_TAGS.has(parentElement.tagName.toLowerCase())
      ) {
        return;
      }

      if (isInFootnotes(parentElement)) {
        return;
      }

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
