import type { IconProps } from "@/icons/types";

export const ArrowWallDownIcon = ({
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
    <title>Arrow Wall Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20H5C4.44772 20 4 20.4477 4 21ZM10.5858 17.25C11.3669 18.0311 12.6332 18.031 13.4142 17.25L16.9571 13.7071C17.3476 13.3166 17.3476 12.6834 16.9571 12.2929C16.5666 11.9024 15.9334 11.9024 15.5429 12.2929L13 14.8358L13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44771 11 3L11 14.8358L8.45711 12.2929C8.06658 11.9024 7.43342 11.9024 7.04289 12.2929C6.65237 12.6834 6.65237 13.3166 7.04289 13.7071L10.5858 17.25Z"
      fill={color}
    />
  </svg>
);
