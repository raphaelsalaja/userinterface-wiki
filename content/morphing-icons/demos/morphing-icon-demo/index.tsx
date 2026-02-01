"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import useMeasure from "react-use-measure";
import {
  type IconName,
  iconNames,
  MorphingIcon,
} from "@/components/morphing-icon";
import styles from "./styles.module.css";

export function MorphingIconDemo() {
  const [selectedIcons, setSelectedIcons] = useState<Set<IconName>>(
    () => new Set(["cross", "chevron-left", "arrow-left", "menu"]),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const sequence = iconNames.filter((icon) => selectedIcons.has(icon));
  const safeIndex = sequence.length > 0 ? currentIndex % sequence.length : 0;
  const currentIcon = sequence[safeIndex] ?? "menu";

  const toggleIcon = useCallback((icon: IconName) => {
    setSelectedIcons((prev) => {
      const next = new Set(prev);
      if (next.has(icon)) {
        next.delete(icon);
      } else {
        next.add(icon);
      }
      return next;
    });
  }, []);

  const cyclePreview = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const [ref, bounds] = useMeasure();

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.preview}
        onClick={cyclePreview}
        aria-label="Cycle to next icon"
      >
        <div className={styles["preview-icon"]}>
          <MorphingIcon icon={currentIcon} size={24} strokeWidth={1.5} />
        </div>
      </button>

      <motion.div
        className={styles["dots-container"]}
        animate={{
          width: bounds.width > 0 ? bounds.width : "auto",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className={styles.dots} ref={ref}>
          <AnimatePresence mode="popLayout">
            {sequence.map((icon, index) => (
              <motion.span
                key={icon}
                layout
                className={styles.dot}
                data-active={index === safeIndex}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className={styles.grid}>
        {iconNames.map((icon) => (
          <button
            key={icon}
            type="button"
            className={styles["icon-button"]}
            data-selected={selectedIcons.has(icon)}
            onClick={() => toggleIcon(icon)}
            aria-label={icon}
            aria-pressed={selectedIcons.has(icon)}
          >
            <MorphingIcon icon={icon} size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
