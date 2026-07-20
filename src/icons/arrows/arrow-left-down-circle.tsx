import type { IconProps } from "@/icons/types";

export const ArrowLeftDownCircleIcon = ({
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
    <title>Arrow Left Down Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM8 15C8 15.5523 8.44772 16 9 16H14C14.5523 16 15 15.5523 15 15C15 14.4477 14.5523 14 14 14H11.4142L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L10 12.5858V10C10 9.44771 9.55228 9 9 9C8.44772 9 8 9.44771 8 10V15Z"
      fill={color}
    />
  </svg>
);
