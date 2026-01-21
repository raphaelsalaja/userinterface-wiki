// @ts-nocheck
import * as __fd_glob_3 from "../content/to-spring-or-not-to-spring/index.mdx?collection=docs"
import * as __fd_glob_2 from "../content/taking-advantage-of-pseudo-elements/index.mdx?collection=docs"
import * as __fd_glob_1 from "../content/sounds-on-the-web/index.mdx?collection=docs"
import * as __fd_glob_0 from "../content/12-principles-of-animation/index.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content", {}, {"12-principles-of-animation/index.mdx": __fd_glob_0, "sounds-on-the-web/index.mdx": __fd_glob_1, "taking-advantage-of-pseudo-elements/index.mdx": __fd_glob_2, "to-spring-or-not-to-spring/index.mdx": __fd_glob_3, });