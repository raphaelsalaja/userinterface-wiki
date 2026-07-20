import { motion } from "motion/react";
import { useState } from "react";
import styles from "./styles.module.css";

function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.0142 1.70807C11.7507 1.50497 11.4036 1.44614 11.088 1.55112C10.7723 1.65611 10.5296 1.91116 10.4403 2.23158C9.90268 4.16083 8.80022 5.22289 7.38331 6.58789C7.1924 6.7718 6.99579 6.96121 6.79407 7.15898L6.79335 7.15969C6.16354 7.77845 5.51349 8.47938 4.97951 9.27371C3.39474 11.6326 3.00524 14.3046 4.19193 16.9909L4.19239 16.992C6.17042 21.456 10.5982 22.7419 14.297 21.6104C18.0101 20.4744 21.0549 16.8981 20.415 11.744C20.2173 10.1386 19.6746 8.47873 18.3334 7.17122C18.1227 6.96584 17.8322 6.86366 17.5394 6.8919C17.2465 6.92014 16.9809 7.07593 16.8133 7.31778C16.6732 7.52011 16.3541 7.91009 15.9715 8.36098C15.9053 7.55854 15.7383 6.78655 15.4546 6.04124C14.8323 4.4062 13.6855 2.99673 12.0142 1.70807Z"
      />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.8321 3.4453C12.6466 3.1671 12.3344 3 12 3C11.6657 3 11.3534 3.1671 11.168 3.4453L7.65766 8.71078L2.44725 6.10557C2.10435 5.93412 1.69361 5.9738 1.38987 6.20773C1.08613 6.44165 0.942863 6.82864 1.02105 7.20395L3.02353 16.8158C3.40996 18.6707 5.04474 20 6.93945 20H17.0606C18.9553 20 20.5901 18.6707 20.9765 16.8158L22.979 7.20395C23.0572 6.82864 22.9139 6.44165 22.6102 6.20773C22.3065 5.9738 21.8957 5.93412 21.5528 6.10557L16.3424 8.71078L12.8321 3.4453Z"
      />
    </svg>
  );
}

const icons = {
  fire: FireIcon,
  crown: CrownIcon,
};

type IconKey = keyof typeof icons;

export function SquashStretchSolution() {
  const [icon, setIcon] = useState<IconKey>("fire");

  const Icon = icons[icon];

  return (
    <div className={styles.container}>
      <div className={styles.visual}>
        {/*
          Keying on `icon` restarts the animation on every change.
          The element arrives wide and short (scaleX 1.3, scaleY 0.8)
          and springs back to rest, faking the physics of soft mass.
        */}
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
          <Icon />
        </motion.div>
      </div>
      <div className={styles.picker}>
        {(Object.keys(icons) as IconKey[]).map((key) => {
          const OptionIcon = icons[key];
          return (
            <button
              key={key}
              className={styles.option}
              onClick={() => setIcon(key)}
              type="button"
              data-active={icon === key}
            >
              <OptionIcon />
            </button>
          );
        })}
      </div>
    </div>
  );
}
