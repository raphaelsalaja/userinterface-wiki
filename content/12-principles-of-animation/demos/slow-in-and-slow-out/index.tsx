"use client";

import { type EasingDefinition, motion } from "motion/react";
import styles from "./styles.module.css";

interface VisualizationProps {
  ease: EasingDefinition;
  name: string;
}

interface EaseFunction {
  name: string;
  ease: EasingDefinition;
}

const EASING_FUNCTIONS: EaseFunction[] = [
  { name: "easeInSine", ease: [0.12, 0, 0.39, 0] },
  { name: "easeOutSine", ease: [0.61, 1, 0.88, 1] },
  { name: "easeInOutSine", ease: [0.37, 0, 0.63, 1] },
  { name: "easeInQuad", ease: [0.55, 0.085, 0.68, 0.53] },
  { name: "easeOutQuad", ease: [0.25, 0.46, 0.45, 0.94] },
  { name: "easeInOutQuad", ease: [0.455, 0.03, 0.515, 0.955] },
  { name: "easeInCubic", ease: [0.55, 0.055, 0.675, 0.19] },
  { name: "easeOutCubic", ease: [0.215, 0.61, 0.355, 1] },
  { name: "easeInOutCubic", ease: [0.645, 0.045, 0.355, 1] },
];

const Visualization = ({ ease, name }: VisualizationProps) => {
  const createPath = (easeArray: number[]) => {
    const [x1, y1, x2, y2] = easeArray;
    const padding = 20;
    const scale = 60;
    return `M ${padding} ${100 - padding} C ${x1 * scale + padding} ${100 - padding - y1 * scale} ${x2 * scale + padding} ${100 - padding - y2 * scale} ${scale + padding} ${padding}`;
  };

  const isArrayEase = Array.isArray(ease);
  const pathData = isArrayEase ? createPath(ease as number[]) : "";

  return (
    <div className={styles.visualization}>
      <div className={styles.graphContainer}>
        <div className={styles.curveContainer}>
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            className={styles.curveSvg}
          >
            <title>Easing Curve Visualization</title>
            <defs>
              <pattern
                id={`grid-${name}`}
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="var(--gray-4)"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#grid-${name})`} />

            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              fill="none"
              stroke="var(--gray-4)"
              strokeWidth="1"
            />

            {isArrayEase && (
              <path
                d={pathData}
                fill="none"
                stroke="var(--gray-12)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            <path
              d="M 20 80 L 80 20"
              fill="none"
              stroke="var(--pink-9)"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className={styles.ballTrack}>
          <motion.div
            className={styles.ball}
            animate={{
              y: [60, 10, 60],
            }}
            transition={{
              duration: 2,
              ease: ease,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </div>
      </div>

      <span className={styles.easeName}>{name}</span>
    </div>
  );
};

export function SlowInSlowOut() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {EASING_FUNCTIONS.map((easeFunction) => (
          <Visualization
            key={easeFunction.name}
            ease={easeFunction.ease}
            name={easeFunction.name}
          />
        ))}
      </div>
    </div>
  );
}
