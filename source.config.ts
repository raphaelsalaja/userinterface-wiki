import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";

export const docs = defineDocs({
  dir: "markdown/content",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.object({
        published: z.iso.date(),
        modified: z.iso.date().optional(),
      }),
      views: z.number().optional(),
      authors: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    }),
  },
  meta: {},
});

export default defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
