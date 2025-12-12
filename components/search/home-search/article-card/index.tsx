import Link from "next/link";

import { Code } from "@/components/icons";

import type { SerializedPage } from "../../types";
import styles from "./styles.module.css";

export interface ArticleCardProps {
  page: SerializedPage;
}

export function ArticleCard({ page }: ArticleCardProps) {
  return (
    <Link href={{ pathname: page.url }} className={styles.post}>
      <div className={styles.details}>
        <div className={styles.preview}>
          <Code />
        </div>
        <div>
          <h2 className={styles.title}>{page.title}</h2>
          <span className={styles.meta}>
            <span>{page.author.name}</span>
            <span className={styles.separator} />
            <span>{page.date.published}</span>
          </span>
        </div>
      </div>
      <div>
        <p className={styles.description}>{page.description}</p>
      </div>
    </Link>
  );
}
