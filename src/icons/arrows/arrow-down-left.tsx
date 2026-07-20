import type { IconProps } from "@/icons/types";

export const ArrowDownLeftIcon = ({
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
    <title>Arrow Down Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.5607 5.43934C17.9749 4.85355 17.0251 4.85355 16.4393 5.43934L8 13.8787V9.5C8 8.67157 7.32843 8 6.5 8C5.67157 8 5 8.67157 5 9.5V17.5C5 18.3284 5.67157 19 6.5 19H14.5C15.3284 19 16 18.3284 16 17.5C16 16.6716 15.3284 16 14.5 16H10.1213L18.5607 7.56066C19.1464 6.97487 19.1464 6.02513 18.5607 5.43934Z"
      fill={color}
    />
  </svg>
);
