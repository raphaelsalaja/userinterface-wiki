"use client";

import { useSearchContext } from "../../internals/context";
import { ArticleCard } from "../article-card";
import { NoResults } from "../no-results";
import styles from "./styles.module.css";

export function SearchResultsList() {
  const { state, actions } = useSearchContext();
  const { filteredPages } = state;

  return (
    <>
      <div className={styles.count}>
        {filteredPages.length}{" "}
        {filteredPages.length === 1 ? "article" : "articles"}
      </div>

      <div className={styles.posts}>
        {filteredPages.length === 0 ? (
          <NoResults onClear={() => actions.clearAll()} />
        ) : (
          filteredPages.map((page) => (
            <ArticleCard key={page.url} page={page} />
          ))
        )}
      </div>
    </>
  );
}
