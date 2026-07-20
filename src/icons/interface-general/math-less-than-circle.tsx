import type { IconProps } from "@/icons/types";

export const MathLessThanCircleIcon = ({
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
    <title>Math Less Than Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM14.0528 8.10557C14.5468 7.85858 15.1474 8.05881 15.3944 8.55279C15.6414 9.04676 15.4412 9.64744 14.9472 9.89443L10.7361 12L14.9472 14.1056C15.4412 14.3526 15.6414 14.9532 15.3944 15.4472C15.1474 15.9412 14.5468 16.1414 14.0528 15.8944L8.05279 12.8944C7.714 12.725 7.5 12.3788 7.5 12C7.5 11.6212 7.714 11.275 8.05279 11.1056L14.0528 8.10557Z"
      fill={color}
    />
  </svg>
);
