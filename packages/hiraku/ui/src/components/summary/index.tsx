import styles from "./styles.module.css";

interface SummaryProps {
  summary: {
    total: number;
    valid: number;
    withErrors: number;
    withWarnings: number;
  };
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className={styles.summary}>
      <div className={styles.card}>
        <div className={styles.label}>Total Routes</div>
        <div className={styles.value}>{summary.total}</div>
      </div>
      <div className={styles.card} data-variant="valid">
        <div className={styles.label}>Valid</div>
        <div className={styles.value}>{summary.valid}</div>
      </div>
      <div className={styles.card} data-variant="errors">
        <div className={styles.label}>With Errors</div>
        <div className={styles.value}>{summary.withErrors}</div>
      </div>
      <div className={styles.card} data-variant="warnings">
        <div className={styles.label}>With Warnings</div>
        <div className={styles.value}>{summary.withWarnings}</div>
      </div>
    </div>
  );
}
