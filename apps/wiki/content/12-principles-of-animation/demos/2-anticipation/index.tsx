"use client";

import {
  AnimatePresence,
  animate,
  type HTMLMotionProps,
  MotionConfig,
  motion,
  useIsPresent,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { useCallback, useRef, useState } from "react";
import { BellIcon, BookmarkIcon, PinIcon, StarIcon } from "@/icons";
import styles from "./styles.module.css";

const REFRESH_THRESHOLD = 64;

interface Card {
  id: string;
  icon: React.ReactNode;
  width: number;
  color: string;
}

const data = [
  {
    id: "bookmark",
    icon: <BookmarkIcon className={styles.icon} />,
    width: 200,
    color: "var(--green-9)",
  },

  {
    id: "bell",
    icon: <BellIcon className={styles.icon} />,
    width: 290,
    color: "var(--blue-9)",
  },
  {
    id: "pin",
    icon: <PinIcon className={styles.icon} />,
    width: 180,
    color: "var(--purple-9)",
  },
  {
    id: "star",
    icon: <StarIcon className={styles.icon} />,
    width: 260,
    color: "var(--red-9)",
  },
];

function Card({ icon, width, color }: Card) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      layout
      className={styles.card}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 900, damping: 40 }}
      style={{ position: isPresent ? "static" : "absolute", color }}
    >
      <div className={styles.background}>{icon}</div>
      <span className={styles.skeleton} style={{ width }} />
    </motion.div>
  );
}

type RefreshState = "idle" | "pulling" | "refreshing" | "resetting";

export function Anticipation() {
  const [cards, setCards] = useState(() => [...data]);
  const [state, setState] = useState<RefreshState>("idle");
  const isPastThreshold = useRef(false);

  const y = useMotionValue(0);
  const contentScale = useTransform(y, [0, REFRESH_THRESHOLD], [1, 0.98]);

  const refresh = useCallback(() => {
    setState("refreshing");
    setTimeout(() => {
      setCards((cards) => [...cards].sort(() => Math.random() - 0.5));
      setState("resetting");
      setTimeout(() => {
        setState("idle");
      }, 300);
    }, 1200);
  }, []);

  useMotionValueEvent(y, "change", (latest) => {
    const pastThreshold = latest >= REFRESH_THRESHOLD;
    if (pastThreshold !== isPastThreshold.current) {
      isPastThreshold.current = pastThreshold;
      if (pastThreshold && state === "idle") {
        setState("pulling");
      }
    }
  });

  const handleDragEnd = () => {
    if (isPastThreshold.current && state === "pulling") {
      refresh();
    } else if (state === "pulling") {
      setState("idle");
    }
    animate(y, 0, {
      type: "spring",
      stiffness: 400,
      damping: 30,
    });
    isPastThreshold.current = false;
  };

  const isVisible = state !== "idle";
  const isRefreshing = state === "refreshing";
  const isResetting = state === "resetting";

  const show = (
    conditional: boolean,
    isSuffix = false,
  ): HTMLMotionProps<"span"> => ({
    className: isSuffix ? styles.suffix : styles.label,
    initial: false,
    animate: {
      opacity: conditional ? 1 : 0,
      ...(isSuffix && { width: conditional ? "auto" : 0 }),
    },
  });

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.refresh}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          opacity: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
        }}
      >
        <MotionConfig
          transition={{
            duration: 0.2,
            ease: [0.25, 1, 0.5, 1],
          }}
        >
          <motion.span {...show(true)}>Refresh</motion.span>
          <motion.span {...show(isRefreshing || isResetting, true)}>
            ing
          </motion.span>
        </MotionConfig>
      </motion.div>

      <motion.div
        className={styles.cards}
        style={{ y, scale: contentScale, cursor: "grab" }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: "grabbing" }}
        animate={{
          opacity: isRefreshing ? [0.8, 0.2, 0.8] : 1,
        }}
        transition={{
          opacity: {
            duration: 1,
            repeat: isRefreshing ? Infinity : 0,
          },
        }}
      >
        <AnimatePresence>
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
