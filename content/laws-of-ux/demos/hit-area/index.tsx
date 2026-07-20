"use client";

import { Calligraph } from "calligraph";
import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Controls } from "@/components/primitives/controls";
import { Checkmark1Icon, CrossLargeIcon } from "@/icons";
import type { IconProps } from "@/icons/types";
import styles from "./styles.module.css";

export const ToastIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <title>Toast</title>
      <path
        d="M12 3C9.37749 3 6.95383 3.5884 5.1504 4.59031C3.38084 5.5734 2 7.09122 2 9C2 10.4701 2.82568 11.7132 4 12.6468V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V12.6468C21.1743 11.7132 22 10.4701 22 9C22 7.09122 20.6192 5.5734 18.8496 4.59031C17.0462 3.5884 14.6225 3 12 3Z"
        fill={color}
      />
    </svg>
  );
};

export function HitArea() {
  const [debug, setDebug] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.zone}>
            <Button
              variant="ghost"
              aspect="square"
              size="large"
              data-hit="default"
              data-debug={debug}
              className={styles.button}
            >
              <ToastIcon />
              <span className={styles.dimension} data-debug={debug}>
                40 x 40
              </span>
            </Button>
          </div>
          <span className={styles.label} data-variant="false">
            <CrossLargeIcon size={16} />
          </span>
        </div>
        <div className={styles.column}>
          <div className={styles.zone}>
            <Button
              variant="ghost"
              size="large"
              aspect="square"
              data-hit="expanded"
              data-debug={debug}
              className={styles.button}
            >
              <ToastIcon />
              <span
                className={styles.dimension}
                data-debug={debug}
                data-position="expanded"
              >
                72 x 72
              </span>
            </Button>
          </div>
          <span className={styles.label} data-variant="correct">
            <Checkmark1Icon size={16} />
          </span>
        </div>
      </div>
      <Controls className={styles.controls}>
        <Button size="small" onClick={() => setDebug((d) => !d)}>
          <Calligraph drift={{ x: 1 }}>{debug ? "Hide" : "Show"}</Calligraph>
          Hit Areas
        </Button>
      </Controls>
    </div>
  );
}
