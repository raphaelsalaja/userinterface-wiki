"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { ArrowIcon, CrownIcon, FireIcon, ToastIcon } from "./icons";
import styles from "./styles.module.css";

const icons = {
  fire: FireIcon,
  crown: CrownIcon,
  toast: ToastIcon,
};

type IconKey = keyof typeof icons;

export function SquashStretch() {
  const [icon, setIcon] = useState<IconKey>("fire");

  const Icon = icons[icon];

  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        <motion.div
          key={icon}
          initial={false}
          animate={{ scaleX: [1.3, 1], scaleY: [0.8, 1] }}
          transition={{
            type: "spring",
            stiffness: 110,
            damping: 2,
            mass: 0.1,
          }}
          className={styles.wrapper}
        >
          <Icon className={styles.icon} />
        </motion.div>
      </div>
      <div className={styles.picker}>
        <ArrowIcon className={styles.arrow} />
        {(Object.keys(icons) as IconKey[]).map((key) => {
          const Icon = icons[key];
          return (
            <button
              key={key}
              className={styles.option}
              onClick={() => setIcon(key)}
              type="button"
              data-active={icon === key}
            >
              <Icon className={styles.icon} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
