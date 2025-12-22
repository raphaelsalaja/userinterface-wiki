"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import Link from "next/link";
import styles from "./styles.module.css";

const LINKS = [
  {
    href: "https://twitter.com/intent/follow?screen_name=raphaelsalaja",
    title: "X (Twitter)",
    external: true,
  },
  {
    href: "https://github.com/raphaelsalaja/userinterface-wiki",
    title: "GitHub",
    external: true,
  },
];

export default function Navigation() {
  return (
    <NavigationMenu.Root className={styles.root}>
      <div className={styles.container}>
        <Link
          href="/"
          className={styles.logo}
          aria-label="userinterface.wiki home"
        >
          ui.wiki
        </Link>
        <NavigationMenu.List className={styles.list}>
          {LINKS.map((link) => (
            <NavigationMenu.Item key={link.title}>
              <NavigationMenu.Link
                className={styles.trigger}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.title}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </div>
    </NavigationMenu.Root>
  );
}
