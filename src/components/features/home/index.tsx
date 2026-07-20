import Link from "next/link";
import { PageTransition } from "@/components/chrome/page-transition";
import { Newsletter } from "@/components/features/newsletter";
import type { Section } from "@/lib/sections";
import { SPONSOR_CTA_URL, SPONSORS } from "@/lib/sponsors";
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

      <footer className={styles.footer}>
        <Newsletter />
        <div className={styles.sponsors}>
          {SPONSORS.length > 0 && (
            <ul className={styles["sponsor-strip"]}>
              {SPONSORS.map((sponsor) => (
                <li key={sponsor.url}>
                  <a
                    href={sponsor.url}
                    className={styles.sponsor}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sponsor.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <span className={styles["sponsor-note"]}>
            The wiki is free and open source, supported by{" "}
            <Link href="/sponsors">sponsors</Link>. You can{" "}
            <a href={SPONSOR_CTA_URL} target="_blank" rel="noreferrer">
              become one
            </a>
            .
          </span>
        </div>
      </footer>
    </PageTransition>
  );
}
