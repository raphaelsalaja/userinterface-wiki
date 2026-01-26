import type { IconProps } from "@/icons/types";

export const ExpandSimple2Icon = ({
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
    <title>Expand Simple 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 12C5.44772 12 5 11.5523 5 11V8C5 6.34315 6.34315 5 8 5H11C11.5523 5 12 5.44771 12 6C12 6.55229 11.5523 7 11 7H8C7.44772 7 7 7.44771 7 8V11C7 11.5523 6.55228 12 6 12ZM12 18C12 17.4477 12.4477 17 13 17H16C16.5523 17 17 16.5523 17 16V13C17 12.4477 17.4477 12 18 12C18.5523 12 19 12.4477 19 13V16C19 17.6569 17.6569 19 16 19H13C12.4477 19 12 18.5523 12 18Z"
      fill={color}
    />
  </svg>
);
