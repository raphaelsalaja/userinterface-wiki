"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import { CrossLargeIcon } from "@/icons";
import styles from "./styles.module.css";

export function LinearDemo() {
  const [isHolding, setIsHolding] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [useLinear, setUseLinear] = useState(true);

  const progress = useMotionValue(0);
  const clipPath = useTransform(
    progress,
    [0, 1],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const animation = useRef<ReturnType<typeof animate>>(null);
  const resetTimeout = useRef<NodeJS.Timeout>(null);

  const reset = () => {
    animation.current?.stop();
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
      resetTimeout.current = null;
    }
    setIsHolding(false);
    setIsDeleted(false);
    progress.set(0);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on mount only
  useEffect(() => {
    reset();
  }, []);

  const handlePointerDown = () => {
    setIsHolding(true);
    animation.current?.stop();
    animation.current = animate(progress, 1, {
      duration: 2,
      ease: useLinear ? "linear" : "easeInOut",
      onComplete: () => {
        setIsHolding(false);
        setIsDeleted(true);
        resetTimeout.current = setTimeout(() => {
          setIsDeleted(false);
          progress.set(0);
        }, 1000);
      },
    });
  };

  const handlePointerUp = () => {
    setIsHolding(false);
    animation.current?.stop();
    animation.current = animate(progress, 0, {
      duration: 0.3,
      ease: "easeOut",
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <motion.button
          type="button"
          className={styles.button}
          animate={{
            scale: isDeleted ? 0.8 : 1,
            opacity: isDeleted ? 0 : 1,
            x: isHolding ? [-2, 2, -2, 2, -1, 1, 0] : 0,
          }}
          transition={
            isHolding
              ? { duration: 0.4, repeat: Number.POSITIVE_INFINITY }
              : { duration: 0.15, ease: "easeOut" }
          }
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <span className={styles.label}>
            Delete
            <CrossLargeIcon size={18} />
          </span>
          <motion.span className={styles.fill} style={{ clipPath }}>
            Delete
            <CrossLargeIcon size={18} />
          </motion.span>
        </motion.button>
      </div>
      <Controls className={styles.controls}>
        <Button onClick={() => setUseLinear(!useLinear)}>
          {useLinear ? "Linear" : "Ease"}
        </Button>
      </Controls>
    </div>
  );
}
