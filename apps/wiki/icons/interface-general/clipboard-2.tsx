import type { IconProps } from "@/icons/types";

export const Clipboard2Icon = ({
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
    <title>Clipboard 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.17071 4C7.58254 2.83481 8.69378 2 10 2H14C15.3062 2 16.4175 2.83481 16.8293 4H18C19.6569 4 21 5.34315 21 7V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V7C3 5.34315 4.34315 4 6 4H7.17071ZM9 5V6H15V5C15 4.44772 14.5523 4 14 4H10C9.44772 4 9 4.44772 9 5Z"
      fill={color}
    />
  </svg>
);
