"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

type Mode = "sync" | "wait" | "popLayout";

const modes: Mode[] = ["sync", "wait", "popLayout"];

function ModeExample({ mode, show }: { mode: Mode; show: boolean }) {
  return (
    <div className={styles.example}>
      <div className={styles.label}>{mode}</div>
      <div className={styles.icon}>
        <AnimatePresence mode={mode}>
          <motion.div
            key={show ? "a" : "b"}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
          >
            {show ? "A" : "B"}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ModesDemo() {
  const [show, setShow] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {modes.map((mode) => (
          <ModeExample key={mode} mode={mode} show={show} />
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setShow((prev) => !prev)}
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
