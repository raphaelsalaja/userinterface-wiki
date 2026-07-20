"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

interface SidebarProps {
  sections: SidebarSection[];
}

function slugFromUrl(url: string): string {
  return url.replace(/^\//, "");
}

export function Sidebar({ sections }: SidebarProps) {
  const pathname = usePathname();
  const { isCompleted } = useProgress();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Articles">
        {sections.map((section) => {
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
      </nav>
    </aside>
  );
}
