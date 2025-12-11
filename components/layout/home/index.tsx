import { Suspense } from "react";
import { PageTransition } from "@/components/page-transition";
import { getFormattedPageFromPageSource } from "@/markdown/functions/get-page";
import { source } from "@/markdown/lib/source";
import styles from "./styles.module.css";
import { type SerializedPage, TagFilter } from "./tag-filter";

export const HomeLayout = () => {
  const pages = source.getPages();

  const serializedPages: SerializedPage[] = pages.map((page) => {
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

  const allTags = (() => {
    const set = new Set<string>();
    for (const page of serializedPages) {
      for (const t of page.tags) {
        set.add(t);
      }
    }
    return Array.from(set).sort();
  })();

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces</h1>
      </div>

      <div className={styles.container}>
        <Suspense fallback={null}>
          <TagFilter pages={serializedPages} allTags={allTags} />
        </Suspense>
      </div>
    </PageTransition>
  );
};
