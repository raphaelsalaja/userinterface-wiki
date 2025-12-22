"use client";

import { Field } from "@base-ui/react/field";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useRef, useState } from "react";
import useMeasure from "react-use-measure";
import styles from "./styles.module.css";

const SUCCESS_DURATION = 2000;
const ERROR_DURATION = 1000;
const HINT_DELAY = 1000;

export function Exaggeration() {
  const [state, setState] = useState<"default" | "success" | "error">(
    "default",
  );
  const [value, setValue] = useState("");
  const [hint, setHint] = useState(false);
  const [inputRef, animate] = useAnimate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [ref, bounds] = useMeasure();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (state === "success") return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const isCorrect = value.toLowerCase().trim() === "pear";

    setState(isCorrect ? "success" : "error");
    setHint(false);

    animate(
      inputRef.current,
      isCorrect ? {} : { x: [-24, 24, -24, 24, 0] },
      isCorrect
        ? { type: "spring", stiffness: 110, damping: 2, mass: 0.1 }
        : { duration: 0.3 },
    );

    if (!isCorrect) {
      setTimeout(() => setHint(true), HINT_DELAY);
    }

    timeoutRef.current = setTimeout(
      () => {
        setState("default");
        if (isCorrect) setValue("");
      },
      isCorrect ? SUCCESS_DURATION : ERROR_DURATION,
    );
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={false}
        animate={{
          height: bounds.height > 0 ? bounds.height : "auto",
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 1, 0.5, 1],
        }}
      >
        <div ref={ref} className={styles.container}>
          <Field.Root
            render={<form onSubmit={handleSubmit} className={styles.form} />}
          >
            <Field.Control
              ref={inputRef}
              render={<motion.input />}
              className={styles.input}
              data-state={state}
              placeholder="Favourite Fruit..."
              maxLength={24}
              value={value}
              onChange={(e) => state !== "success" && setValue(e.target.value)}
              readOnly={state === "success"}
            />
          </Field.Root>
          <AnimatePresence mode="popLayout">
            {hint && (
              <motion.p
                initial={{
                  opacity: 0,
                  filter: "blur(4px)",
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(4px)",
                }}
                transition={{
                  ease: [0.19, 1, 0.22, 1],
                  duration: 0.4,
                }}
                className={styles.hint}
              >
                Try Pear.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
