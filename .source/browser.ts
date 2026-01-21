// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"12-principles-of-animation/index.mdx": () => import("../content/12-principles-of-animation/index.mdx?collection=docs"), "sounds-on-the-web/index.mdx": () => import("../content/sounds-on-the-web/index.mdx?collection=docs"), "taking-advantage-of-pseudo-elements/index.mdx": () => import("../content/taking-advantage-of-pseudo-elements/index.mdx?collection=docs"), "to-spring-or-not-to-spring/index.mdx": () => import("../content/to-spring-or-not-to-spring/index.mdx?collection=docs"), }),
};
export default browserCollections;