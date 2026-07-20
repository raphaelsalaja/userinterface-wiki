"use client";

import { type HTMLMotionProps, MotionConfig, motion } from "motion/react";
import { useState } from "react";
import useMeasure from "react-use-measure";
import styles from "./styles.module.css";

enum State {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
}

export function SecondaryAction() {
  const [state, setState] = useState(State.Idle);
  const [ref, bounds] = useMeasure();

  const nextStateMap: Record<State, State> = {
    [State.Idle]: State.Loading,
    [State.Loading]: State.Success,
    [State.Success]: State.Idle,
  };

  function handleClick() {
    setState((prev) => nextStateMap[prev]);
  }

  const show = (conditional: boolean): HTMLMotionProps<"span"> => ({
    className: styles.label,
    initial: false,
    animate: {
      opacity: conditional ? 1 : 0,
      width: conditional ? "auto" : 0,
    },
    style: {
      display: "inline-flex",
      justifyContent: "flex-start",
    },
  });

  const isLoading = state === State.Loading;
  const isSuccess = state === State.Success;
  const isIdle = state === State.Idle;

  return (
    <div className={styles.container}>
      <MotionConfig
        transition={{
          duration: 0.4,
          ease: [0.25, 1, 0.5, 1],
          width: {
            duration: 0.2,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.01,
          },
        }}
      >
        <motion.button
          animate={{
            width: bounds.width > 10 ? bounds.width : "auto",
          }}
          onClick={handleClick}
          data-state={state.toLowerCase()}
          className={styles.button}
        >
          <div ref={ref} className={styles.wrapper}>
            <motion.div
              key="success"
              initial={false}
              animate={{
                opacity: isSuccess ? 1 : 0,
                width: isSuccess ? 40 : 0,
                scale: isSuccess ? 1 : 0,
              }}
              className={styles.icon}
            >
              <Check />
            </motion.div>
            <motion.div
              key="loading"
              initial={false}
              animate={{
                opacity: isLoading ? 1 : 0,
                width: isLoading ? 40 : 0,
                scale: isLoading ? 1 : 0,
              }}
              className={styles.icon}
            >
              <Spinner />
            </motion.div>
            <motion.span {...show(true)}>Back</motion.span>
            <motion.span {...show(isLoading)}>ing</motion.span>
            <motion.span {...show(isSuccess)}>ed</motion.span>
            <motion.span {...show(true)}>&nbsp;Up</motion.span>
            <motion.span {...show(isSuccess)}>!</motion.span>
            <motion.span {...show(isIdle)}>
              {!isSuccess && <>&nbsp;</>}
              Now
            </motion.span>
          </div>
        </motion.button>
      </MotionConfig>
    </div>
  );
}

const Check = ({ size = 32 }) => (
  <motion.div className={styles.check}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
    >
      <title>Check</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.774 10.1333C16.1237 9.70582 16.0607 9.0758 15.6332 8.72607C15.2058 8.37635 14.5758 8.43935 14.226 8.86679L10.4258 13.5116L9.20711 12.2929C8.81658 11.9024 8.18342 11.9024 7.79289 12.2929C7.40237 12.6834 7.40237 13.3166 7.79289 13.7071L9.79289 15.7071C9.99267 15.9069 10.2676 16.0129 10.5498 15.9988C10.832 15.9847 11.095 15.8519 11.274 15.6333L15.774 10.1333Z"
        fill="currentColor"
      />
    </svg>
  </motion.div>
);

const Spinner = ({ size = 32 }) => (
  <motion.div
    initial={{ rotate: 180 }}
    animate={{ rotate: 0 }}
    exit={{
      position: "absolute",
      rotate: -180,
      transition: {
        duration: 0.4,
        ease: [0.175, 0.885, 0.32, 0.98],
      },
    }}
    transition={{
      duration: 0.4,
      ease: [0.175, 0.885, 0.32, 0.98],
      delay: 0.4,
    }}
    className={styles.spinner}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.svg}
    >
      <title>Loading Spinner</title>
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="2.5"
      />
      <path
        d="M16 9C16 5.13401 12.866 2 9 2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </motion.div>
);
