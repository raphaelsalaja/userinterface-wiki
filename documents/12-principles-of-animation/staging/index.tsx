"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";
import styles from "./styles.module.css";

const url =
  "https://images.macrumors.com/t/ZPdVuPiq5AMJNdRBRJs6Xbv7SAY=/1600x0/article-new/2024/07/Steve-Jobs-Younger.jpg";

export function Staging() {
  const [staged, setStaged] = React.useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.paragraph}>
        <span className={styles.text} data-type="paragraph">
          Here's to the crazy ones. The misfits. The rebels. The troublemakers.
          The round pegs in the square holes. The ones who see things
          differently. They're not fond of rules. And they have no respect for
          the status quo. You can quote them, disagree with them, glorify or
          vilify them.
        </span>
        <motion.div
          style={{
            backgroundImage: `url(${url})`,
          }}
          layoutCrossfade={false}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onTap={() => setStaged(!staged)}
          transition={{
            ease: [1, -0.4, 0.35, 0.95],
            duration: 0.4,
          }}
          className={styles.image}
          layoutId="image"
        />
        <span className={styles.text} data-type="paragraph">
          About the only thing you can't do is ignore them. Because they change
          things. They push the human race forward. And while some may see them
          as the crazy ones, we see genius. Because the people who are crazy
          enough to think they can change the world, are the ones who do.
        </span>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {staged && (
          <motion.div
            key="image"
            style={{
              backgroundImage: `url(${url})`,
            }}
            layoutCrossfade={false}
            transformTemplate={(_latest, generated) =>
              `translate(-50%, -50%) ${generated}`
            }
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              ease: [1, -0.4, 0.35, 0.95],
              duration: 0.4,
            }}
            className={`${styles.image} ${styles.staged}`}
            onTap={() => setStaged(false)}
            layoutId="image"
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="popLayout">
        {staged && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2 }}
            className={styles.overlay}
            onTap={() => setStaged(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
