import { getAuthorById } from "@/lib/features/authors";
import type { FormattedPage, Page } from "./types";

function formatData(data: Page["data"]) {
  if (!data.author) {
    throw new Error("Author id is required.");
  }

  return {
    title: data.title,
    description: data.description,
    tags: data.tags ?? [],
    author: getAuthorById(data.author),
    coauthors: (data.coauthors ?? []).map(getAuthorById),
    date: {
      published: new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(new Date(data.date.published)),
    },
  };
}

/**
 * Formats page data with resolved authors and formatted dates.
 */
export function formatPageData(data: Page["data"]): Omit<FormattedPage, "url"> {
  return formatData(data);
}

/**
 * Formats an array of Page objects.
 */
export function formatPages(pages: Page[]): FormattedPage[] {
  return pages.map((page) => ({
    url: page.url,
    ...formatData(page.data),
  }));
}
