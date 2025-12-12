import { clsx } from "clsx";

import styles from "./styles.module.css";

export interface ValueSuggestionsListProps {
  type: "tags" | "authors" | "sort";
  items: string[];
  highlightedIndex: number;
  onSelect: (item: string) => void;
}

export function ValueSuggestionsList({
  type,
  items,
  highlightedIndex,
  onSelect,
}: ValueSuggestionsListProps) {
  const categoryLabel =
    type === "tags" ? "Tags" : type === "authors" ? "Authors" : "Sort Options";

  return (
    <>
      <div className={styles.category}>{categoryLabel}</div>
      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>No matches found</div>
        ) : (
          items.map((item, index) => (
            <button
              type="button"
              key={item}
              className={clsx(
                styles.option,
                index === highlightedIndex && styles.highlighted,
              )}
              onClick={() => onSelect(item)}
            >
              <span className={styles.key}>{item}</span>
            </button>
          ))
        )}
      </div>
    </>
  );
}
