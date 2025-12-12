import styles from "./styles.module.css";

export function PopupHeader() {
  return (
    <div className={styles.header}>
      <span className={styles.label}>Search Filters</span>
      <span className={styles.hint}>
        <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select ·{" "}
        <kbd>Esc</kbd> to close
      </span>
    </div>
  );
}
