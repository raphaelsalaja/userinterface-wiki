import type { IconProps } from "@/icons/types";

export const SquareBehindSquare3Icon = ({
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
    <title>Square Behind Square 3</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 8V4.25C16 3.00736 14.9926 2 13.75 2H4.25C3.00736 2 2 3.00736 2 4.25V13.75C2 14.9926 3.00736 16 4.25 16H8V19.75C8 20.9926 9.00736 22 10.25 22H19.75C20.9926 22 22 20.9926 22 19.75V10.25C22 9.00736 20.9926 8 19.75 8H16ZM13.75 16C14.9926 16 16 14.9926 16 13.75V10H19.75C19.8881 10 20 10.1119 20 10.25V19.75C20 19.8881 19.8881 20 19.75 20H10.25C10.1119 20 10 19.8881 10 19.75V16H13.75Z"
      fill={color}
    />
  </svg>
);
