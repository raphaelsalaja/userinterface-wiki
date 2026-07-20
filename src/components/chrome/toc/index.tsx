"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export interface TocItem {
  title: string;
  url: string;
  depth: number;
}

interface TocProps {
  items: TocItem[];
}

export function Toc({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className={styles.toc}>
      <nav aria-label="On this page">
        <span className={styles.label}>On this page</span>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.url}>
              <a
                href={item.url}
                className={styles.link}
                data-active={activeId === item.url.slice(1) || undefined}
                data-depth={item.depth}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
