"use client";

import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/icons";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    sounds.click();
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        >
          {resolvedTheme === "light" ? (
            <SunIcon size={16} />
          ) : (
            <MoonIcon size={16} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
