"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

const items = ["A", "B", "C"];

export function NestedExitsDemo() {
  const [show, setShow] = useState(true);

  const renderCard = (propagate: boolean) => (
    <AnimatePresence>
      {show && (
        <motion.div
          key="card"
          className={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <span className={styles.label}>
            {propagate ? "With Propagate" : "No Propagate"}
          </span>
          <div className={styles.items}>
            <AnimatePresence propagate={propagate}>
              {items.map((item) => (
                <motion.div
                  key={item}
                  className={styles.item}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {item}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={styles.root}>
      <div className={styles.cards}>
        {renderCard(false)}
        {renderCard(true)}
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
