"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/button";
import { Controls } from "@/components/controls";
import styles from "./styles.module.css";

const slides = [
  {
    id: 1,
    color: "var(--gray-9)",
    content: {
      author: "Steve Jobs",
      quote:
        "Let's go invent tomorrow instead of worrying about what happened yesterday.",
    },
  },
  {
    id: 2,
    color: "var(--orange-9)",
    content: {
      author: "Norman McLaren",
      quote:
        "Animation is not the art of drawings that move but the art of movements that are drawn.",
    },
  },
  {
    id: 3,
    color: "var(--yellow-9)",
    content: {
      author: "Rakim Mayers",
      quote:
        "How you gonna knock somebody for trying? Since when has it not been cool to try?",
    },
  },
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
      filter: "blur(10px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
      filter: "blur(10px)",
    }),
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slides[index].id}
            className={styles.slide}
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
            <span className={styles.quote}>{slides[index].content.quote}</span>
            <span className={styles.author}>
              {slides[index].content.author}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <Controls>
        <Button onClick={() => paginate(-1)}>Back</Button>
        <Button onClick={() => paginate(1)}>Next</Button>
      </Controls>
    </div>
  );
}
