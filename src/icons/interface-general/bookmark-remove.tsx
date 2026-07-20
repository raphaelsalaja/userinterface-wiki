import type { IconProps } from "@/icons/types";

export const BookmarkRemoveIcon = ({
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
    <title>Bookmark Remove</title>
    <path
      d="M7 2C5.34314 2 4 3.34315 4 5V13.2405L1.66968 14.0561C1.1484 14.2386 0.873723 14.8091 1.05617 15.3303C1.23862 15.8516 1.8091 16.1263 2.33038 15.9439L22.3304 8.94386C22.8517 8.76141 23.1263 8.19093 22.9439 7.66965C22.7614 7.14837 22.191 6.87369 21.6697 7.05614L20 7.64053V5C20 3.34315 18.6569 2 17 2H7Z"
      fill={color}
    />
    <path
      d="M4 19.9948V17.4784L20 11.8784V19.9948C20 21.6146 18.1751 22.5625 16.8499 21.6311L12.575 18.6265C12.23 18.384 11.77 18.384 11.425 18.6265L7.15006 21.6311C5.82485 22.5625 4 21.6146 4 19.9948Z"
      fill={color}
    />
  </svg>
);
