"use client";

import { motion, type Transition } from "motion/react";
import { useState } from "react";
import { Button, Controls } from "@/components/button";
import styles from "./styles.module.css";

type Animation = {
  label: string;
  transition: Transition;
};

const ease: Animation = {
  label: "Easing",
  transition: {
    duration: 0.5,
    ease: [0.19, 1, 0.22, 1],
  },
};

const spring: Animation = {
  label: "Spring",
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 15,
    mass: 1,
  },
};

const animations = [ease, spring];

type BoxProps = {
  label: string;
  isExpanded: boolean;
  transition: Transition;
};

function Box({ label, isExpanded, transition }: BoxProps) {
  return (
    <div className={styles.box}>
      <div className={styles.scale}>
        <div className={styles.marker} />
        <motion.div
          className={styles.ball}
          animate={{
            width: isExpanded ? 128 : 32,
            height: isExpanded ? 128 : 32,
          }}
          transition={transition}
        />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function EaseVsSpring() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.visualization}>
        {animations.map(({ label, transition }) => (
          <Box
            key={label}
            label={label}
            isExpanded={isExpanded}
            transition={transition}
          />
        ))}
      </div>

      <Controls>
        <Button onClick={() => setIsExpanded((prev) => !prev)}>Animate</Button>
      </Controls>
    </div>
  );
}
