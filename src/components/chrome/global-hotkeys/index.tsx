"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
  formatForDisplay,
  useHotkey,
  useHotkeyRegistrations,
} from "@tanstack/react-hotkeys";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { AskAiDialog, type AskAiPage } from "@/components/features/ask-ai";
import { useAskAiStore } from "@/components/features/ask-ai/store";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

interface GlobalHotkeysProps {
  /** All articles in curriculum order, for [ and ] navigation. */
  pages: AskAiPage[];
}

/**
 * Site-wide keyboard shortcuts, mounted once in the root layout.
 * Also owns the Ask AI palette and the shortcut help dialog since
 * both are opened exclusively through these shortcuts.
 */
export function GlobalHotkeys({ pages }: GlobalHotkeysProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const toggleAskAi = useAskAiStore((state) => state.toggle);
  const [helpOpen, setHelpOpen] = useState(false);

  useHotkey("Mod+K", () => toggleAskAi(), {
    meta: { name: "Ask AI" },
  });

  useHotkey(
    "T",
    () => {
      sounds.click();
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    },
    { meta: { name: "Toggle theme" } },
  );

  const currentIndex = pages.findIndex((page) => page.url === pathname);

  useHotkey(
    "[",
    () => {
      const prev = pages[currentIndex - 1];
      if (currentIndex > 0 && prev) router.push(prev.url as "/");
    },
    { enabled: currentIndex > 0, meta: { name: "Previous article" } },
  );

  useHotkey(
    "]",
    () => {
      const next = pages[currentIndex + 1];
      if (currentIndex !== -1 && next) router.push(next.url as "/");
    },
    {
      enabled: currentIndex !== -1 && currentIndex < pages.length - 1,
      meta: { name: "Next article" },
    },
  );

  // Raw form because Shift+punctuation strings are layout-dependent
  useHotkey({ key: "/", shift: true }, () => setHelpOpen((open) => !open), {
    meta: { name: "Keyboard shortcuts" },
  });

  return (
    <>
      <AskAiDialog pages={pages} />
      <HotkeyHelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}

interface HotkeyHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function HotkeyHelpDialog({ open, onOpenChange }: HotkeyHelpDialogProps) {
  const { hotkeys } = useHotkeyRegistrations();

  const named = hotkeys.filter(
    (registration) => registration.options.meta?.name,
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal>
            <Dialog.Backdrop
              render={
                <motion.div
                  className={styles.backdrop}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              }
            />
            <Dialog.Viewport className={styles.viewport}>
              <Dialog.Popup
                render={
                  <motion.div
                    className={styles.popup}
                    initial={{ opacity: 0, scale: 0.98, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  />
                }
              >
                <Dialog.Title className={styles.title}>
                  Keyboard shortcuts
                </Dialog.Title>
                <ul className={styles.list}>
                  {named.map((registration) => (
                    <li key={registration.id} className={styles.item}>
                      <span className={styles.label}>
                        {registration.options.meta?.name}
                      </span>
                      <kbd className={styles.kbd}>
                        {formatForDisplay(registration.hotkey)}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </Dialog.Popup>
            </Dialog.Viewport>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
