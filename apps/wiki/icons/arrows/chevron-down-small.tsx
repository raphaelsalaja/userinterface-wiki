import type { IconProps } from "@/icons/types";

export const ChevronDownSmallIcon = ({
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
    <title>Chevron Down Small</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5858 13.9999C11.3668 14.781 12.6332 14.781 13.4142 13.9999L16.7071 10.707C17.0976 10.3165 17.0976 9.68332 16.7071 9.2928C16.3166 8.90228 15.6834 8.90228 15.2929 9.2928L12 12.5857L8.70711 9.2928C8.31658 8.90228 7.68342 8.90228 7.29289 9.2928C6.90237 9.68332 6.90237 10.3165 7.29289 10.707L10.5858 13.9999Z"
      fill={color}
    />
  </svg>
);
