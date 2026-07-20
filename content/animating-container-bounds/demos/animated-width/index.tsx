"use client";

import { MotionConfig, type MotionProps, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.css";

const animation: MotionProps = {
  initial: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
  transition: {
    duration: 0.4,
    ease: [0.19, 1, 0.22, 1],
    delay: 0.05,
    opacity: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

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

const labels = ["Lorem Ipsum", "Ex Amet", "Aliqua Velit"];

export function AnimatedWidth() {
  const [index, setIndex] = useState(0);
  const [ref, bounds] = useMeasure();

  function handleClick() {
    setIndex((prev) => (prev + 1) % labels.length);
  }

  return (
    <div className={styles.container}>
      <MotionConfig
        transition={{
          duration: 0.4,
          ease: [0.19, 1, 0.22, 1],
          delay: 0.05,
        }}
      >
        <motion.button
          animate={{
            width: bounds.width > 0 ? bounds.width : "auto",
          }}
          onClick={handleClick}
          className={styles.button}
        >
          <div ref={ref} className={styles.wrapper}>
            <motion.span
              {...animation}
              key={labels[index]}
              className={styles.label}
            >
              {labels[index]}
            </motion.span>
          </div>
        </motion.button>
      </MotionConfig>
    </div>
  );
}
