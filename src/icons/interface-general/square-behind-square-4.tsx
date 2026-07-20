import type { IconProps } from "@/icons/types";

export const SquareBehindSquare4Icon = ({
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
    <title>Square Behind Square 4</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 8V4.25C8 3.00736 9.00736 2 10.25 2H19.75C20.9926 2 22 3.00736 22 4.25V13.75C22 14.9926 20.9926 16 19.75 16H16V19.75C16 20.9926 14.9926 22 13.75 22H4.25C3.00736 22 2 20.9926 2 19.75V10.25C2 9.00736 3.00736 8 4.25 8H8ZM10.25 16C9.00736 16 8 14.9926 8 13.75V10H4.25C4.11193 10 4 10.1119 4 10.25V19.75C4 19.8881 4.11193 20 4.25 20H13.75C13.8881 20 14 19.8881 14 19.75V16H10.25Z"
      fill={color}
    />
  </svg>
);
