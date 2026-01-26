import type { IconProps } from "@/icons/types";

export const Box2AltFillIcon = ({
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
    <title>Box 2 Alt Fill</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 3L6.00004 3C4.34319 3.00001 3.00004 4.34315 3.00004 6L3 18C2.99999 19.6569 4.34314 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3ZM6.00004 5L18 5C18.5523 5 19 5.44772 19 6V12H15.874C15.4177 12 15.0193 12.3089 14.9055 12.7507C14.5724 14.0449 13.3965 15 12 15C10.6035 15 9.42754 14.0449 9.09445 12.7507C8.98072 12.3089 8.5823 12 8.12601 12H5.00002L5.00004 6C5.00004 5.44772 5.44775 5 6.00004 5Z"
      fill={color}
    />
  </svg>
);
