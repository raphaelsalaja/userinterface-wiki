import type { IconProps } from "@/icons/types";

export const ArrowRedoUpIcon = ({
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
    <title>Arrow Redo Up</title>
    <path
      d="M16.793 5.70711C16.4025 5.31658 16.4025 4.68342 16.793 4.29289C17.1836 3.90237 17.8167 3.90237 18.2073 4.29289L21.5002 7.58579C22.2812 8.36684 22.2812 9.63317 21.5002 10.4142L18.2073 13.7071C17.8167 14.0976 17.1836 14.0976 16.793 13.7071C16.4025 13.3166 16.4025 12.6834 16.793 12.2929L19.0859 10H7C5.34315 10 4 11.3431 4 13V14C4 15.6569 5.34315 17 7 17H12C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19H7C4.23858 19 2 16.7614 2 14V13C2 10.2386 4.23857 8 7 8H19.0859L16.793 5.70711Z"
      fill={color}
    />
  </svg>
);
