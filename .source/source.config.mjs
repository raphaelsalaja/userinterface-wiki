// source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";

// lib/modules/content/plugins/rehype-prose-classes.ts
import { visit } from "unist-util-visit";
var TYPE_MAP = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  p: "text",
  li: "text",
  ul: "list",
  ol: "list"
};
var DEFAULT_TYPE = "block";
var rehypeProseTypePlugin = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (!node.tagName) return;
      const existingType = node.properties?.["data-prose-type"];
      if (typeof existingType === "string" && existingType.length > 0) {
        return;
      }
      const proseType = TYPE_MAP[node.tagName.toLowerCase()] ?? DEFAULT_TYPE;
      node.properties = {
        ...node.properties,
        "data-prose-type": proseType
      };
    });
  };
};

// lib/modules/content/plugins/rehype-word-spans.ts
import { visit as visit2 } from "unist-util-visit";

// lib/core/strings/normalize.ts
var NON_WORD_CHARACTERS = /[^\p{L}\p{N}''-]+/gu;
function normalizeWord(value) {
  if (!value) return "";
  return value.normalize("NFKC").trim().toLowerCase().replace(NON_WORD_CHARACTERS, "");
}

// lib/core/strings/title-case.ts
import title from "title";

// lib/modules/content/plugins/rehype-word-spans.ts
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
    visit2(tree, "text", (node, index, parent) => {
      if (typeof index !== "number" || !parent) return;
      const textNode = node;
      if (!textNode.value.trim()) return;
      const parentElement = parent;
      if (parentElement.tagName && SKIP_TAGS.has(parentElement.tagName.toLowerCase())) {
        return;
      }
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
      tags: z.array(z.string())
    })
  },
  meta: {}
});
var source_config_default = defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    rehypePlugins: [rehypeProseTypePlugin, rehypeWordSpans],
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
