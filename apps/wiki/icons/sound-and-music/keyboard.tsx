import type { IconProps } from "@/icons/types";

export const KeyboardIcon = ({
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
    <title>Keyboard</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 3C4.34315 3 3 4.34315 3 6V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V6C21 4.34315 19.6569 3 18 3H6ZM6.5 5H6C5.44772 5 5 5.44772 5 6V19C5 19.5523 5.44772 20 6 20H8V14H7.5C6.94772 14 6.5 13.5523 6.5 13V5ZM10 20H14V14H13.5C12.9477 14 12.5 13.5523 12.5 13V5H11.5V13C11.5 13.5523 11.0523 14 10.5 14H10V20ZM17.5 5V13C17.5 13.5523 17.0523 14 16.5 14H16V20H18C18.5523 20 19 19.5523 19 19V6C19 5.44772 18.5523 5 18 5H17.5Z"
      fill={color}
    />
  </svg>
);
