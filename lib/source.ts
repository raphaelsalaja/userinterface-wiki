/**
 * Content source - Fumadocs loader and page formatting
 */

import { docs } from "fumadocs/server";
import { type InferPageType, loader } from "fumadocs-core/source";
import { type Author, getAuthorById } from "./authors";

export const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];
  return {
    segments,
    url: `/og/${page.slugs.join("/")}/image.png`,
  };
}

/**
 * A full page object from Fumadocs source.
 */
export type Page = NonNullable<ReturnType<typeof source.getPage>>;

/**
 * A formatted page with resolved author data and formatted dates.
 */
export interface FormattedPage {
  url: string;
  title: string;
  description: string;
  author: Author;
  coauthors: Author[];
  icon?: "motion" | "code" | "writing";
  date: string;
}

function formatData(data: Page["data"]) {
  if (!data.author) {
    throw new Error("Author id is required.");
  }

  return {
    title: data.title,
    description: data.description,
    author: getAuthorById(data.author),
    coauthors: (data.coauthors ?? []).map(getAuthorById),
    icon: data.icon,
    date: data.date,
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
