"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import clsx from "clsx";
import { motion } from "motion/react";
import type React from "react";
import styles from "./styles.module.css";

const MotionBaseButton = motion.create(BaseButton);

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof MotionBaseButton> {
  variant?: "primary" | "secondary" | "ghost" | "text";
  size?: "small" | "medium" | "large";
}

function Button({
  className,
  variant = "primary",
  size = "medium",
  ...props
}: ButtonProps) {
  return (
    <MotionBaseButton
      className={clsx(styles.button, styles[size], styles[variant], className)}
      {...props}
    />
  );
}

interface ControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Controls({ className, children, ...props }: ControlsProps) {
  return (
    <div className={clsx(styles.controls, className)} {...props}>
      {children}
    </div>
  );
}

export { Button, Controls };
