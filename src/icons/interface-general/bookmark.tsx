import type { IconProps } from "@/icons/types";

export const BookmarkIcon = ({
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
    <title>Bookmark</title>
    <path
      d="M7 2C5.34314 2 4 3.34315 4 5V19.9948C4 21.6146 5.82485 22.5625 7.15006 21.6311L11.425 18.6265C11.77 18.384 12.23 18.384 12.575 18.6265L16.8499 21.6311C18.1751 22.5625 20 21.6146 20 19.9948V5C20 3.34315 18.6569 2 17 2H7Z"
      fill={color}
    />
  </svg>
);
