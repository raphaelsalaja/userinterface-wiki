import type { IconProps } from "@/icons/types";

export const MathEqualsCircleIcon = ({
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
    <title>Math Equals Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM8 10C8 9.44771 8.44771 9 9 9H15C15.5523 9 16 9.44771 16 10C16 10.5523 15.5523 11 15 11H9C8.44771 11 8 10.5523 8 10ZM9 13C8.44771 13 8 13.4477 8 14C8 14.5523 8.44771 15 9 15H15C15.5523 15 16 14.5523 16 14C16 13.4477 15.5523 13 15 13H9Z"
      fill={color}
    />
  </svg>
);
