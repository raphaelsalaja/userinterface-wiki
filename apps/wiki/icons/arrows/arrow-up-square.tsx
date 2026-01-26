import type { IconProps } from "@/icons/types";

export const ArrowUpSquareIcon = ({
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
    <title>Arrow Up Square</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 3C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H18ZM12.707 7.29297C12.3409 6.92685 11.7619 6.90426 11.3691 7.22461L11.293 7.29297L8.29297 10.293C7.90244 10.6835 7.90244 11.3165 8.29297 11.707C8.68349 12.0976 9.31651 12.0976 9.70703 11.707L11 10.4141V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V10.4141L14.293 11.707C14.6835 12.0976 15.3165 12.0976 15.707 11.707C16.0976 11.3165 16.0976 10.6835 15.707 10.293L12.707 7.29297Z"
      fill={color}
    />
  </svg>
);
