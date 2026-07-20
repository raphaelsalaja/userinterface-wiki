"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Banner } from "@/components/chrome/banner";
import { ThemeSwitcher } from "@/components/chrome/theme-switcher";
import { useAskAiStore } from "@/components/features/ask-ai/store";
import { Shortcut } from "@/components/primitives/shortcut";
import { MagnifyingGlassIcon } from "@/icons";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

const CHROMELESS_PATHS = new Set(["/live"]);

const LINKS = [
  {
    id: "demos",
    href: "/demo",
    title: "Demos",
    external: false,
  },
  {
    id: "skill",
    href: "/skill",
    title: "Skill",
    external: false,
  },
  {
    id: "twitter",
    href: "https://twitter.com/intent/follow?screen_name=raphaelsalaja",
    title: "Twitter",
    external: true,
  },
  {
    id: "github",
    href: "https://github.com/raphaelsalaja/userinterface-wiki",
    title: "Github",
    external: true,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const openAskAi = useAskAiStore((state) => state.open);
  if (CHROMELESS_PATHS.has(pathname)) return null;

  return (
    <NavigationMenu.Root className={styles.root}>
      <Banner />
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
          <li>
            <Shortcut shortcut={{ label: "Ask AI", hotkey: "Mod+K" }}>
              <button
                type="button"
                className={styles.action}
                aria-label="Search or ask AI"
                onClick={() => {
                  sounds.click();
                  openAskAi();
                }}
              >
                <MagnifyingGlassIcon size={16} />
              </button>
            </Shortcut>
          </li>
          <li>
            <ThemeSwitcher />
          </li>
        </NavigationMenu.List>
      </div>
    </NavigationMenu.Root>
  );
}
