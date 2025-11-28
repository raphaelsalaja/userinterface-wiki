// source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";
var docs = defineDocs({
  dir: "markdown/content",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.object({
        published: z.iso.date(),
        modified: z.iso.date().optional()
      }),
      views: z.number().optional(),
      authors: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional()
    })
  },
  meta: {}
});
var source_config_default = defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
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
