"use client";

import { AnimatePresence, motion, useIsPresent } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

const definitions = {
  present: {
    word: "present",
    pronunciation: "/ˈprez.ənt/",
    type: "adjective",
    definition:
      "In a particular place; being in view or at hand. Existing or occurring now, at this time.",
  },
  exiting: {
    word: "exit",
    pronunciation: "/ˈek.sɪt/",
    type: "verb",
    definition:
      "To go out of or leave a place; to depart from a scene, stage, or situation.",
  },
};

function Card() {
  const isPresent = useIsPresent();
  const entry = definitions[isPresent ? "present" : "exiting"];

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    >
      <span className={styles.word}>{entry.word}</span>
      <span className={styles.pronunciation}>{entry.pronunciation}</span>
      <span className={styles.type}>{entry.type}</span>
      <p className={styles.definition}>{entry.definition}</p>
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
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.button}
          onClick={() => setIsVisible(!isVisible)}
        >
          Toggle
        </button>
      </div>
    </div>
  );
}
