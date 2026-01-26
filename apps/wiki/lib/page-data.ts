/**
 * Utilities for serializing page data for client components
 */

import type { Page } from "./source";

export interface SerializablePageData {
  slugs: string[];
  url: string;
  data: {
    title: string;
    description?: string;
    author: string;
    coauthors?: string[];
    date: string;
  };
}

export function toSerializablePageData(page: Page): SerializablePageData {
  return {
    slugs: page.slugs ?? [],
    url: page.url,
    data: {
      title: page.data.title,
      description: page.data.description,
      author: page.data.author,
      coauthors: page.data.coauthors,
      date: page.data.date,
    },
  };
}
