import type { IconProps } from "@/icons/types";

export const ExclamationCircleIcon = ({
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
    <title>Exclamation Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 14.5996C11.3373 14.5996 10.7998 15.1371 10.7998 15.7998C10.7999 16.4624 11.3373 17 12 17C12.6627 17 13.2001 16.4625 13.2002 15.7998C13.2002 15.1371 12.6627 14.5996 12 14.5996ZM12 7C11.4477 7 11 7.44772 11 8V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V8C13 7.44772 12.5523 7 12 7Z"
      fill={color}
    />
  </svg>
);
