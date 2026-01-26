import type { IconProps } from "@/icons/types";

export const SquareArrowInTopLeftIcon = ({
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
    <title>Square Arrow In Top Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.29289 3.29289C3.68342 2.90237 4.31658 2.90237 4.70711 3.29289L9 7.58579V4C9 3.44772 9.44772 3 10 3C10.5523 3 11 3.44772 11 4V9.25C11 10.2165 10.2165 11 9.25 11L4 11C3.44772 11 3 10.5523 3 10C3 9.44772 3.44772 9 4 9L7.58579 9L3.29289 4.70711C2.90237 4.31658 2.90237 3.68342 3.29289 3.29289ZM13 7C13 6.44772 13.4477 6 14 6H19C20.6569 6 22 7.34315 22 9V19C22 20.6569 20.6569 22 19 22H9C7.34315 22 6 20.6569 6 19V14C6 13.4477 6.44772 13 7 13C7.55228 13 8 13.4477 8 14V19C8 19.5523 8.44772 20 9 20H19C19.5523 20 20 19.5523 20 19V9C20 8.44772 19.5523 8 19 8H14C13.4477 8 13 7.55228 13 7Z"
      fill={color}
    />
  </svg>
);
