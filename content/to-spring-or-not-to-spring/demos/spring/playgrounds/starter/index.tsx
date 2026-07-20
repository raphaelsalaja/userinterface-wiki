import { animate, motion, useMotionValue } from "motion/react";
import styles from "./styles.module.css";

const easeOutQuint = [0.23, 1, 0.32, 1] as const;

export function SpringExercise() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = () => {
    /*
      TODO: The ball snaps back with a fixed-duration ease, so it
      ignores how fast you were flicking it — release feels dead.
      Replace the transition with a spring that preserves velocity:
        - track velocity with `useVelocity(x)` from motion/react
        - use type: "spring", stiffness: 300, damping: 20
        - pass `velocity: xVelocity.get()` so the release carries
          the energy of the gesture
    */
    const transition = { duration: 0.4, ease: easeOutQuint };

    animate(x, 0, transition);
    animate(y, 0, transition);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <motion.div
          className={styles.ball}
          style={{ x, y }}
          drag
          dragElastic={0.5}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        />
      </div>
    </div>
  );
}
