import type { IconProps } from "@/icons/types";

export const SquareBehindSquare1Icon = ({
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
    <title>Square Behind Square 1</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 4.25C2 3.00736 3.00736 2 4.25 2H13.75C14.9926 2 16 3.00736 16 4.25V8H19.75C20.9926 8 22 9.00736 22 10.25V19.75C22 20.9926 20.9926 22 19.75 22H10.25C9.00736 22 8 20.9926 8 19.75V16H4.25C3.00736 16 2 14.9926 2 13.75V4.25ZM14 8H10.25C9.00736 8 8 9.00736 8 10.25V14H4.25C4.11193 14 4 13.8881 4 13.75V4.25C4 4.11193 4.11193 4 4.25 4H13.75C13.8881 4 14 4.11193 14 4.25V8Z"
      fill={color}
    />
  </svg>
);
