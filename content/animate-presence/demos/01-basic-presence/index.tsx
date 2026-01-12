"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

export function BasicPresence() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          {isVisible && (
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
      <Controls>
        <Button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Hide" : "Show"}
        </Button>
      </Controls>
    </div>
  );
}
