import type { IconProps } from "@/icons/types";

export const ClipboardIcon = ({
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
    <title>Clipboard</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.17071 4C8.58254 2.83481 9.69378 2 11 2H13C14.3062 2 15.4175 2.83481 15.8293 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.17071ZM10 5V6H14V5C14 4.44772 13.5523 4 13 4H11C10.4477 4 10 4.44772 10 5Z"
      fill={color}
    />
  </svg>
);
