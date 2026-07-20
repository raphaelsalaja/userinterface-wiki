import type { IconProps } from "@/icons/types";

export const ArrowSplitIcon = ({
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
    <title>Arrow Split</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4C3 3.44772 3.44772 3 4 3H9C9.55228 3 10 3.44772 10 4C10 4.55228 9.55228 5 9 5H6.41421L12 10.5858L17.5858 5H15C14.4477 5 14 4.55228 14 4C14 3.44772 14.4477 3 15 3H20C20.5523 3 21 3.44772 21 4V9C21 9.55228 20.5523 10 20 10C19.4477 10 19 9.55228 19 9V6.41421L13 12.4142V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V12.4142L5 6.41421V9C5 9.55228 4.55228 10 4 10C3.44772 10 3 9.55228 3 9V4Z"
      fill={color}
    />
  </svg>
);
