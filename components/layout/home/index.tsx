import { Suspense } from "react";
import { Search, type SerializedPage } from "@/components/layout/home/search";
import { PageTransition } from "@/components/page-transition";
import { getFormattedPageFromPageSource } from "@/markdown/functions/get-page";
import { source } from "@/markdown/lib/source";
import styles from "./index.module.css";

export function HomeLayout() {
  const pages: SerializedPage[] = source.getPages().map((page) => {
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

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces</h1>
      </div>

      <div className={styles.container}>
        <Suspense fallback={null}>
          <Search pages={pages} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
