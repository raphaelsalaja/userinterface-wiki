import { clsx } from "clsx";

import type { FilterOption } from "../../internals/filter-options";
import styles from "./styles.module.css";

export interface FilterOptionsListProps {
  options: FilterOption[];
  highlightedIndex: number;
  onSelect: (option: FilterOption) => void;
}

export function FilterOptionsList({
  options,
  highlightedIndex,
  onSelect,
}: FilterOptionsListProps) {
  return (
    <div className={styles.list}>
      {options.map((option, index) => (
        <button
          type="button"
          key={option.key}
          className={clsx(
            styles.option,
            index === highlightedIndex && styles.highlighted,
          )}
          onClick={() => onSelect(option)}
        >
          <span className={styles.key}>{option.label}</span>
          <span className={styles.description}>{option.description}</span>
          {option.example && (
            <span className={styles.example}>{option.example}</span>
          )}
        </button>
      ))}
    </div>
  );
}
