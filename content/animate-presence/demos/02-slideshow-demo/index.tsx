"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

const slides = [
  { id: 1, color: "var(--gray-12)" },
  { id: 2, color: "var(--gray-10)" },
  { id: 3, color: "var(--gray-8)" },
];

export function SlideshowDemo() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = slides.length - 1;
      if (next >= slides.length) next = 0;
      return next;
    });
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slides[index].id}
            className={styles.slide}
            style={{ background: slides[index].color }}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          >
            {index + 1}
          </motion.div>
        </AnimatePresence>
      </div>
      <Controls>
        <Button onClick={() => paginate(-1)}>Previous</Button>
        <Button onClick={() => paginate(1)}>Next</Button>
      </Controls>
    </div>
  );
}
