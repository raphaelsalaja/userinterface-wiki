import type { IconProps } from "@/icons/types";

export const ArrowDownRightIcon = ({
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
    <title>Arrow Down Right</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.43934 5.43934C6.02513 4.85355 6.97487 4.85355 7.56066 5.43934L16 13.8787V9.5C16 8.67157 16.6716 8 17.5 8C18.3284 8 19 8.67157 19 9.5V17.5C19 18.3284 18.3284 19 17.5 19H9.5C8.67157 19 8 18.3284 8 17.5C8 16.6716 8.67157 16 9.5 16H13.8787L5.43934 7.56066C4.85355 6.97487 4.85355 6.02513 5.43934 5.43934Z"
      fill={color}
    />
  </svg>
);
