// @ts-nocheck
import { browser } from "fumadocs-mdx/runtime/browser";
import type * as Config from "../source.config";

const create = browser<
  typeof Config,
  import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
    DocData: {};
  }
>();
const browserCollections = {
  docs: create.doc("docs", {
    "api-reference.mdx": () =>




      
      import("../markdown/content/api-reference.mdx?collection=docs"),
    "changelog.mdx": () =>
      import("../markdown/content/changelog.mdx?collection=docs"),
    "components.mdx": () =>
      import("../markdown/content/components.mdx?collection=docs"),
    "configuration.mdx": () =>
      import("../markdown/content/configuration.mdx?collection=docs"),
    "contributing.mdx": () =>
      import("../markdown/content/contributing.mdx?collection=docs"),
    "deployment.mdx": () =>
      import("../markdown/content/deployment.mdx?collection=docs"),
    "getting-started.mdx": () =>
      import("../markdown/content/getting-started.mdx?collection=docs"),
    "installation.mdx": () =>
      import("../markdown/content/installation.mdx?collection=docs"),
    "theming.mdx": () =>
      import("../markdown/content/theming.mdx?collection=docs"),
    "troubleshooting.mdx": () =>
      import("../markdown/content/troubleshooting.mdx?collection=docs"),
  }),
};
export default browserCollections;
