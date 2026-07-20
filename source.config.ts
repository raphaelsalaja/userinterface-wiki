import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content",
  docs: {
    // Articles only — README.md documents authoring conventions, not
    // content, and glossary entries live in their own collection below.
    files: ["**/*.mdx", "!glossary/**"],
    schema: frontmatterSchema.extend({
      date: z.iso.date(),
      description: z.string(),
      author: z.string(),
      coauthors: z.array(z.string()).optional(),
      icon: z.enum(["writing", "code", "motion"]).optional().default("writing"),
    }),
  },
  meta: {},
});

export const glossary = defineDocs({
  dir: "content/glossary",
  docs: {
    schema: frontmatterSchema.extend({
      description: z.string(),
      category: z.enum(["motion", "sound", "craft", "experience"]),
    }),
  },
  meta: {},
});

export default defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    remarkPlugins: [],
    rehypePlugins: [],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
