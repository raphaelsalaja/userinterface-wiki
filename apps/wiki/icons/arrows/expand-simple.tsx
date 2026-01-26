import type { IconProps } from "@/icons/types";

export const ExpandSimpleIcon = ({
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
    <title>Expand Simple</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 6C12 5.44772 12.4477 5 13 5H16C17.6569 5 19 6.34315 19 8V11C19 11.5523 18.5523 12 18 12C17.4477 12 17 11.5523 17 11V8C17 7.44772 16.5523 7 16 7H13C12.4477 7 12 6.55228 12 6ZM6 12C6.55228 12 7 12.4477 7 13V16C7 16.5523 7.44772 17 8 17H11C11.5523 17 12 17.4477 12 18C12 18.5523 11.5523 19 11 19H8C6.34315 19 5 17.6569 5 16V13C5 12.4477 5.44772 12 6 12Z"
      fill={color}
    />
  </svg>
);
