// source.config.ts
import {
  defineConfig,
  defineDocs,
  frontmatterSchema
} from "fumadocs-mdx/config";
import { z } from "zod";
var docs = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.iso.date(),
      description: z.string(),
      author: z.string(),
      coauthors: z.array(z.string()).optional(),
      icon: z.enum(["writing", "code", "motion"]).optional().default("writing")
    })
  },
  meta: {}
});
var source_config_default = defineConfig({
  mdxOptions: {
    providerImportSource: "@/mdx-components",
    remarkPlugins: [],
    rehypePlugins: [],
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
