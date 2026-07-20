import Link from "next/link";
import type { FormattedPage } from "@/lib/source";
import styles from "./styles.module.css";

interface PagerProps {
  prev: FormattedPage | null;
  next: FormattedPage | null;
}

export function Pager({ prev, next }: PagerProps) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.pager} aria-label="Article navigation">
      {prev ? (
        <Link href={prev.url as "/"} className={styles.link} rel="prev">
          <span className={styles.direction}>Previous</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.url as "/"}
          className={styles.link}
          data-align="end"
          rel="next"
        >
          <span className={styles.direction}>Next</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
