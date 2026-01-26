import type { IconProps } from "@/icons/types";

export const ArrowLeftSquareIcon = ({
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
    <title>Arrow Left Square</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 3C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H18ZM11.707 8.29297C11.3165 7.90244 10.6835 7.90244 10.293 8.29297L7.29297 11.293C6.90244 11.6835 6.90244 12.3165 7.29297 12.707L10.293 15.707C10.6835 16.0976 11.3165 16.0976 11.707 15.707C12.0976 15.3165 12.0976 14.6835 11.707 14.293L10.4141 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H10.4141L11.707 9.70703C12.0976 9.31651 12.0976 8.68349 11.707 8.29297Z"
      fill={color}
    />
  </svg>
);
