import type { IconProps } from "@/icons/types";

export const MathGreaterThanCircleIcon = ({
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
    <title>Math Greater Than Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.94721 8.10557C9.45324 7.85858 8.85256 8.05881 8.60557 8.55279C8.35858 9.04676 8.55881 9.64744 9.05279 9.89443L13.2639 12L9.05279 14.1056C8.55881 14.3526 8.35858 14.9532 8.60557 15.4472C8.85256 15.9412 9.45324 16.1414 9.94721 15.8944L15.9472 12.8944C16.286 12.725 16.5 12.3788 16.5 12C16.5 11.6212 16.286 11.275 15.9472 11.1056L9.94721 8.10557Z"
      fill={color}
    />
  </svg>
);
