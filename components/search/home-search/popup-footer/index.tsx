import styles from "./styles.module.css";

export function PopupFooter() {
  return (
    <div className={styles.footer}>
      <span className={styles.tip}>
        Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes for
        spaces: <code>author:"John Doe"</code>
      </span>
    </div>
  );
}
