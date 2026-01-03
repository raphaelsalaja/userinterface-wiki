import { clsx } from "clsx";
import Link from "next/link";
import {
  CodePreview,
  EssayPreview,
  MotionPreview,
} from "@/components/previews";
import type { FormattedPage } from "@/lib/source";
import styles from "./styles.module.css";

interface PageCardProps {
  className?: string;
  page: FormattedPage;
}

export function PageCard({ page, className, ...props }: PageCardProps) {
  const { title, description, author, date, icon } = page;

  const Icon = () => {
    switch (icon) {
      case "motion":
        return <MotionPreview />;
      case "code":
        return <CodePreview seed={title} />;
      case "writing":
        return <EssayPreview seed={title} />;
      default:
        return <EssayPreview seed={title} />;
    }
  };

  return (
    <Link
      href={{ pathname: page.url }}
      className={clsx(styles.post, className)}
      {...props}
    >
      <div className={styles.details}>
        <div className={styles.preview}>
          <Icon />
        </div>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.meta}>
            <span>{author.name}</span>
            <span className={styles.separator} />
            <span>{date.published}</span>
          </span>
        </div>
      </div>
      <div>
        <p className={styles.description}>{description}</p>
      </div>
    </Link>
  );
}
