import type { IconProps } from "@/icons/types";

export const ChevronTopSmallIcon = ({
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
    <title>Chevron Top Small</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5858 10.0001C11.3668 9.21904 12.6332 9.21905 13.4142 10.0001L16.7071 13.293C17.0976 13.6835 17.0976 14.3167 16.7071 14.7072C16.3166 15.0977 15.6834 15.0977 15.2929 14.7072L12 11.4143L8.70711 14.7072C8.31658 15.0977 7.68342 15.0977 7.29289 14.7072C6.90237 14.3167 6.90237 13.6835 7.29289 13.293L10.5858 10.0001Z"
      fill={color}
    />
  </svg>
);
