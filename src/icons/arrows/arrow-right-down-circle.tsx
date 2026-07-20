import type { IconProps } from "@/icons/types";

export const ArrowRightDownCircleIcon = ({
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
    <title>Arrow Right Down Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16 15C16 15.5523 15.5523 16 15 16H10C9.44771 16 9 15.5523 9 15C9 14.4477 9.44771 14 10 14H12.5858L8.29289 9.70711C7.90237 9.31658 7.90237 8.68342 8.29289 8.29289C8.68342 7.90237 9.31658 7.90237 9.70711 8.29289L14 12.5858V10C14 9.44771 14.4477 9 15 9C15.5523 9 16 9.44771 16 10V15Z"
      fill={color}
    />
  </svg>
);
