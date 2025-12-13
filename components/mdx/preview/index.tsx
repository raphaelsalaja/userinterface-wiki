import clsx from "clsx";
import type React from "react";
import styles from "./styles.module.css";

interface PreviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Preview({ className, ...props }: PreviewProps) {
  return <div className={clsx(className, styles.preview)} {...props} />;
}
