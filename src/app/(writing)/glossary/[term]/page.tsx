import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/chrome/page-transition";
import { glossarySource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import styles from "./styles.module.css";

const CATEGORY_LABELS = {
  motion: "Motion",
  sound: "Sound",
  craft: "Craft",
  experience: "Experience",
} as const;

export async function generateStaticParams() {
  return glossarySource.getPages().map((page) => ({
    term: page.slugs.join("/"),
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = glossarySource.getPage([params.term]);

  if (!page) notFound();

  return {
    title: `${page.data.title} — Glossary`,
    description: page.data.description,
  };
}

export default async function GlossaryTermPage(props: {
  params: Promise<{ term: string }>;
}) {
  const params = await props.params;
  const page = glossarySource.getPage([params.term]);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <PageTransition>
      <article className={styles.entry}>
        <header className={styles.header}>
          <Link href="/glossary" className={styles.breadcrumb}>
            Glossary
          </Link>
          <h1 className={styles.title}>{page.data.title}</h1>
          <p className={styles.description}>{page.data.description}</p>
          <span className={styles.category}>
            {CATEGORY_LABELS[page.data.category]}
          </span>
        </header>
        <div className={styles.body}>
          <MDX components={getMDXComponents()} />
        </div>
      </article>
    </PageTransition>
  );
}
