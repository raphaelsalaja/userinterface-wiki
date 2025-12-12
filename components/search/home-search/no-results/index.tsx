import styles from "./styles.module.css";

export interface NoResultsProps {
  onClear: () => void;
}

export function NoResults({ onClear }: NoResultsProps) {
  return (
    <div className={styles.container}>
      <p>No articles match your search.</p>
      <button type="button" onClick={onClear} className={styles.button}>
        Clear filters
      </button>
    </div>
  );
}
