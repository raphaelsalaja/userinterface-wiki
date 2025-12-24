import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

type CalloutTone = "info" | "warn" | "warning" | "error" | "success" | "idea";

interface CalloutProps {
  type?: CalloutTone;
  title?: string;
  children: ReactNode;
}

function Callout({ type = "info", title, children }: CalloutProps) {
  const tone = type === "warning" ? "warn" : type;

  return (
    <div className={clsx(styles.callout)} data-variant={tone}>
      {title ? <div className={styles.title}>{title}</div> : null}
      <div className={styles.body}>{children}</div>
    </div>
  );
}

export { Callout };
