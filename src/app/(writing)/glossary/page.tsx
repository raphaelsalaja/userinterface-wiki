import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/chrome/page-transition";
import { glossarySource } from "@/lib/source";
import styles from "./styles.module.css";

const CATEGORY_LABELS = {
  motion: "Motion",
  sound: "Sound",
  craft: "Craft",
  experience: "Experience",
} as const;

type Category = keyof typeof CATEGORY_LABELS;

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Single-concept reference entries for the vocabulary of interface design — motion, sound, craft, and experience.",
};

export default function GlossaryPage() {
  const pages = glossarySource.getPages();

  const categories = (Object.keys(CATEGORY_LABELS) as Category[])
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      entries: pages
        .filter((page) => page.data.category === category)
        .sort((a, b) => a.data.title.localeCompare(b.data.title)),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <PageTransition>
      <div className={styles.header}>
        <h1 className={styles.title}>Glossary</h1>
        <p className={styles.subtitle}>
          The vocabulary of interface design, one concept at a time.
        </p>
      </div>

      <div className={styles.groups}>
        {categories.map((group) => (
          <section key={group.category} className={styles.group}>
            <h2 className={styles.label}>{group.label}</h2>
            <ul className={styles.grid}>
              {group.entries.map((entry) => (
                <li key={entry.url}>
                  <Link href={entry.url as "/"} className={styles.card}>
                    <span className={styles.term}>{entry.data.title}</span>
                    <span className={styles.definition}>
                      {entry.data.description}
                    </span>
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
