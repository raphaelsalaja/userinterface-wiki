// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"12-principles-of-animation.mdx": () => import("../documents/12-principles-of-animation.mdx?collection=docs"), "dynamic-typography.mdx": () => import("../documents/dynamic-typography.mdx?collection=docs"), "easing-vs-springs.mdx": () => import("../documents/easing-vs-springs.mdx?collection=docs"), "motion-as-narrative.mdx": () => import("../documents/motion-as-narrative.mdx?collection=docs"), "optical-alignment.mdx": () => import("../documents/optical-alignment.mdx?collection=docs"), "rarity-principle.mdx": () => import("../documents/rarity-principle.mdx?collection=docs"), "sound-design.mdx": () => import("../documents/sound-design.mdx?collection=docs"), "taste-and-curation.mdx": () => import("../documents/taste-and-curation.mdx?collection=docs"), "the-concept-of-taste.mdx": () => import("../documents/the-concept-of-taste.mdx?collection=docs"), "understanding-hierarchy.mdx": () => import("../documents/understanding-hierarchy.mdx?collection=docs"), "understanding-springs.mdx": () => import("../documents/understanding-springs.mdx?collection=docs"), }),
};
export default browserCollections;