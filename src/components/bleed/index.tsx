import type { CSSProperties, HTMLAttributes } from "react";
import styles from "./styles.module.css";

type BleedProps = HTMLAttributes<HTMLDivElement> & {
  full?: boolean;
  amount?: number | string;
};

export function Bleed({
  full,
  amount,
  className,
  style,
  ...props
}: BleedProps) {
  const customStyle: CSSProperties | undefined = amount
    ? {
        ...style,
        ["--bleed-amount" as string]:
          typeof amount === "number" ? `${amount}px` : amount,
      }
    : style;

  return (
    <div
      data-prose-type="bleed"
      data-full={full || undefined}
      data-custom={amount ? true : undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={customStyle}
      {...props}
    />
  );
}
