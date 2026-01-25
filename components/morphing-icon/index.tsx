"use client";

import clsx from "clsx";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import styles from "./styles.module.css";

// ============================================================================
// Types
// ============================================================================

interface IconLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
}

interface IconDefinition {
  lines: [IconLine, IconLine, IconLine];
  rotation?: number;
  group?: string;
}

type IconName =
  | "menu"
  | "cross"
  | "plus"
  | "minus"
  | "equals"
  | "asterisk"
  | "more"
  | "check"
  | "play"
  | "pause"
  | "download"
  | "upload"
  | "external"
  | "arrow-right"
  | "arrow-down"
  | "arrow-left"
  | "arrow-up"
  | "chevron-right"
  | "chevron-down"
  | "chevron-left"
  | "chevron-up";

type SpringPreset = "snappy" | "smooth" | "bouncy";

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

// ============================================================================
// Constants
// ============================================================================

const CENTER = 7;
const VIEWBOX_SIZE = 14;

// Collapsed line (invisible point at center)
const collapsed: IconLine = {
  x1: CENTER,
  y1: CENTER,
  x2: CENTER,
  y2: CENTER,
  opacity: 0,
};

// Spring presets for different animation feels
const springPresets: Record<SpringPreset, SpringConfig> = {
  snappy: { stiffness: 400, damping: 30, mass: 0.8 },
  smooth: { stiffness: 200, damping: 20, mass: 1 },
  bouncy: { stiffness: 300, damping: 15, mass: 1 },
};

// Instant transition for reduced motion
const instantTransition = { duration: 0 };

// ============================================================================
// Icon Definitions
// ============================================================================

const icons: Record<IconName, IconDefinition> = {
  // Basic icons
  menu: {
    lines: [
      { x1: 2, y1: 3.5, x2: 12, y2: 3.5 },
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      { x1: 2, y1: 10.5, x2: 12, y2: 10.5 },
    ],
  },
  cross: {
    lines: [
      { x1: 3, y1: 3, x2: 11, y2: 11 },
      { x1: 11, y1: 3, x2: 3, y2: 11 },
      collapsed,
    ],
    rotation: 0,
    group: "plus-cross",
  },
  plus: {
    lines: [
      { x1: 7, y1: 2, x2: 7, y2: 12 },
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      collapsed,
    ],
    rotation: 0,
    group: "plus-cross",
  },
  minus: {
    lines: [
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      collapsed,
      collapsed,
    ],
  },
  equals: {
    lines: [
      { x1: 2, y1: 5, x2: 12, y2: 5 },
      { x1: 2, y1: 9, x2: 12, y2: 9 },
      collapsed,
    ],
  },
  asterisk: {
    lines: [
      { x1: 7, y1: 2, x2: 7, y2: 12 },
      { x1: 2.67, y1: 4.5, x2: 11.33, y2: 9.5 },
      { x1: 11.33, y1: 4.5, x2: 2.67, y2: 9.5 },
    ],
  },
  more: {
    lines: [
      { x1: 3, y1: 7, x2: 3, y2: 7 },
      { x1: 7, y1: 7, x2: 7, y2: 7 },
      { x1: 11, y1: 7, x2: 11, y2: 7 },
    ],
  },
  check: {
    lines: [
      { x1: 2, y1: 7.5, x2: 5.5, y2: 11 },
      { x1: 5.5, y1: 11, x2: 12, y2: 3 },
      collapsed,
    ],
  },

  // Media icons
  play: {
    lines: [
      { x1: 4, y1: 2.5, x2: 4, y2: 11.5 },
      { x1: 4, y1: 2.5, x2: 11.5, y2: 7 },
      { x1: 4, y1: 11.5, x2: 11.5, y2: 7 },
    ],
  },
  pause: {
    lines: [
      { x1: 4, y1: 2.5, x2: 4, y2: 11.5 },
      { x1: 10, y1: 2.5, x2: 10, y2: 11.5 },
      collapsed,
    ],
  },

  // Transfer icons
  download: {
    lines: [
      { x1: 7, y1: 2, x2: 7, y2: 10 },
      { x1: 3.5, y1: 6.5, x2: 7, y2: 10 },
      { x1: 10.5, y1: 6.5, x2: 7, y2: 10 },
    ],
  },
  upload: {
    lines: [
      { x1: 7, y1: 12, x2: 7, y2: 4 },
      { x1: 3.5, y1: 7.5, x2: 7, y2: 4 },
      { x1: 10.5, y1: 7.5, x2: 7, y2: 4 },
    ],
  },
  external: {
    lines: [
      { x1: 3, y1: 11, x2: 11, y2: 3 },
      { x1: 5, y1: 3, x2: 11, y2: 3 },
      { x1: 11, y1: 3, x2: 11, y2: 9 },
    ],
  },

  // Arrows (rotation group)
  "arrow-right": {
    lines: [
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      { x1: 7.5, y1: 2.5, x2: 12, y2: 7 },
      { x1: 7.5, y1: 11.5, x2: 12, y2: 7 },
    ],
    rotation: 0,
    group: "arrow",
  },
  "arrow-down": {
    lines: [
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      { x1: 7.5, y1: 2.5, x2: 12, y2: 7 },
      { x1: 7.5, y1: 11.5, x2: 12, y2: 7 },
    ],
    rotation: 90,
    group: "arrow",
  },
  "arrow-left": {
    lines: [
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      { x1: 7.5, y1: 2.5, x2: 12, y2: 7 },
      { x1: 7.5, y1: 11.5, x2: 12, y2: 7 },
    ],
    rotation: 180,
    group: "arrow",
  },
  "arrow-up": {
    lines: [
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      { x1: 7.5, y1: 2.5, x2: 12, y2: 7 },
      { x1: 7.5, y1: 11.5, x2: 12, y2: 7 },
    ],
    rotation: -90,
    group: "arrow",
  },

  // Chevrons (rotation group)
  "chevron-right": {
    lines: [
      { x1: 5, y1: 2.5, x2: 9.5, y2: 7 },
      { x1: 5, y1: 11.5, x2: 9.5, y2: 7 },
      collapsed,
    ],
    rotation: 0,
    group: "chevron",
  },
  "chevron-down": {
    lines: [
      { x1: 5, y1: 2.5, x2: 9.5, y2: 7 },
      { x1: 5, y1: 11.5, x2: 9.5, y2: 7 },
      collapsed,
    ],
    rotation: 90,
    group: "chevron",
  },
  "chevron-left": {
    lines: [
      { x1: 5, y1: 2.5, x2: 9.5, y2: 7 },
      { x1: 5, y1: 11.5, x2: 9.5, y2: 7 },
      collapsed,
    ],
    rotation: 180,
    group: "chevron",
  },
  "chevron-up": {
    lines: [
      { x1: 5, y1: 2.5, x2: 9.5, y2: 7 },
      { x1: 5, y1: 11.5, x2: 9.5, y2: 7 },
      collapsed,
    ],
    rotation: -90,
    group: "chevron",
  },
};

// ============================================================================
// Animated Line Component
// ============================================================================

interface AnimatedLineProps {
  line: IconLine;
  springConfig: SpringConfig;
  reducedMotion: boolean;
}

function AnimatedLine({ line, springConfig, reducedMotion }: AnimatedLineProps) {
  const transition = reducedMotion ? instantTransition : springConfig;

  return (
    <motion.line
      animate={{
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
        opacity: line.opacity ?? 1,
      }}
      transition={transition}
      strokeLinecap="round"
    />
  );
}

// ============================================================================
// Main Component
// ============================================================================

interface MorphingIconProps {
  /** The icon to display */
  icon: IconName;
  /** Size in pixels (default: 14) */
  size?: number;
  /** Additional CSS class */
  className?: string;
  /** Stroke width (default: 1.5) */
  strokeWidth?: number;
  /** Animation feel preset (default: "smooth") */
  spring?: SpringPreset;
  /** Custom spring configuration (overrides preset) */
  springConfig?: SpringConfig;
}

function MorphingIcon({
  icon,
  size = 14,
  className,
  strokeWidth = 1.5,
  spring = "smooth",
  springConfig: customSpringConfig,
}: MorphingIconProps) {
  const definition = icons[icon];
  const reducedMotion = useReducedMotion() ?? false;
  const prevDefinitionRef = useRef<IconDefinition>(definition);

  // Use custom config or preset
  const springConfig = customSpringConfig ?? springPresets[spring];

  // Track rotation for smooth transitions within rotation groups
  const rotation = useSpring(
    definition.rotation ?? 0,
    reducedMotion ? instantTransition : springConfig
  );

  // Determine if we should rotate or morph
  const shouldRotate = useMemo(() => {
    const prev = prevDefinitionRef.current;
    const curr = definition;

    // Same rotation group = rotate
    if (prev.group && curr.group && prev.group === curr.group) {
      return true;
    }

    return false;
  }, [definition]);

  useEffect(() => {
    if (shouldRotate) {
      // Animate rotation within the same group
      rotation.set(definition.rotation ?? 0);
    } else {
      // Reset rotation for cross-group morphs
      rotation.jump(definition.rotation ?? 0);
    }

    prevDefinitionRef.current = definition;
  }, [definition, shouldRotate, rotation]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={clsx(styles.icon, className)}
      aria-hidden="true"
    >
      <motion.g
        style={{
          rotate: rotation,
          transformOrigin: "center",
        }}
      >
        <AnimatedLine
          line={definition.lines[0]}
          springConfig={springConfig}
          reducedMotion={reducedMotion}
        />
        <AnimatedLine
          line={definition.lines[1]}
          springConfig={springConfig}
          reducedMotion={reducedMotion}
        />
        <AnimatedLine
          line={definition.lines[2]}
          springConfig={springConfig}
          reducedMotion={reducedMotion}
        />
      </motion.g>
    </svg>
  );
}

// ============================================================================
// Exports
// ============================================================================

export { MorphingIcon, springPresets };
export type { IconName, MorphingIconProps, SpringPreset, SpringConfig };

// Export icon names for convenience
export const iconNames: IconName[] = [
  "menu",
  "cross",
  "plus",
  "minus",
  "equals",
  "asterisk",
  "more",
  "check",
  "play",
  "pause",
  "download",
  "upload",
  "external",
  "arrow-right",
  "arrow-down",
  "arrow-left",
  "arrow-up",
  "chevron-right",
  "chevron-down",
  "chevron-left",
  "chevron-up",
];
