"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import Link from "next/link";
import { GithubIcon, TwitterIcon } from "@/icons";
import styles from "./styles.module.css";

const LINKS = [
  {
    id: "twitter",
    href: "https://twitter.com/intent/follow?screen_name=raphaelsalaja",
    title: <TwitterIcon size={16} />,
    external: true,
  },
  {
    id: "github",
    href: "https://github.com/raphaelsalaja/userinterface-wiki",
    title: <GithubIcon size={16} />,
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
          U
        </Link>
        <NavigationMenu.List className={styles.list}>
          {LINKS.map((link) => (
            <NavigationMenu.Item key={link.id}>
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
