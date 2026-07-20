"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";

function useMeasure<T extends HTMLElement = HTMLElement>(): [
  (node: T | null) => void,
  { width: number; height: number },
] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}

export function AnimatedHeight() {
  const [expanded, setExpanded] = useState(false);
  const [ref, bounds] = useMeasure();

  return (
    <div className={styles.container}>
      <MotionConfig
        transition={{
          duration: 0.4,
          ease: [0.19, 1, 0.22, 1],
          delay: 0.05,
        }}
      >
        <div className={styles.card}>
          <motion.div
            animate={{
              height: bounds.height > 0 ? bounds.height : "auto",
            }}
            className={styles.content}
          >
            <div ref={ref} className={styles.inner}>
              <p className={styles.text}>
                Containers on the web snap to their new size instantly when
                content changes. By measuring the bounds of a container and
                animating to those values, we can make these transitions feel
                smooth and intentional.
              </p>
              <AnimatePresence mode="popLayout">
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    className={styles.text}
                  >
                    This technique uses a ref to track the height of the inner
                    content. When the content changes, the measured height
                    updates and Motion animates the outer container to match.
                    The inner div always has its natural height, so the content
                    is never clipped or distorted.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <button
            type="button"
            className={styles.button}
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </MotionConfig>
    </div>
  );
}
