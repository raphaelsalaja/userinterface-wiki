"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

type Mode = "sync" | "wait" | "popLayout";

const modes: Mode[] = ["sync", "wait", "popLayout"];

export function ModesDemo() {
  const [mode, setMode] = useState<Mode>("sync");
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % 3);
  };

  const cycleMode = () => {
    setMode((prev) => {
      const currentIndex = modes.indexOf(prev);
      return modes[(currentIndex + 1) % modes.length];
    });
  };

  const colors = ["var(--gray-12)", "var(--gray-10)", "var(--gray-8)"];

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence mode={mode}>
          <motion.div
            key={index}
            className={styles.box}
            style={{ background: colors[index] }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
          />
        </AnimatePresence>
      </div>
      <Controls>
        <Button onClick={cycleMode}>{mode}</Button>
        <Button onClick={nextSlide}>Next</Button>
      </Controls>
    </div>
  );
}
