// @ts-nocheck
import * as __fd_glob_7 from "../markdown/content/understanding-hierarchy.mdx?collection=docs"
import * as __fd_glob_6 from "../markdown/content/the-concept-of-taste.mdx?collection=docs"
import * as __fd_glob_5 from "../markdown/content/taste-and-curation.mdx?collection=docs"
import * as __fd_glob_4 from "../markdown/content/rarity-principle.mdx?collection=docs"
import * as __fd_glob_3 from "../markdown/content/optical-alignment.mdx?collection=docs"
import * as __fd_glob_2 from "../markdown/content/motion-as-narrative.mdx?collection=docs"
import * as __fd_glob_1 from "../markdown/content/easing-vs-springs.mdx?collection=docs"
import * as __fd_glob_0 from "../markdown/content/dynamic-typography.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "markdown/content", {}, {"dynamic-typography.mdx": __fd_glob_0, "easing-vs-springs.mdx": __fd_glob_1, "motion-as-narrative.mdx": __fd_glob_2, "optical-alignment.mdx": __fd_glob_3, "rarity-principle.mdx": __fd_glob_4, "taste-and-curation.mdx": __fd_glob_5, "the-concept-of-taste.mdx": __fd_glob_6, "understanding-hierarchy.mdx": __fd_glob_7, });