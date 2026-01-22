"use client";

import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

function Card() {
  const isPresent = useIsPresent();

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <span className={styles.status} data-present={isPresent}>
        {isPresent ? "Present" : "Exiting..."}
      </span>
    </motion.div>
  );
}

export function PresenceState() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence>{isVisible && <Card key="card" />}</AnimatePresence>
      </div>
      <Controls>
        <Button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Remove" : "Add"}
        </Button>
      </Controls>
    </div>
  );
}
