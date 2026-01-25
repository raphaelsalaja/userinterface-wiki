"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

function ChildItem({ label }: { label: string }) {
  return (
    <motion.div
      className={styles.child}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{
        duration: 0.5,
      }}
    >
      {label}
    </motion.div>
  );
}

interface ParentCardProps {
  showParent: boolean;
  propagate: boolean;
}

function ParentCard({ showParent, propagate }: ParentCardProps) {
  return (
    <div className={styles.column}>
      <div className={styles["column-content"]}>
        <AnimatePresence>
          {showParent && (
            <motion.div
              key="parent"
              className={styles.parent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            >
              <span className={styles.label}>
                {propagate ? "With Propagate" : "No Propagate"}
              </span>
              <div className={styles.children}>
                <AnimatePresence propagate={propagate}>
                  <ChildItem key="a" label="A" />
                  <ChildItem key="b" label="B" />
                  <ChildItem key="c" label="C" />
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function NestedExitsDemo() {
  const [showParent, setShowParent] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <ParentCard showParent={showParent} propagate={false} />
        <ParentCard showParent={showParent} propagate={true} />
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setShowParent(!showParent)}
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
