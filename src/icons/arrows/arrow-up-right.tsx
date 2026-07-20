import type { IconProps } from "@/icons/types";

export const ArrowUpRightIcon = ({
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
    <title>Arrow Up Right</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 6.5C8 5.67157 8.67157 5 9.5 5H17.5C18.3284 5 19 5.67157 19 6.5V14.5C19 15.3284 18.3284 16 17.5 16C16.6716 16 16 15.3284 16 14.5V10.1213L7.56066 18.5607C6.97487 19.1464 6.02513 19.1464 5.43934 18.5607C4.85355 17.9749 4.85355 17.0251 5.43934 16.4393L13.8787 8H9.5C8.67157 8 8 7.32843 8 6.5Z"
      fill={color}
    />
  </svg>
);
