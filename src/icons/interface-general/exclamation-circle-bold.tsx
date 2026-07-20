import type { IconProps } from "@/icons/types";

export const ExclamationCircleBoldIcon = ({
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
    <title>Exclamation Circle Bold</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 14.5996C11.3373 14.5996 10.7998 15.1371 10.7998 15.7998C10.7999 16.4624 11.3373 17 12 17C12.6627 17 13.2001 16.4625 13.2002 15.7998C13.2002 15.1371 12.6627 14.5996 12 14.5996ZM12 7C11.2035 7.00001 10.5878 7.69798 10.6865 8.48828L11.1572 12.2559C11.2104 12.681 11.5716 13 12 13C12.4284 13 12.7896 12.681 12.8428 12.2559L13.3145 8.48828C13.4131 7.69802 12.7964 7 12 7Z"
      fill={color}
    />
  </svg>
);
