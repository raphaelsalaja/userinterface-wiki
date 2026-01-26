"use client";

import { clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useEventListener } from "usehooks-ts";
import styles from "./styles.module.css";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const percentage = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
    setProgress(Math.min(100, Math.max(0, percentage)));
  }, []);

  useEventListener("scroll", handleScroll, undefined, { passive: true });

  // Initial calculation on mount
  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  return (
    <div
      className={clsx(styles.bar, className)}
      style={{ "--progress": `${progress}%` } as React.CSSProperties}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  );
}
