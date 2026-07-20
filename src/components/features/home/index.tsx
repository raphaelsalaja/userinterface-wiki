import Link from "next/link";
import { PageTransition } from "@/components/chrome/page-transition";
import type { Section } from "@/lib/sections";
import styles from "./styles.module.css";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HomeLayout({ sections }: { sections: Section[] }) {
  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>A Living Manual for Better Interfaces.</h1>
        <p className={styles.subtitle}>
          Guides on motion, sound, craft, and the psychology of interfaces —
          with interactive demos throughout.
        </p>
      </div>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.id} className={styles.section}>
            <div className={styles.meta}>
              <h2 className={styles.label}>{section.label}</h2>
              <p className={styles.description}>{section.description}</p>
            </div>
            <ul className={styles.list}>
              {section.pages.map((page) => (
                <li key={page.url}>
                  <Link href={page.url as "/"} className={styles.card}>
                    <span className={styles.name}>{page.title}</span>
                    <span className={styles.excerpt}>{page.description}</span>
                    <span className={styles.date}>{formatDate(page.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageTransition>
  );
}
