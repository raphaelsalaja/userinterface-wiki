"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/button";
import { demoRegistry } from "@/lib/demo-registry";
import type { DemoInfo } from "@/lib/demos";
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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && adjacent.prev) {
        router.push(adjacent.prev.url as "/demo/[slug]");
      } else if (e.key === "ArrowRight" && adjacent.next) {
        router.push(adjacent.next.url as "/demo/[slug]");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [adjacent, router]);

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
