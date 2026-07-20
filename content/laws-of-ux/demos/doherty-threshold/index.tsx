"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { Button } from "@/components/primitives/button";
import { Spinner } from "@/components/primitives/spinner";
import styles from "./styles.module.css";

interface DelayOption {
  delay: number;
  description: string;
}

const DELAYS: DelayOption[] = [
  { delay: 100, description: "Instant (<100ms)" },
  { delay: 400, description: "Threshold (<400ms)" },
  { delay: 2000, description: "Broken (>2000ms)" },
];

export function DohertyThreshold() {
  const [loading, setLoading] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number | null>(null);

  const handleClick = useCallback((delay: number) => {
    setLoading(delay);
    setCompleted(null);
    setTimeout(() => {
      setLoading(null);
      setCompleted(delay);
      setTimeout(() => setCompleted(null), 1200);
    }, delay);
  }, []);

  const animation = {
    initial: { opacity: 0, scale: 0.9, filter: "blur(2px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 0.9, filter: "blur(2px)" },
    transition: { duration: 0.15 },
  };

  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {DELAYS.map((option) => {
          const isLoading = loading === option.delay;
          const isCompleted = completed === option.delay;

          return (
            <div key={option.delay} className={styles.card}>
              <Button
                variant="secondary"
                className={styles.button}
                onClick={() => handleClick(option.delay)}
                disabled={loading !== null}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLoading ? (
                    <Spinner key="loading" />
                  ) : isCompleted ? (
                    <motion.span key="completed" {...animation}>
                      Done
                    </motion.span>
                  ) : (
                    <motion.span key="save" {...animation}>
                      Save
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <span className={styles.description}>{option.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
