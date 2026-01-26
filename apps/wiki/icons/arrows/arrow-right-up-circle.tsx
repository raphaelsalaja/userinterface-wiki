import type { IconProps } from "@/icons/types";

export const ArrowRightUpCircleIcon = ({
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
    <title>Arrow Right Up Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM16 9C16 8.44772 15.5523 8 15 8H10C9.44771 8 9 8.44772 9 9C9 9.55228 9.44771 10 10 10H12.5858L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L14 11.4142V14C14 14.5523 14.4477 15 15 15C15.5523 15 16 14.5523 16 14V9Z"
      fill={color}
    />
  </svg>
);
