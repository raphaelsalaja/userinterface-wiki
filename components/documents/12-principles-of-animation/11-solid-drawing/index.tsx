"use client";

import { motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

const EASING = {
  inOutCubic: [0.645, 0.045, 0.355, 1] as const,
  outExpo: [0.19, 1, 0.22, 1] as const,
};

const ORBIT_DURATION = 2.5;
const RING_DURATION = 2;

export function SolidDrawing() {
  const [isPlaying, setIsPlaying] = useState(true);

  const paused = !isPlaying;

  function toggle() {
    setIsPlaying((prev) => !prev);
  }

  return (
    <div className={styles["solid-drawing"]}>
      <div className={styles["globe-scene"]}>
        <motion.svg viewBox="0 0 128 128" className={styles["globe-svg"]}>
          <title>Globe</title>
          <circle cx="64" cy="64" r="36" fill="var(--surface)" />
          <motion.circle
            cx="64"
            cy="64"
            r="26"
            fill="var(--surface)"
            stroke="var(--accent-muted)"
            strokeWidth="6"
            initial={{
              strokeDasharray: "2 4.09",
            }}
            animate={{
              rotate: isPlaying ? [0, 360] : 0,
              strokeDasharray: paused ? "2 0" : "2 4.09",
            }}
            transition={{
              rotate: {
                repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                ease: "linear",
                duration: RING_DURATION,
              },
              strokeDasharray: {
                duration: 0.7,
                ease: EASING.inOutCubic,
              },
            }}
          />
          <motion.circle
            cx="64"
            cy="64"
            r="16"
            fill={paused ? "var(--complete)" : "var(--surface)"}
            initial={{ scale: 0 }}
            animate={{ scale: paused ? 1 : 0 }}
            transition={{
              duration: 0.4,
              ease: EASING.inOutCubic,
            }}
          />
        </motion.svg>

        <motion.div
          className={styles["orbit-marker"]}
          data-paused={paused}
          initial={{
            transform:
              "translate(-50%, -50%) rotateY(20deg) translateZ(48px) rotateY(340deg)",
          }}
          animate={
            paused
              ? {
                  transform:
                    "translate(-50%, -50%) rotateY(20deg) translateZ(48px) rotateY(340deg)",
                }
              : {
                  transform: [
                    "translate(-50%, -50%) rotateY(360deg) translateZ(48px) rotateY(0deg)",
                    "translate(-50%, -50%) rotateY(0deg) translateZ(48px) rotateY(360deg)",
                  ],
                }
          }
          transition={
            paused
              ? {
                  ease: EASING.outExpo,
                  duration: 3,
                }
              : {
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  duration: ORBIT_DURATION,
                }
          }
        >
          <div className={styles["orbit-layer-back"]} />
          <div className={styles["orbit-layer-middle"]} />
          <motion.div
            className={styles["orbit-layer-front"]}
            animate={{
              width: paused ? 0 : 8,
              height: paused ? 0 : 8,
            }}
            transition={{
              duration: 0.4,
              ease: EASING.inOutCubic,
            }}
          />
        </motion.div>
      </div>

      <button
        onClick={toggle}
        className={styles["toggle-button"]}
        type="button"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
