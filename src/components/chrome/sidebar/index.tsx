"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CheckCircle2Icon } from "@/icons";
import { sounds } from "@/lib/sounds";
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

  const initialTab =
    tabs.find((tab) => tabContainsPath(tab, pathname))?.id ?? tabs[0]?.id;
  const [activeTabId, setActiveTabId] = useState(initialTab);

  const activeTab =
    tabs.find((tab) => tab.id === activeTabId) ?? tabs[0] ?? null;

  if (!activeTab) return null;

  return (
    <aside className={styles.sidebar}>
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
    </aside>
  );
}
