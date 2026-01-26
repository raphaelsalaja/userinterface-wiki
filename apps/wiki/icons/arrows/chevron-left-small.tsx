import type { IconProps } from "@/icons/types";

export const ChevronLeftSmallIcon = ({
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
    <title>Chevron Left Small</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.293 7.29289C13.9025 6.90237 13.2694 6.90237 12.8788 7.29289L9.58594 10.5858C8.80489 11.3668 8.80489 12.6332 9.58594 13.4142L12.8788 16.7071C13.2694 17.0976 13.9025 17.0976 14.293 16.7071C14.6836 16.3166 14.6836 15.6834 14.293 15.2929L11.0002 12L14.293 8.70711C14.6836 8.31658 14.6836 7.68342 14.293 7.29289Z"
      fill={color}
    />
  </svg>
);
