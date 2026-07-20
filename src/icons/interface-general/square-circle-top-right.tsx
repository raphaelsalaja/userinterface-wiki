import type { IconProps } from "@/icons/types";

export const SquareCircleTopRightIcon = ({
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
    <title>Square Circle Top Right</title>
    <path
      d="M12.78 3C11.446 5.30086 11.7638 8.29687 13.7334 10.2665C15.7031 12.2362 18.6991 12.554 21 11.2199V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H12.78Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.4142 4.58579C18.6332 3.80474 17.3668 3.80474 16.5858 4.58579C15.8047 5.36683 15.8047 6.63317 16.5858 7.41421C17.3668 8.19526 18.6332 8.19526 19.4142 7.41421C20.1953 6.63317 20.1953 5.36683 19.4142 4.58579ZM20.8284 3.17157C19.2663 1.60948 16.7337 1.60948 15.1716 3.17157C13.6095 4.73367 13.6095 7.26633 15.1716 8.82843C16.7337 10.3905 19.2663 10.3905 20.8284 8.82843C22.3905 7.26633 22.3905 4.73367 20.8284 3.17157Z"
      fill={color}
    />
  </svg>
);
