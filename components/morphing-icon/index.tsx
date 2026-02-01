"use client";

import clsx from "clsx";
import {
  motion,
  type Transition,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import styles from "./styles.module.css";

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
  | "chevron-up"
  | "grip"
  | "slash"
  | "corner";

const CENTER = 7;

const VIEWBOX_SIZE = 14;

const collapsed: IconLine = {
  x1: CENTER,
  y1: CENTER,
  x2: CENTER,
  y2: CENTER,
  opacity: 0,
};

const defaultTransition: Transition = {
  ease: [0.19, 1, 0.22, 1],
  duration: 0.4,
};

const arrowLines: [IconLine, IconLine, IconLine] = [
  { x1: 2, y1: 7, x2: 12, y2: 7 },
  { x1: 7.5, y1: 2.5, x2: 12, y2: 7 },
  { x1: 7.5, y1: 11.5, x2: 12, y2: 7 },
];

const chevronLines: [IconLine, IconLine, IconLine] = [
  { x1: 5, y1: 2.5, x2: 9.5, y2: 7 },
  { x1: 5, y1: 11.5, x2: 9.5, y2: 7 },
  collapsed,
];

const plusLines: [IconLine, IconLine, IconLine] = [
  { x1: 7, y1: 2, x2: 7, y2: 12 },
  { x1: 2, y1: 7, x2: 12, y2: 7 },
  collapsed,
];

const icons: Record<IconName, IconDefinition> = {
  menu: {
    lines: [
      { x1: 2, y1: 3.5, x2: 12, y2: 3.5 },
      { x1: 2, y1: 7, x2: 12, y2: 7 },
      { x1: 2, y1: 10.5, x2: 12, y2: 10.5 },
    ],
  },
  cross: { lines: plusLines, rotation: 45, group: "plus-cross" },
  plus: { lines: plusLines, rotation: 0, group: "plus-cross" },
  minus: {
    lines: [{ x1: 2, y1: 7, x2: 12, y2: 7 }, collapsed, collapsed],
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
  "arrow-right": { lines: arrowLines, rotation: 0, group: "arrow" },
  "arrow-down": { lines: arrowLines, rotation: 90, group: "arrow" },
  "arrow-left": { lines: arrowLines, rotation: 180, group: "arrow" },
  "arrow-up": { lines: arrowLines, rotation: -90, group: "arrow" },
  "chevron-right": { lines: chevronLines, rotation: 0, group: "chevron" },
  "chevron-down": { lines: chevronLines, rotation: 90, group: "chevron" },
  "chevron-left": { lines: chevronLines, rotation: 180, group: "chevron" },
  "chevron-up": { lines: chevronLines, rotation: -90, group: "chevron" },
  grip: {
    lines: [
      { x1: 7, y1: 3, x2: 7, y2: 3 },
      { x1: 7, y1: 7, x2: 7, y2: 7 },
      { x1: 7, y1: 11, x2: 7, y2: 11 },
    ],
  },
  slash: {
    lines: [{ x1: 11, y1: 3, x2: 3, y2: 11 }, collapsed, collapsed],
  },
  corner: {
    lines: [
      { x1: 4, y1: 3, x2: 4, y2: 11 },
      { x1: 4, y1: 11, x2: 11, y2: 11 },
      collapsed,
    ],
  },
};

interface AnimatedLineProps {
  line: IconLine;
  transition: Transition;
}

function AnimatedLine({ line, transition }: AnimatedLineProps) {
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

interface MorphingIconProps {
  icon: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
  transition?: Transition;
}

function MorphingIcon({
  icon,
  size = 14,
  className,
  strokeWidth = 1.5,
  transition = defaultTransition,
}: MorphingIconProps) {
  const definition = icons[icon];
  const reducedMotion = useReducedMotion() ?? false;
  const prevDefinitionRef = useRef<IconDefinition>(definition);
  const activeTransition = reducedMotion ? { duration: 0 } : transition;

  const rotation = useSpring(definition.rotation ?? 0, activeTransition);

  const shouldRotate = useMemo(() => {
    const prev = prevDefinitionRef.current;
    return prev.group && definition.group && prev.group === definition.group;
  }, [definition]);

  useEffect(() => {
    if (shouldRotate) {
      rotation.set(definition.rotation ?? 0);
    } else {
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
      strokeLinejoin="round"
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
          transition={activeTransition}
        />
        <AnimatedLine
          line={definition.lines[1]}
          transition={activeTransition}
        />
        <AnimatedLine
          line={definition.lines[2]}
          transition={activeTransition}
        />
      </motion.g>
    </svg>
  );
}

export { MorphingIcon };
export type { IconName, MorphingIconProps };

export const iconNames = Object.keys(icons) as IconName[];
