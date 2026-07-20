"use client";

import clsx from "clsx";
import type React from "react";
import styles from "./styles.module.css";

interface ControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom";
  children: React.ReactNode;
}

function Controls({ className, children, position, ...props }: ControlsProps) {
  return (
    <div
      className={clsx(
        styles.controls,
        className,
        position === "top" ? styles.top : undefined,
        position === "bottom" ? styles.bottom : undefined,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Controls };
