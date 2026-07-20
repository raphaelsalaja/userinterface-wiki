import type { IconProps } from "@/icons/types";

export const SquareArrowOutTopLeftIcon = ({
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
    <title>Square Arrow Out Top Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4.75C3 3.7835 3.7835 3 4.75 3H10C10.5523 3 11 3.44772 11 4C11 4.55228 10.5523 5 10 5H6.41421L10.9571 9.54289C11.3476 9.93342 11.3476 10.5666 10.9571 10.9571C10.5666 11.3476 9.93342 11.3476 9.54289 10.9571L5 6.41421V10C5 10.5523 4.55228 11 4 11C3.44772 11 3 10.5523 3 10V4.75ZM13 7C13 6.44772 13.4477 6 14 6H19C20.6569 6 22 7.34315 22 9V19C22 20.6569 20.6569 22 19 22H9C7.34315 22 6 20.6569 6 19V14C6 13.4477 6.44772 13 7 13C7.55228 13 8 13.4477 8 14V19C8 19.5523 8.44772 20 9 20H19C19.5523 20 20 19.5523 20 19V9C20 8.44772 19.5523 8 19 8H14C13.4477 8 13 7.55228 13 7Z"
      fill={color}
    />
  </svg>
);
