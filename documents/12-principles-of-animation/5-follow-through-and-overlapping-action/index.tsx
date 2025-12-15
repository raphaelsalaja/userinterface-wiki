"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Browser } from "./browser";
import styles from "./styles.module.css";

const MAGNET_RADIUS = 150;
const PULL_STRENGTH = 0.15;

const PANES = [
  { id: "left", side: "left", hiddenX: -100 },
  { id: "right", side: "right", hiddenX: 100 },
] as const;

function useMagnet(
  dragX: MotionValue<number>,
  dragY: MotionValue<number>,
  targetRef: React.RefObject<{ x: number; y: number } | null>,
) {
  const attraction = useTransform([dragX, dragY], ([x, y]) => {
    if (!targetRef.current) return 0;
    const distance = Math.hypot(
      (x as number) - targetRef.current.x,
      (y as number) - targetRef.current.y,
    );
    return Math.max(0, 1 - distance / MAGNET_RADIUS);
  });

  const isActive = useTransform(attraction, (a) => a > 0.3);

  const offsetX = useTransform([dragX, attraction], ([x, a]) => {
    if (!targetRef.current) return 0;
    return (
      ((x as number) - targetRef.current.x) * (a as number) * PULL_STRENGTH
    );
  });

  const offsetY = useTransform([dragY, attraction], ([y, a]) => {
    if (!targetRef.current) return 0;
    return (
      ((y as number) - targetRef.current.y) * (a as number) * PULL_STRENGTH
    );
  });

  const scale = useTransform(attraction, (a) => 1 + a * 0.15);

  const background = useTransform(isActive, (active) =>
    active ? "var(--sky-a9)" : "transparent",
  );

  return {
    x: useSpring(offsetX, { damping: 30, stiffness: 400 }),
    y: useSpring(offsetY, { damping: 30, stiffness: 400 }),
    scale: useSpring(scale, { damping: 20, stiffness: 300 }),
    background,
  };
}

export function FollowThroughAndOverlappingAction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const leftCenter = useRef<{ x: number; y: number } | null>(null);
  const rightCenter = useRef<{ x: number; y: number } | null>(null);

  const left = useMagnet(dragX, dragY, leftCenter);
  const right = useMagnet(dragX, dragY, rightCenter);

  const magnets = { left, right } as const;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    for (const pane of PANES) {
      const el = container.querySelector(`[data-id="${pane.id}"]`);
      if (!el) continue;
      const paneRect = el.getBoundingClientRect();
      const center = {
        x: paneRect.left + paneRect.width / 2 - rect.left - rect.width / 2,
        y: paneRect.top + paneRect.height / 2 - rect.top - rect.height / 2,
      };
      if (pane.id === "left") leftCenter.current = center;
      if (pane.id === "right") rightCenter.current = center;
    }
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {PANES.map(({ id, side, hiddenX }) => {
        const magnet = magnets[id];
        return (
          <motion.div
            key={id}
            data-id={id}
            className={styles.pane}
            style={{
              [side]: 16,
              top: "50%",
              x: magnet.x,
              y: magnet.y,
              scale: magnet.scale,
              backgroundColor: magnet.background,
              translateY: "-50%",
            }}
            animate={{
              opacity: isDragging ? 1 : 0,
              x: isDragging ? 0 : hiddenX,
              filter: isDragging ? "blur(0px)" : "blur(4px)",
            }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          />
        );
      })}

      <Browser
        drag
        dragSnapToOrigin
        whileDrag={{ scale: 0.95, opacity: 0.8 }}
        style={{
          x: dragX,
          y: dragY,
          left: "50%",
          top: "50%",
          translate: "-50% -50%",
        }}
        onHoverStart={() => setIsDragging(true)}
        onHoverEnd={() => setIsDragging(false)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    </div>
  );
}
