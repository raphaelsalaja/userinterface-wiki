// @ts-nocheck
import * as __fd_glob_9 from "../markdown/content/troubleshooting.mdx?collection=docs"
import * as __fd_glob_8 from "../markdown/content/theming.mdx?collection=docs"
import * as __fd_glob_7 from "../markdown/content/installation.mdx?collection=docs"
import * as __fd_glob_6 from "../markdown/content/getting-started.mdx?collection=docs"
import * as __fd_glob_5 from "../markdown/content/deployment.mdx?collection=docs"
import * as __fd_glob_4 from "../markdown/content/contributing.mdx?collection=docs"
import * as __fd_glob_3 from "../markdown/content/configuration.mdx?collection=docs"
import * as __fd_glob_2 from "../markdown/content/components.mdx?collection=docs"
import * as __fd_glob_1 from "../markdown/content/changelog.mdx?collection=docs"
import * as __fd_glob_0 from "../markdown/content/api-reference.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "markdown/content", {}, {"api-reference.mdx": __fd_glob_0, "changelog.mdx": __fd_glob_1, "components.mdx": __fd_glob_2, "configuration.mdx": __fd_glob_3, "contributing.mdx": __fd_glob_4, "deployment.mdx": __fd_glob_5, "getting-started.mdx": __fd_glob_6, "installation.mdx": __fd_glob_7, "theming.mdx": __fd_glob_8, "troubleshooting.mdx": __fd_glob_9, });