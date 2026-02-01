import clsx from "clsx";
import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import styles from "./styles.module.css";

type CalloutTone = "info" | "warn" | "warning" | "error" | "success" | "idea";

interface CalloutProps {
  type?: CalloutTone;
  title?: string;
  children: ReactNode;
}

function Callout({ type = "info", title, children }: CalloutProps) {
  const tone = type === "warning" ? "warn" : type;

  const bodyChildren = Children.map(children, (child) => {
    if (!isValidElement<{ className?: string }>(child)) {
      return child;
    }

    return cloneElement<{ className?: string }>(child, {
      className: clsx(child.props.className, styles.body),
    });
  });

  return (
    <div className={clsx(styles.callout)} data-variant={tone}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {bodyChildren}
    </div>
  );
}

export { Callout };
