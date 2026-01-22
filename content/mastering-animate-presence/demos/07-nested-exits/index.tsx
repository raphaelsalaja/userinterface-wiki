"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

function ChildItem({ label }: { label: string }) {
  return (
    <motion.div
      className={styles.child}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {label}
    </motion.div>
  );
}

export function NestedExitsDemo() {
  const [showParent, setShowParent] = useState(true);
  const [propagate, setPropagate] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence>
          {showParent && (
            <motion.div
              key="parent"
              className={styles.parent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            >
              <span className={styles.label}>Parent</span>
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
      <Controls>
        <Button onClick={() => setShowParent(!showParent)}>
          {showParent ? "Remove Parent" : "Show Parent"}
        </Button>
        <Button onClick={() => setPropagate(!propagate)}>
          propagate: {propagate ? "true" : "false"}
        </Button>
      </Controls>
    </div>
  );
}
