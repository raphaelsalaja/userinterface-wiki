import type { SVGProps } from "react";
import styles from "./styles.module.css";

export function Banner() {
  return (
    <a
      href="https://calligraph.raphaelsalaja.com"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.banner}
    >
      <span className={styles.text}>
        Try Calligraph — A Fluid Text Morphing Library for React
      </span>
      <ArrowRight fill="currentColor" width={12} height={12} />
    </a>
  );
}

type IconProps = SVGProps<SVGSVGElement> & {
  secondaryfill?: string;
  strokewidth?: number;
  title?: string;
};

function ArrowRight({
  fill = "currentColor",
  secondaryfill,
  title = "badge 13",
  ...props
}: IconProps) {
  secondaryfill = secondaryfill || fill;

  return (
    <svg
      height="20"
      id="arrow-right"
      width="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      <g fill={fill}>
        <line
          fill="none"
          stroke={secondaryfill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          x1="3"
          x2="17"
          y1="10"
          y2="10"
        />
        <polyline
          fill="none"
          points="12 15 17 10 12 5"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export default ArrowRight;
