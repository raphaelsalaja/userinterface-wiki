"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/primitives/button";
import type { DemoInfo } from "@/lib/demos";
import { demoRegistry } from "@/lib/generated/demo-registry";
import styles from "./styles.module.css";

interface AdjacentDemos {
  prev: DemoInfo | null;
  next: DemoInfo | null;
  current: number;
  total: number;
}

interface DemoPageProps {
  demo: DemoInfo;
  adjacent: AdjacentDemos;
}

export function DemoPage({ demo, adjacent }: DemoPageProps) {
  const router = useRouter();
  const DemoComponent = demoRegistry[demo.key];

  useHotkey(
    "ArrowLeft",
    () => {
      if (adjacent.prev) router.push(adjacent.prev.url as "/demo/[slug]");
    },
    {
      preventDefault: false,
      stopPropagation: false,
      meta: { name: "Previous demo" },
    },
  );

  useHotkey(
    "ArrowRight",
    () => {
      if (adjacent.next) router.push(adjacent.next.url as "/demo/[slug]");
    },
    {
      preventDefault: false,
      stopPropagation: false,
      meta: { name: "Next demo" },
    },
  );

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <h1 className={styles.text} data-color="primary">
          {demo.title}
        </h1>
        <h2 className={styles.text} data-color="secondary">
          {demo.articleTitle}
        </h2>
        <Button
          variant="secondary"
          radius="full"
          style={{ position: "absolute" }}
          render={
            <Link className={styles.button} href={`/${demo.article}` as "/"}>
              Read Article
            </Link>
          }
        />
      </div>
      <div className={styles.frame}>
        {DemoComponent ? (
          <DemoComponent />
        ) : (
          <div className={styles.error}>Demo not found: {demo.key}</div>
        )}
      </div>
      <footer className={styles.footer}>
        {adjacent.prev ? (
          <Link
            href={adjacent.prev.url as "/demo/[slug]"}
            className={styles.link}
          >
            <span className={styles.text} data-color="secondary">
              Previous
            </span>
            <span className={styles.text} data-color="primary" data-truncate>
              {adjacent.prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {adjacent.next ? (
          <Link
            href={adjacent.next.url as "/demo/[slug]"}
            className={styles.link}
            data-align="right"
          >
            <span className={styles.text} data-color="secondary">
              Next
            </span>
            <span className={styles.text} data-color="primary" data-truncate>
              {adjacent.next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </footer>
    </div>
  );
}
