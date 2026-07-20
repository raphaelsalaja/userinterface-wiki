import { animate, motion, useMotionValue, useVelocity } from "motion/react";
import styles from "./styles.module.css";

export function SpringSolution() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xVelocity = useVelocity(x);

  const handleDragEnd = () => {
    /*
      A spring has no fixed duration — it takes the velocity of the
      gesture as its starting energy, so a hard flick overshoots and
      settles while a gentle release eases home.
    */
    const transition = {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      velocity: xVelocity.get(),
    };

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
