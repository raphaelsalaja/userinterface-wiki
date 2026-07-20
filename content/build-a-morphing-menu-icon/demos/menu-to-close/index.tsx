"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

const CENTER = 7;

interface IconLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
}

const collapsed: IconLine = {
  x1: CENTER,
  y1: CENTER,
  x2: CENTER,
  y2: CENTER,
  opacity: 0,
};

const icons: Record<"menu" | "close", [IconLine, IconLine, IconLine]> = {
  menu: [
    { x1: 2, y1: 3.5, x2: 12, y2: 3.5 },
    { x1: 2, y1: 7, x2: 12, y2: 7 },
    { x1: 2, y1: 10.5, x2: 12, y2: 10.5 },
  ],
  close: [
    { x1: 3, y1: 3, x2: 11, y2: 11 },
    { x1: 3, y1: 11, x2: 11, y2: 3 },
    collapsed,
  ],
};

const transition = { ease: [0.19, 1, 0.22, 1] as const, duration: 0.4 };

export function MenuToClose() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  const lines = open ? icons.close : icons.menu;
  const activeTransition = reducedMotion ? { duration: 0 } : transition;

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <svg width={28} height={28} viewBox="0 0 14 14" aria-hidden="true">
          {lines.map((line, index) => (
            <motion.line
              // biome-ignore lint/suspicious/noArrayIndexKey: line slots are positional by design
              key={index}
              animate={{
                x1: line.x1,
                y1: line.y1,
                x2: line.x2,
                y2: line.y2,
                opacity: line.opacity ?? 1,
              }}
              transition={activeTransition}
              stroke="currentColor"
              strokeWidth={1.25}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </button>
    </div>
  );
}
