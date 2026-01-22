"use client";

import { AnimatePresence, motion, usePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

function Notification() {
  const [isPresent, safeToRemove] = usePresence();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isPresent) {
      // Simulate async cleanup (e.g., sending analytics, saving state)
      const cleanup = async () => {
        // Animate progress to 0
        const duration = 500;
        const steps = 20;
        const decrement = 100 / steps;
        const interval = duration / steps;

        for (let i = 0; i < steps; i++) {
          await new Promise((resolve) => setTimeout(resolve, interval));
          setProgress((prev) => Math.max(0, prev - decrement));
        }

        // Signal we're done
        safeToRemove();
      };

      cleanup();
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      className={styles.notification}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <div className={styles.content}>
        <span className={styles.title}>
          {isPresent ? "Notification" : "Cleaning up..."}
        </span>
        <span className={styles.message}>
          {isPresent
            ? "Click dismiss to trigger async cleanup"
            : "Saving state before unmount"}
        </span>
      </div>
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressBar}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </motion.div>
  );
}

export function ManualExitDemo() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence>
          {isVisible && <Notification key="notification" />}
        </AnimatePresence>
      </div>
      <Controls>
        <Button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Dismiss" : "Show"}
        </Button>
      </Controls>
    </div>
  );
}
