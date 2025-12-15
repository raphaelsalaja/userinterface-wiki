"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { DiaBrowser } from "./dia-browser";
import styles from "./styles.module.css";

const CONFIG = {
  INITIAL_DISTANCE: 200,
  ACTIVE_DISTANCE: 150,
  INITIAL_PULL: 0.1,
  ACTIVE_PULL: 1.2,
  INITIAL_SCALE: 1.05,
  ACTIVE_SCALE: 1.2,
};

const PANES = {
  left: { side: "left", hiddenX: -100 },
  right: { side: "right", hiddenX: 100 },
} as const;

export function FollowThroughAndOverlappingAction() {
  const containerRef = useRef<HTMLDivElement>(null);
  const paneRefs = useRef<Record<string, HTMLDivElement | null>>({
    left: null,
    right: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [centers, setCenters] = useState<
    Record<string, { x: number; y: number }>
  >({});

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const springX = useSpring(dragX, { damping: 40, stiffness: 800 });
  const springY = useSpring(dragY, { damping: 40, stiffness: 800 });

  // Create transforms for left pane
  const leftDistance = useTransform([springX, springY], (values) => {
    const [x, y] = values as [number, number];
    if (!centers.left) return CONFIG.INITIAL_DISTANCE + 1;
    const containerEl = containerRef.current;
    if (!containerEl) return CONFIG.INITIAL_DISTANCE + 1;
    const container = containerEl.getBoundingClientRect();
    const cx = x + container.width / 2;
    const cy = y + container.height / 2;
    return Math.hypot(cx - centers.left.x, cy - centers.left.y);
  });

  const leftAttraction = useTransform(leftDistance, (d) => {
    if (d < CONFIG.ACTIVE_DISTANCE)
      return Math.min(1, (CONFIG.ACTIVE_DISTANCE - d) / CONFIG.ACTIVE_DISTANCE);
    if (d < CONFIG.INITIAL_DISTANCE)
      return Math.min(
        1,
        (CONFIG.INITIAL_DISTANCE - d) / CONFIG.INITIAL_DISTANCE,
      );
    return 0;
  });

  const leftIsActive = useTransform(
    leftDistance,
    (d) => d < CONFIG.ACTIVE_DISTANCE,
  );

  const leftPullFactor = useTransform(leftAttraction, (a) =>
    a > 0 && leftDistance.get() < CONFIG.ACTIVE_DISTANCE
      ? CONFIG.ACTIVE_PULL
      : CONFIG.INITIAL_PULL,
  );

  const leftScaleValue = useTransform(
    leftAttraction,
    (a) =>
      1 +
      a *
        (CONFIG.INITIAL_SCALE +
          (CONFIG.ACTIVE_SCALE - CONFIG.INITIAL_SCALE) * (a > 0 ? 1 : 0) -
          1),
  );

  const leftOffset = useTransform(
    [springX, springY, leftAttraction],
    (values) => {
      const [x, y, a] = values as [number, number, number];
      if (!centers.left) return { x: 0, y: 0 };
      const containerEl = containerRef.current;
      if (!containerEl) return { x: 0, y: 0 };
      const container = containerEl.getBoundingClientRect();
      const cx = x + container.width / 2;
      const cy = y + container.height / 2;
      const fx = (cx - centers.left.x) * a * leftPullFactor.get();
      const fy = (cy - centers.left.y) * a * leftPullFactor.get();
      return { x: fx, y: fy };
    },
  );

  const leftScale = useSpring(leftScaleValue, { damping: 20, stiffness: 300 });
  const leftX = useSpring(
    useTransform(leftOffset, (o) => (o as { x: number; y: number }).x),
    { damping: 40, stiffness: 800 },
  );
  const leftY = useSpring(
    useTransform(leftOffset, (o) => (o as { x: number; y: number }).y),
    { damping: 40, stiffness: 800 },
  );
  const leftBg = useTransform(leftIsActive, (on) =>
    on ? "rgba(0,150,255,0.2)" : "transparent",
  );

  // Create transforms for right pane
  const rightDistance = useTransform([springX, springY], (values) => {
    const [x, y] = values as [number, number];
    if (!centers.right) return CONFIG.INITIAL_DISTANCE + 1;
    const containerEl = containerRef.current;
    if (!containerEl) return CONFIG.INITIAL_DISTANCE + 1;
    const container = containerEl.getBoundingClientRect();
    const cx = x + container.width / 2;
    const cy = y + container.height / 2;
    return Math.hypot(cx - centers.right.x, cy - centers.right.y);
  });

  const rightAttraction = useTransform(rightDistance, (d) => {
    if (d < CONFIG.ACTIVE_DISTANCE)
      return Math.min(1, (CONFIG.ACTIVE_DISTANCE - d) / CONFIG.ACTIVE_DISTANCE);
    if (d < CONFIG.INITIAL_DISTANCE)
      return Math.min(
        1,
        (CONFIG.INITIAL_DISTANCE - d) / CONFIG.INITIAL_DISTANCE,
      );
    return 0;
  });

  const rightIsActive = useTransform(
    rightDistance,
    (d) => d < CONFIG.ACTIVE_DISTANCE,
  );

  const rightPullFactor = useTransform(rightAttraction, (a) =>
    a > 0 && rightDistance.get() < CONFIG.ACTIVE_DISTANCE
      ? CONFIG.ACTIVE_PULL
      : CONFIG.INITIAL_PULL,
  );

  const rightScaleValue = useTransform(
    rightAttraction,
    (a) =>
      1 +
      a *
        (CONFIG.INITIAL_SCALE +
          (CONFIG.ACTIVE_SCALE - CONFIG.INITIAL_SCALE) * (a > 0 ? 1 : 0) -
          1),
  );

  const rightOffset = useTransform(
    [springX, springY, rightAttraction],
    (values) => {
      const [x, y, a] = values as [number, number, number];
      if (!centers.right) return { x: 0, y: 0 };
      const containerEl = containerRef.current;
      if (!containerEl) return { x: 0, y: 0 };
      const container = containerEl.getBoundingClientRect();
      const cx = x + container.width / 2;
      const cy = y + container.height / 2;
      const fx = (cx - centers.right.x) * a * rightPullFactor.get();
      const fy = (cy - centers.right.y) * a * rightPullFactor.get();
      return { x: fx, y: fy };
    },
  );

  const rightScale = useSpring(rightScaleValue, {
    damping: 20,
    stiffness: 300,
  });
  const rightX = useSpring(
    useTransform(rightOffset, (o) => (o as { x: number; y: number }).x),
    { damping: 40, stiffness: 800 },
  );
  const rightY = useSpring(
    useTransform(rightOffset, (o) => (o as { x: number; y: number }).y),
    { damping: 40, stiffness: 800 },
  );
  const rightBg = useTransform(rightIsActive, (on) =>
    on ? "rgba(0,150,255,0.2)" : "transparent",
  );

  const transforms = {
    left: {
      scale: leftScale,
      x: leftX,
      y: leftY,
      bg: leftBg,
    },
    right: {
      scale: rightScale,
      x: rightX,
      y: rightY,
      bg: rightBg,
    },
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const crect = containerRef.current.getBoundingClientRect();
    const newCenters: typeof centers = {};
    for (const key of Object.keys(PANES) as Array<keyof typeof PANES>) {
      const el = paneRefs.current[key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      newCenters[key] = {
        x: r.left + r.width / 2 - crect.left,
        y: r.top + r.height / 2 - crect.top,
      };
    }
    setCenters(newCenters);
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {(Object.keys(PANES) as Array<keyof typeof PANES>).map((key) => {
        const { side, hiddenX } = PANES[key];
        const t = transforms[key];
        return (
          <motion.div
            key={key}
            ref={(el) => {
              paneRefs.current[key] = el;
            }}
            data-id={key}
            className={styles.pane}
            style={
              {
                "--magnet-bg": t.bg,
                [side]: "16px",
                top: "50%",
                translate: "0 -50%",
                scale: t.scale,
                x: t.x,
                y: t.y,
              } as unknown as React.CSSProperties
            }
            animate={{
              opacity: isDragging ? 1 : 0,
              x: isDragging ? 0 : hiddenX,
              scale: isDragging ? 1 : 0.8,
              filter: isDragging ? "none" : "blur(4px)",
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 19,
              mass: 1.2,
            }}
          />
        );
      })}

      <DiaBrowser
        drag
        whileDrag={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        dragSnapToOrigin
        style={{
          x: springX,
          y: springY,
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
