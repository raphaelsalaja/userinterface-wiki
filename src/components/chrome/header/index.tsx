"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "@/components/chrome/theme-switcher";
import { Checkmark1SmallIcon, ClipboardIcon } from "@/icons";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

export interface HeaderPage {
  title: string;
  url: string;
  /** Section label shown as the breadcrumb parent, e.g. "Fundamentals". */
  section?: string;
  /** Articles expose a markdown endpoint for the copy-page action. */
  markdown?: boolean;
}

interface HeaderProps {
  pages: HeaderPage[];
}

function CopyPageButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function handleCopy() {
    sounds.click();
    try {
      const response = await fetch(`${url}.md`);
      const markdown = await response.text();
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; ignore.
    }
  }

  return (
    <button
      type="button"
      className={styles.action}
      onClick={handleCopy}
      aria-label="Copy page as markdown"
    >
      {copied ? (
        <Checkmark1SmallIcon size={14} aria-hidden="true" />
      ) : (
        <ClipboardIcon size={14} aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy page"}
    </button>
  );
}

export function Header({ pages }: HeaderProps) {
  const pathname = usePathname();
  const page =
    pages.find((entry) => entry.url === pathname) ??
    pages.find(
      (entry) => entry.url !== "/" && pathname.startsWith(`${entry.url}/`),
    );

  return (
    <header className={styles.header}>
      <div className={styles.crumbs}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Home"
          onClick={sounds.click}
        >
          U
        </Link>
        {page ? (
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            {page.section && (
              <>
                <span className={styles.parent}>{page.section}</span>
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              </>
            )}
            <span className={styles.current} aria-current="page">
              {page.title}
            </span>
          </nav>
        ) : (
          <span className={styles.current}>
            {pathname === "/" ? "Overview" : ""}
          </span>
        )}
      </div>
      <div className={styles.actions}>
        {page?.markdown && <CopyPageButton url={page.url} />}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
