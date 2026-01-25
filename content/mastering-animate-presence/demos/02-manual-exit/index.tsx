"use client";

import { AnimatePresence, motion, usePresence } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

function Notification() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      const timer = setTimeout(() => {
        safeToRemove();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      className={styles.notification}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <span className={styles.title}>
        {isPresent ? "Notification" : "Cleaning up..."}
      </span>
      <span className={styles.message}>
        {isPresent ? "Click dismiss to trigger cleanup" : "Saving state..."}
      </span>
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
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? "Dismiss" : "Show"}
        </button>
      </div>
    </div>
  );
}
