import type { IconProps } from "@/icons/types";

export const SquareBehindSquare2Icon = ({
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
    <title>Square Behind Square 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 4.25C22 3.00736 20.9926 2 19.75 2H10.25C9.00736 2 8 3.00736 8 4.25V8H4.25C3.00736 8 2 9.00736 2 10.25V19.75C2 20.9926 3.00736 22 4.25 22H13.75C14.9926 22 16 20.9926 16 19.75V16H19.75C20.9926 16 22 14.9926 22 13.75V4.25ZM16 14H19.75C19.8881 14 20 13.8881 20 13.75V4.25C20 4.11193 19.8881 4 19.75 4H10.25C10.1119 4 10 4.11193 10 4.25V8H13.75C14.9926 8 16 9.00736 16 10.25V14Z"
      fill={color}
    />
  </svg>
);
