import type { IconProps } from "@/icons/types";

export const ArrowCornerUpLeftIcon = ({
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
    <title>Arrow Corner Up Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.70711 4.29289C9.09763 4.68342 9.09763 5.31658 8.70711 5.70711L6.41421 8H18C19.6569 8 21 9.34315 21 11V19C21 19.5523 20.5523 20 20 20C19.4477 20 19 19.5523 19 19V11C19 10.4477 18.5523 10 18 10H6.41421L8.70711 12.2929C9.09763 12.6834 9.09763 13.3166 8.70711 13.7071C8.31658 14.0976 7.68342 14.0976 7.29289 13.7071L3.29289 9.70711C2.90237 9.31658 2.90237 8.68342 3.29289 8.29289L7.29289 4.29289C7.68342 3.90237 8.31658 3.90237 8.70711 4.29289Z"
      fill={color}
    />
  </svg>
);
