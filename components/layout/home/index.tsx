"use client";

import { Field } from "@base-ui/react/field";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageTransition } from "@/components/page-transition";
import { PageCard } from "@/components/post";
import type { FormattedPage } from "@/lib/features/content";
import styles from "./styles.module.css";

export function HomeLayout({ pages }: { pages: FormattedPage[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(pages, {
        keys: ["title", "description", "author.name", "tags"],
        threshold: 0.3,
        includeScore: true,
      }),
    [pages],
  );

  const filteredPages = useMemo(() => {
    const q = query.trim();
    if (!q) return pages;

    return fuse.search(q).map((result) => result.item);
  }, [fuse, pages, query]);

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces</h1>
      </div>

      <div className={styles.container}>
        <Field.Root className={styles.search}>
          <Search className={styles.icon} size={18} />
          <Field.Control
            type="search"
            className={styles.input}
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field.Root>

        {filteredPages.length !== 0 && (
          <div className={styles.list}>
            {filteredPages.map((page) => (
              <PageCard key={page.url} page={page} className={styles.card} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
