// @ts-nocheck
import * as __fd_glob_10 from "../documents/understanding-springs.mdx?collection=docs"
import * as __fd_glob_9 from "../documents/understanding-hierarchy.mdx?collection=docs"
import * as __fd_glob_8 from "../documents/the-concept-of-taste.mdx?collection=docs"
import * as __fd_glob_7 from "../documents/taste-and-curation.mdx?collection=docs"
import * as __fd_glob_6 from "../documents/sound-design.mdx?collection=docs"
import * as __fd_glob_5 from "../documents/rarity-principle.mdx?collection=docs"
import * as __fd_glob_4 from "../documents/optical-alignment.mdx?collection=docs"
import * as __fd_glob_3 from "../documents/motion-as-narrative.mdx?collection=docs"
import * as __fd_glob_2 from "../documents/easing-vs-springs.mdx?collection=docs"
import * as __fd_glob_1 from "../documents/dynamic-typography.mdx?collection=docs"
import * as __fd_glob_0 from "../documents/12-principles-of-animation.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "documents", {}, {"12-principles-of-animation.mdx": __fd_glob_0, "dynamic-typography.mdx": __fd_glob_1, "easing-vs-springs.mdx": __fd_glob_2, "motion-as-narrative.mdx": __fd_glob_3, "optical-alignment.mdx": __fd_glob_4, "rarity-principle.mdx": __fd_glob_5, "sound-design.mdx": __fd_glob_6, "taste-and-curation.mdx": __fd_glob_7, "the-concept-of-taste.mdx": __fd_glob_8, "understanding-hierarchy.mdx": __fd_glob_9, "understanding-springs.mdx": __fd_glob_10, });