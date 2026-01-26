import type { IconProps } from "@/icons/types";

export const ArrowUpLeftIcon = ({
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
    <title>Arrow Up Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 6.5C16 5.67157 15.3284 5 14.5 5H6.5C5.67157 5 5 5.67157 5 6.5V14.5C5 15.3284 5.67157 16 6.5 16C7.32843 16 8 15.3284 8 14.5V10.1213L16.4393 18.5607C17.0251 19.1464 17.9749 19.1464 18.5607 18.5607C19.1464 17.9749 19.1464 17.0251 18.5607 16.4393L10.1213 8H14.5C15.3284 8 16 7.32843 16 6.5Z"
      fill={color}
    />
  </svg>
);
