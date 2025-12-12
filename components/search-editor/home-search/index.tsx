"use client";

import * as React from "react";
import { SearchEditor } from "../search-editor";
import { filterAndSortDocs, type FilterableDocument } from "../utils";
import styles from "./styles.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SerializedPage {
  url: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    name: string;
  };
  date: {
    published: string;
  };
}

export interface HomeSearchProps {
  pages: SerializedPage[];
  allTags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Adapter
// ─────────────────────────────────────────────────────────────────────────────

function toFilterable(page: SerializedPage): FilterableDocument {
  return {
    title: page.title,
    author: page.author.name,
    tag: page.tags,
    date: page.date.published,
    // Pass through extra fields
    url: page.url,
    description: page.description,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function HomeSearch({ pages, allTags }: HomeSearchProps) {
  const [query, setQuery] = React.useState("");

  // Extract unique authors
  const authors = React.useMemo(() => {
    const authorSet = new Set<string>();
    for (const page of pages) {
      if (page.author.name) {
        authorSet.add(page.author.name);
      }
    }
    return Array.from(authorSet).sort();
  }, [pages]);

  // Filter pages based on query
  const filteredPages = React.useMemo(() => {
    if (!query.trim()) {
      return pages;
    }
    const filterableDocs = pages.map(toFilterable);
    const results = filterAndSortDocs(filterableDocs, query);
    // Map back to original pages
    return results
      .map((doc) => pages.find((p) => p.url === doc.url))
      .filter((p): p is SerializedPage => p !== undefined);
  }, [pages, query]);

  return (
    <div className={styles.container}>
      <SearchEditor
        authors={authors}
        tags={allTags}
        onQueryChange={setQuery}
        placeholder="Search articles…"
        className={styles.editor}
      />

      <div className={styles.results}>
        {filteredPages.length === 0 ? (
          <div className={styles.empty}>No articles found</div>
        ) : (
          <ul className={styles.list}>
            {filteredPages.map((page) => (
              <li key={page.url} className={styles.item}>
                <a href={page.url} className={styles.link}>
                  <span className={styles.title}>{page.title}</span>
                  <span className={styles.description}>{page.description}</span>
                  <div className={styles.meta}>
                    <span className={styles.author}>{page.author.name}</span>
                    {page.tags.length > 0 && (
                      <div className={styles.tags}>
                        {page.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
