"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

export function ProgressBarDemo() {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && progress < 100) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            setIsActive(false);
            return 100;
          }
          return next;
        });
      }, 50);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, progress]);

  const handleStart = () => {
    setProgress(0);
    setIsActive(true);
  };

  const handleReset = () => {
    setIsActive(false);
    setProgress(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>📥</div>
          <div className={styles.info}>
            <span className={styles.filename}>project-assets.zip</span>
            <span className={styles.size}>24.5 MB</span>
          </div>
        </div>
        <div className={styles.progresswrap}>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.percent}>{progress}%</span>
        </div>
        {progress === 100 && (
          <span className={styles.complete}>Download complete</span>
        )}
      </div>
      <div className={styles.actions}>
        {progress === 0 ? (
          <button type="button" className={styles.start} onClick={handleStart}>
            Start Download
          </button>
        ) : (
          <button type="button" className={styles.reset} onClick={handleReset}>
            Reset
          </button>
        )}
      </div>
      <p className={styles.hint}>Linear motion shows accurate progress</p>
    </div>
  );
}
