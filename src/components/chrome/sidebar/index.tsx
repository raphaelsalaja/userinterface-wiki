"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAskAiStore } from "@/components/features/ask-ai/store";
import { Shortcut } from "@/components/primitives/shortcut";
import {
  CheckCircle2Icon,
  ChevronDownSmallIcon,
  MagnifyingGlassIcon,
} from "@/icons";
import { sounds } from "@/lib/sounds";
import { useBookmarks } from "@/lib/stores/bookmarks";
import { useProgress } from "@/lib/stores/progress";
import styles from "./styles.module.css";

export interface SidebarItem {
  title: string;
  url: string;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
  /** Tracked groups show per-article completion state. */
  tracked?: boolean;
}

interface SidebarProps {
  groups: SidebarGroup[];
}

const FOOTER_LINKS = [
  { title: "Demos", url: "/demo", external: false },
  { title: "Skills", url: "/skill", external: false },
  {
    title: "GitHub",
    url: "https://github.com/raphaelsalaja/userinterface-wiki",
    external: true,
  },
  {
    title: "Twitter",
    url: "https://twitter.com/intent/follow?screen_name=raphaelsalaja",
    external: true,
  },
];

function slugFromUrl(url: string): string {
  return url.replace(/^\//, "");
}

function groupForPath(groups: SidebarGroup[], pathname: string) {
  return groups.find((group) =>
    group.items.some(
      (item) => item.url === pathname || pathname.startsWith(`${item.url}/`),
    ),
  );
}

export function Sidebar({ groups }: SidebarProps) {
  const pathname = usePathname();
  const { isCompleted } = useProgress();
  const { bookmarkedSlugs } = useBookmarks();
  const openAskAi = useAskAiStore((state) => state.open);

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const active = groupForPath(groups, pathname);
    return new Set(active ? [active.id] : groups.slice(0, 1).map((g) => g.id));
  });

  // Navigating into a collapsed group (search, links) reveals it.
  useEffect(() => {
    const active = groupForPath(groups, pathname);
    if (!active) return;
    setExpanded((current) => {
      if (current.has(active.id)) return current;
      return new Set(current).add(active.id);
    });
  }, [groups, pathname]);

  function toggleGroup(id: string) {
    sounds.click();
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const allItems = groups.flatMap((group) => group.items);
  const bookmarkedItems = allItems.filter((item) =>
    bookmarkedSlugs.has(slugFromUrl(item.url)),
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Home"
          onClick={sounds.click}
        >
          <span className={styles.logo}>U</span>
          <span className={styles.wordmark}>userinterface.wiki</span>
        </Link>
        <Shortcut shortcut={{ label: "Ask AI", hotkey: "Mod+K" }}>
          <button
            type="button"
            className={styles.search}
            aria-label="Search or ask AI"
            onClick={() => {
              sounds.click();
              openAskAi();
            }}
          >
            <MagnifyingGlassIcon size={14} />
          </button>
        </Shortcut>
      </div>

      <nav className={styles.nav} aria-label="Articles">
        {bookmarkedItems.length > 0 && (
          <div className={styles.section}>
            <span className={styles.label}>Bookmarks</span>
            <ul className={styles.list}>
              {bookmarkedItems.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url as "/"}
                    className={styles.link}
                    data-active={pathname === item.url || undefined}
                    onClick={sounds.click}
                  >
                    <span className={styles["link-title"]}>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {groups.map((group) => {
          const isExpanded = expanded.has(group.id);
          const completedCount = group.tracked
            ? group.items.filter((item) => isCompleted(slugFromUrl(item.url)))
                .length
            : 0;
          const containsActive = group.items.some(
            (item) =>
              item.url === pathname || pathname.startsWith(`${item.url}/`),
          );

          return (
            <div key={group.id} className={styles.group}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isExpanded}
                data-active={(containsActive && !isExpanded) || undefined}
                onClick={() => toggleGroup(group.id)}
              >
                <span className={styles["trigger-label"]}>{group.label}</span>
                {completedCount > 0 && (
                  <span className={styles.progress}>
                    {completedCount}/{group.items.length}
                  </span>
                )}
                <ChevronDownSmallIcon
                  size={14}
                  className={styles.chevron}
                  data-collapsed={!isExpanded || undefined}
                  aria-hidden="true"
                />
              </button>
              <div
                className={styles.body}
                data-collapsed={!isExpanded || undefined}
              >
                <div className={styles.clip}>
                  <ul className={styles.list} inert={!isExpanded}>
                    {group.items.map((item) => (
                      <li key={item.url}>
                        <Link
                          href={item.url as "/"}
                          className={styles.link}
                          data-active={
                            item.url === pathname ||
                            pathname.startsWith(`${item.url}/`) ||
                            undefined
                          }
                          onClick={sounds.click}
                        >
                          <span className={styles["link-title"]}>
                            {item.title}
                          </span>
                          {group.tracked &&
                            isCompleted(slugFromUrl(item.url)) && (
                              <CheckCircle2Icon
                                size={13}
                                className={styles.check}
                                aria-label="Completed"
                              />
                            )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <ul className={styles.list}>
          {FOOTER_LINKS.map((link) =>
            link.external ? (
              <li key={link.url}>
                <a
                  href={link.url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={sounds.click}
                >
                  <span className={styles["link-title"]}>{link.title}</span>
                </a>
              </li>
            ) : (
              <li key={link.url}>
                <Link
                  href={link.url as "/"}
                  className={styles.link}
                  data-active={pathname.startsWith(link.url) || undefined}
                  onClick={sounds.click}
                >
                  <span className={styles["link-title"]}>{link.title}</span>
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </aside>
  );
}
