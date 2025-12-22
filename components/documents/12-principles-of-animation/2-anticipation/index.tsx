"use client";

import chroma from "chroma-js";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { getNearestPantone } from "pantone-tcx";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const REFRESH_THRESHOLD = 80;
const RANDOMIZE_INTERVAL = 100;

export function Anticipation() {
  const [colorHex, setColorHex] = useState("#fff");
  const [isShaking, setIsShaking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPastThreshold = useRef(false);

  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const scale = useTransform(y, [0, REFRESH_THRESHOLD], [1, 0.95]);

  const refreshColor = useCallback(() => {
    setColorHex(chroma.random().hex());
  }, []);

  useEffect(() => {
    refreshColor();
  }, [refreshColor]);

  useEffect(() => {
    let shakeInterval: NodeJS.Timeout | null = null;

    if (isShaking) {
      let direction = 1;
      shakeInterval = setInterval(() => {
        const offset = (Math.random() * 2 + 1) * direction;
        animate(x, offset, { duration: 0.05, ease: "linear" });
        direction *= -1;
      }, 50);
    } else {
      animate(x, 0, { duration: 0.1, ease: "easeOut" });
    }

    return () => {
      if (shakeInterval) clearInterval(shakeInterval);
    };
  }, [isShaking, x]);

  useEffect(() => {
    const unsubscribe = y.on("change", (latest) => {
      const pastThreshold = latest >= REFRESH_THRESHOLD;

      if (pastThreshold && !isPastThreshold.current) {
        isPastThreshold.current = true;
        setIsShaking(true);
        refreshColor();
        intervalRef.current = setInterval(refreshColor, RANDOMIZE_INTERVAL);
      } else if (!pastThreshold && isPastThreshold.current) {
        isPastThreshold.current = false;
        setIsShaking(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    });

    return () => {
      unsubscribe();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [y, refreshColor]);

  const handleDragEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPastThreshold.current = false;
    setIsShaking(false);

    animate(y, 0, {
      type: "spring",
      stiffness: 400,
      damping: 25,
    });
  };

  const pantone = getNearestPantone(colorHex);

  return (
    <div className={styles.container}>
      <motion.div
        key={isPastThreshold.current ? "hint-refresh" : "hint-swipe"}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        className={styles.hint}
      >
        {isPastThreshold.current ? "Release" : "Swipe Down"}
      </motion.div>
      <motion.div
        className={styles.card}
        style={{ x, y, scale, cursor: "grab" }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
        animate={{
          filter: isShaking ? "blur(8px)" : "blur(0px)",
        }}
      >
        <motion.div
          className={styles.swatch}
          animate={{
            background: chroma(pantone.hex).hex(),
          }}
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <div className={styles.info}>
          <span className={styles.title}>PANTONE®</span>
          <span className={styles.tcx}>{pantone.tcx} TCX</span>
          <span className={styles.name}>{pantone.name}</span>
        </div>
      </motion.div>
    </div>
  );
}
