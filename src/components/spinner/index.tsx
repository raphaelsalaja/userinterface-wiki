import { motion } from "motion/react";

import styles from "./styles.module.css";

export function Spinner({ size = 18 }: { size?: number }) {
  return (
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
}
