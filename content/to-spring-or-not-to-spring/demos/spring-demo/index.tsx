"use client";

import { animate, motion, useMotionValue, useVelocity } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

const easeOutQuint = [0.23, 1, 0.32, 1] as const;

export function SpringDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xVelocity = useVelocity(x);
  const [useSpring, setUseSpring] = useState(true);

  const handleDragEnd = () => {
    if (!containerRef.current) return;

    const currentX = x.get();
    const currentY = y.get();
    const velocity = xVelocity.get();

    // Calculate positions of the two endpoints relative to center
    const leftX = -140;
    const rightX = 140;
    const endpointY = 0;

    // Factor in velocity - if flicking fast, go in that direction
    let targetX: number;
    if (Math.abs(velocity) > 500) {
      targetX = velocity > 0 ? rightX : leftX;
    } else {
      // Calculate distance to each endpoint
      const distToLeft = Math.sqrt(
        (currentX - leftX) ** 2 + (currentY - endpointY) ** 2,
      );
      const distToRight = Math.sqrt(
        (currentX - rightX) ** 2 + (currentY - endpointY) ** 2,
      );
      targetX = distToLeft < distToRight ? leftX : rightX;
    }

    const transition = useSpring
      ? { type: "spring" as const, stiffness: 300, damping: 20, velocity }
      : { duration: 0.4, ease: easeOutQuint };

    animate(x, targetX, transition);
    animate(y, 0, transition);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.track}>
          <div className={styles.endpoint} data-position="left" />
          <div className={styles.endpoint} data-position="right" />
        </div>
        <motion.div
          className={styles.ball}
          style={{ x, y }}
          drag
          dragElastic={0.5}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        />
      </div>
      <Controls className={styles.controls}>
        <Button onClick={() => setUseSpring(!useSpring)}>
          {useSpring ? "Spring" : "Ease"}
        </Button>
      </Controls>
    </div>
  );
}
