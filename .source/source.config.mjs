// source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";

// lib/features/content/plugins/rehype-word-spans.ts
import { visitParents } from "unist-util-visit-parents";

// lib/utils/strings/normalize.ts
var NON_WORD_CHARACTERS = /[^\p{L}\p{N}''-]+/gu;
function normalizeWord(value) {
  if (!value) return "";
  return value.normalize("NFKC").trim().toLowerCase().replace(NON_WORD_CHARACTERS, "");
}

// lib/features/content/plugins/rehype-word-spans.ts
var SKIP_TAGS = /* @__PURE__ */ new Set([
  "code",
  "pre",
  "kbd",
  "var",
  "samp",
  "style",
  "script"
]);
function rehypeWordSpans() {
  return (tree) => {
    let counter = 0;
    visitParents(tree, "text", (node, ancestors) => {
      const textNode = node;
      if (!textNode.value.trim()) return;
      const parent = ancestors[ancestors.length - 1];
      if (!parent || !("children" in parent) || !Array.isArray(parent.children)) {
        return;
      }
      const parentElement = parent;
      if (parentElement.tagName && SKIP_TAGS.has(parentElement.tagName.toLowerCase())) {
        return;
      }
      const isFootnote = ancestors.some((ancestor) => {
        const element = ancestor;
        return element.properties?.dataFootnotes !== void 0;
      });
      if (isFootnote) {
        return;
      }
      const index = parent.children.indexOf(node);
      if (index === -1) return;
      const segments = textNode.value.split(/(\s+)/);
      if (segments.length <= 1) return;
      const replacements = segments.map((segment) => {
        if (!segment.trim()) {
          return { type: "text", value: segment };
        }
        const normalized = normalizeWord(segment);
        if (!normalized) {
          return { type: "text", value: segment };
        }
        return {
          type: "element",
          tagName: "span",
          properties: {
            "data-word-id": `word-${counter++}`,
            "data-word-normalized": normalized
          },
          children: [{ type: "text", value: segment }]
        };
      });
      parent.children.splice(index, 1, ...replacements);
      return index + replacements.length;
    });
  };
}

// source.config.ts
var docs = defineDocs({
  dir: "documents",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.object({
        published: z.iso.date(),
        modified: z.iso.date().optional()
      }),
      description: z.string(),
      author: z.string(),
      coauthors: z.array(z.string()).optional(),
      tags: z.array(z.string()),
      icon: z.enum(["writing", "code", "motion"]).optional().default("writing")
    })
  },
  meta: {}
});
var source_config_default = defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    remarkPlugins: [],
    rehypePlugins: [rehypeWordSpans],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs
};
