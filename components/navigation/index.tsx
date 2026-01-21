"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import Link from "next/link";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

const LINKS = [
  {
    id: "twitter",
    href: "https://twitter.com/intent/follow?screen_name=raphaelsalaja",
    title: "(X) Twitter",
    external: true,
  },
  {
    id: "github",
    href: "https://github.com/raphaelsalaja/userinterface-wiki",
    title: "Github",
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
          aria-label="Home"
          onClick={sounds.click}
        >
          U
        </Link>
        <NavigationMenu.List className={styles.list}>
          {LINKS.map((link) => (
            <NavigationMenu.Item key={link.id}>
              <NavigationMenu.Link
                href={link.href}
                className={styles.link}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={sounds.click}
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
