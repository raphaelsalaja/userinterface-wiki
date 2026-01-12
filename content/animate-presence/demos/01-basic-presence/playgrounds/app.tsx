import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

export default function App() {
  const [show, setShow] = useState(true);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="box"
            className={styles.box}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </AnimatePresence>
      <button type="button" className={styles.button} onClick={() => setShow(!show)}>
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
