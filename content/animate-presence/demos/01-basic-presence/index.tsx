"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

export function BasicPresence() {
  const [show, setShow] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence>
          {show && (
            <motion.div
              key="box"
              className={styles.box}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setShow(!show)}
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
