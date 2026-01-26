import type { IconProps } from "@/icons/types";

export const ChevronLeftIcon = ({
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
    <title>Chevron Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.7073 3.29289C16.0978 3.68342 16.0978 4.31658 15.7073 4.70711L9.12151 11.2929C8.73098 11.6834 8.73098 12.3166 9.12151 12.7071L15.7073 19.2929C16.0978 19.6834 16.0978 20.3166 15.7073 20.7071C15.3168 21.0976 14.6836 21.0976 14.2931 20.7071L7.7073 14.1213C6.53572 12.9498 6.53572 11.0503 7.70729 9.8787L14.2931 3.29289C14.6836 2.90237 15.3168 2.90237 15.7073 3.29289Z"
      fill={color}
    />
  </svg>
);
