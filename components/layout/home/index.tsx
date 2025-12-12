import { Suspense } from "react";

import { PageTransition } from "@/components/page-transition";
import { HomeSearch, type SerializedPage } from "@/components/search-editor";
import { getFormattedPageFromPageSource } from "@/markdown/functions/get-page";
import { source } from "@/markdown/lib/source";

import styles from "./styles.module.css";

/**
 * Serializes page data for client-side filtering.
 */
function serializePages(): SerializedPage[] {
  const pages = source.getPages();

  return pages.map((page) => {
    const formatted = getFormattedPageFromPageSource(page);
    return {
      url: page.url,
      title: formatted.title,
      description: formatted.description,
      tags: formatted.tags,
      author: {
        name: formatted.author.name,
      },
      date: {
        published: formatted.date.published,
      },
    };
  });
}

/**
 * Extracts unique tags from pages, sorted alphabetically.
 */
function extractUniqueTags(pages: SerializedPage[]): string[] {
  const tagSet = new Set<string>();
  for (const page of pages) {
    for (const tag of page.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

export function HomeLayout() {
  const serializedPages = serializePages();
  const allTags = extractUniqueTags(serializedPages);

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces</h1>
      </div>

      <div className={styles.container}>
        <Suspense fallback={null}>
          <HomeSearch pages={serializedPages} allTags={allTags} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
