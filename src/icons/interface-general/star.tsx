import type { IconProps } from "@/icons/types";

export const StarIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    width={size}
    height={size}
    {...props}
  >
    <title>Star</title>
    <path
      d="M13.3726 1.86222C12.8203 0.712594 11.1798 0.71259 10.6275 1.86222L8.26537 6.77927L2.82465 7.49166C1.56329 7.65682 1.03808 9.21543 1.97724 10.101L5.95315 13.8499L4.95534 19.2025C4.71844 20.4733 6.06382 21.4154 7.17531 20.8162L12 18.2151L16.8248 20.8162C17.9363 21.4154 19.2816 20.4733 19.0447 19.2025L18.0469 13.8499L22.0228 10.101C22.962 9.21543 22.4368 7.65682 21.1754 7.49166L15.7347 6.77927L13.3726 1.86222Z"
      fill={color}
    />
  </svg>
);
