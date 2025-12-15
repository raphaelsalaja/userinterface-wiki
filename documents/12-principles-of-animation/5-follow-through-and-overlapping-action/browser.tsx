import { motion } from "motion/react";
import styles from "./styles.module.css";

export const Browser = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <motion.div className={styles.browser} {...props}>
      <div className={styles["tab-bar"]}>
        <div className={styles.buttons}>
          <div />
          <div />
          <div />
        </div>
        <div className={styles["tab-container"]}>
          <div className={styles.tab}>
            <Edge />
            <Edge />
          </div>
        </div>
      </div>
      <div className={styles.window} />
    </motion.div>
  );
};

const Edge = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    className={styles.edge}
  >
    <title>Tab Edge</title>
    <path d="M0 0V5.12H5.12C2.2923 5.12 0 2.8277 0 0Z" fill="currentColor" />
  </svg>
);
