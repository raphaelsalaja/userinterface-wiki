import type { IconProps } from "@/icons/types";

export const StepBackIcon = ({
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
    <title>Step Back</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.70711 2.29289C8.09763 2.68342 8.09763 3.31658 7.70711 3.70711L6.41421 5H13.5C17.6421 5 21 8.35786 21 12.5C21 16.6421 17.6421 20 13.5 20H6C5.44772 20 5 19.5523 5 19C5 18.4477 5.44772 18 6 18H13.5C16.5376 18 19 15.5376 19 12.5C19 9.46243 16.5376 7 13.5 7H6.41421L7.70711 8.29289C8.09763 8.68342 8.09763 9.31658 7.70711 9.70711C7.31658 10.0976 6.68342 10.0976 6.29289 9.70711L3.29289 6.70711C2.90237 6.31658 2.90237 5.68342 3.29289 5.29289L6.29289 2.29289C6.68342 1.90237 7.31658 1.90237 7.70711 2.29289Z"
      fill={color}
    />
  </svg>
);
