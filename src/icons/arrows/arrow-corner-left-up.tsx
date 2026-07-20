import type { IconProps } from "@/icons/types";

export const ArrowCornerLeftUpIcon = ({
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
    <title>Arrow Corner Left Up</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.29289 3.29289C8.68342 2.90237 9.31658 2.90237 9.70711 3.29289L13.7071 7.29289C14.0976 7.68342 14.0976 8.31658 13.7071 8.70711C13.3166 9.09763 12.6834 9.09763 12.2929 8.70711L10 6.41421V18C10 18.5523 10.4477 19 11 19H19C19.5523 19 20 19.4477 20 20C20 20.5523 19.5523 21 19 21H11C9.34315 21 8 19.6569 8 18V6.41421L5.70711 8.70711C5.31658 9.09763 4.68342 9.09763 4.29289 8.70711C3.90237 8.31658 3.90237 7.68342 4.29289 7.29289L8.29289 3.29289Z"
      fill={color}
    />
  </svg>
);
