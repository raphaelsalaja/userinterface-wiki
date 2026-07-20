"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sounds } from "@/lib/sounds";
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

export function Sidebar({ sections }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Articles">
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <span className={styles.label}>{section.label}</span>
            <ul className={styles.list}>
              {section.items.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url as "/"}
                    className={styles.link}
                    data-active={pathname === item.url || undefined}
                    onClick={sounds.click}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
