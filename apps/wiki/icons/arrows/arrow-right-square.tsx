import type { IconProps } from "@/icons/types";

export const ArrowRightSquareIcon = ({
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
    <title>Arrow Right Square</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 3C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H18ZM13.707 8.29297C13.3165 7.90244 12.6835 7.90244 12.293 8.29297C11.9024 8.68349 11.9024 9.31651 12.293 9.70703L13.5859 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H13.5859L12.293 14.293C11.9024 14.6835 11.9024 15.3165 12.293 15.707C12.6835 16.0976 13.3165 16.0976 13.707 15.707L16.707 12.707C17.0976 12.3165 17.0976 11.6835 16.707 11.293L13.707 8.29297Z"
      fill={color}
    />
  </svg>
);
