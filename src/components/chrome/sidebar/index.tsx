"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAskAiStore } from "@/components/features/ask-ai/store";
import { Shortcut } from "@/components/primitives/shortcut";
import { CheckCircle2Icon, MagnifyingGlassIcon } from "@/icons";
import { sounds } from "@/lib/sounds";
import { useBookmarks } from "@/lib/stores/bookmarks";
import { useProgress } from "@/lib/stores/progress";
import styles from "./styles.module.css";

export interface SidebarItem {
  title: string;
  url: string;
}

export interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

export interface SidebarTab {
  id: string;
  label: string;
  sections: SidebarSection[];
}

interface SidebarProps {
  tabs: SidebarTab[];
  /** Static links shown below the tabbed sections, e.g. Glossary, Vault. */
  links?: SidebarItem[];
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

function tabContainsPath(tab: SidebarTab, pathname: string): boolean {
  return tab.sections.some((section) =>
    section.items.some((item) => item.url === pathname),
  );
}

export function Sidebar({ tabs, links }: SidebarProps) {
  const pathname = usePathname();
  const { isCompleted } = useProgress();
  const { bookmarkedSlugs } = useBookmarks();
  const openAskAi = useAskAiStore((state) => state.open);

  const initialTab =
    tabs.find((tab) => tabContainsPath(tab, pathname))?.id ?? tabs[0]?.id;
  const [activeTabId, setActiveTabId] = useState(initialTab);

  const activeTab =
    tabs.find((tab) => tab.id === activeTabId) ?? tabs[0] ?? null;

  if (!activeTab) return null;

  const allItems = tabs.flatMap((tab) =>
    tab.sections.flatMap((section) => section.items),
  );
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

      {tabs.length > 1 && (
        <div className={styles.tabs} role="tablist" aria-label="Content type">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={tab.id === activeTab.id}
              data-active={tab.id === activeTab.id || undefined}
              onClick={() => {
                sounds.click();
                setActiveTabId(tab.id);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

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
        {activeTab.sections.map((section) => {
          const completedCount = section.items.filter((item) =>
            isCompleted(slugFromUrl(item.url)),
          ).length;

          return (
            <div key={section.id} className={styles.section}>
              <span className={styles.label}>
                {section.label}
                {completedCount > 0 && (
                  <span className={styles.progress}>
                    {completedCount}/{section.items.length}
                  </span>
                )}
              </span>
              <ul className={styles.list}>
                {section.items.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url as "/"}
                      className={styles.link}
                      data-active={pathname === item.url || undefined}
                      onClick={sounds.click}
                    >
                      <span className={styles["link-title"]}>{item.title}</span>
                      {isCompleted(slugFromUrl(item.url)) && (
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
          );
        })}
        {links && links.length > 0 && (
          <div className={styles.section}>
            <span className={styles.label}>Reference</span>
            <ul className={styles.list}>
              {links.map((link) => (
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
              ))}
            </ul>
          </div>
        )}
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
