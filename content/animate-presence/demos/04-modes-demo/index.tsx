"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

type Mode = "sync" | "wait" | "popLayout";

const modes: Mode[] = ["sync", "wait", "popLayout"];

function AnimatedWidthContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={width > 0 ? { width } : undefined}
      transition={{
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      <div ref={contentRef} className={className}>
        {children}
      </div>
    </motion.div>
  );
}

function ModeExample({ mode, showBoth }: { mode: Mode; showBoth: boolean }) {
  return (
    <div className={styles.example}>
      <div className={styles.label}>{mode}</div>
      <AnimatedWidthContainer className={styles.pillsContainer}>
        <AnimatePresence mode={mode}>
          {showBoth && (
            <motion.div
              key="pill-1"
              className={styles.pill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
            />
          )}
        </AnimatePresence>
        <motion.div
          key="pill-2"
          className={styles.pill}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        />
      </AnimatedWidthContainer>
    </div>
  );
}

export function ModesDemo() {
  const [showBoth, setShowBoth] = useState(true);

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {modes.map((mode) => (
          <ModeExample key={mode} mode={mode} showBoth={showBoth} />
        ))}
      </div>
      <Controls>
        <Button onClick={() => setShowBoth((prev) => !prev)}>Toggle</Button>
      </Controls>
    </div>
  );
}
