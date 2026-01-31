"use client";

import { Field } from "@base-ui/react/field";
import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@/icons";
import type { DemoInfo } from "@/lib/demos";
import styles from "./styles.module.css";

function formatDemoTitle(slug: string): string {
  const withoutNumber = slug.replace(/^\d+-/, "");
  return withoutNumber
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface DemoListProps {
  demos: DemoInfo[];
}

export function DemoList({ demos }: DemoListProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(demos, {
        keys: ["slug", "article"],
        threshold: 0.3,
        includeScore: true,
      }),
    [demos],
  );

  const filteredDemos = useMemo(() => {
    const q = query.trim();
    return q ? fuse.search(q).map((result) => result.item) : demos;
  }, [fuse, demos, query]);

  const demosByArticle = useMemo(() => {
    return filteredDemos.reduce(
      (acc, demo) => {
        if (!acc[demo.article]) {
          acc[demo.article] = [];
        }
        acc[demo.article].push(demo);
        return acc;
      },
      {} as Record<string, DemoInfo[]>,
    );
  }, [filteredDemos]);

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.heading}>All Demos</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <Field.Root className={styles.search}>
            <MagnifyingGlassIcon className={styles.icon} size={18} />
            <Field.Control
              type="search"
              className={styles.input}
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Field.Root>
        </div>

        <div className={styles.list}>
          {Object.entries(demosByArticle).map(([article, articleDemos]) => (
            <section key={article} className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {formatDemoTitle(article)}
              </h2>
              <ul className={styles.items}>
                {articleDemos.map((demo) => (
                  <li key={demo.url} className={styles.item}>
                    <Link href={demo.url} className={styles.row}>
                      {formatDemoTitle(demo.slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
