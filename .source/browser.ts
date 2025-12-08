// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"dynamic-typography.mdx": () => import("../markdown/content/dynamic-typography.mdx?collection=docs"), "easing-vs-springs.mdx": () => import("../markdown/content/easing-vs-springs.mdx?collection=docs"), "motion-as-narrative.mdx": () => import("../markdown/content/motion-as-narrative.mdx?collection=docs"), "optical-alignment.mdx": () => import("../markdown/content/optical-alignment.mdx?collection=docs"), "rarity-principle.mdx": () => import("../markdown/content/rarity-principle.mdx?collection=docs"), "taste-and-curation.mdx": () => import("../markdown/content/taste-and-curation.mdx?collection=docs"), "the-concept-of-taste.mdx": () => import("../markdown/content/the-concept-of-taste.mdx?collection=docs"), "understanding-hierarchy.mdx": () => import("../markdown/content/understanding-hierarchy.mdx?collection=docs"), }),
};
export default browserCollections;