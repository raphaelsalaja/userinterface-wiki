import type { IconProps } from "@/icons/types";

export const ArrowWall2DownIcon = ({
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
    <title>Arrow Wall 2 Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C12.5523 3 13 3.44771 13 4L13 16.0858L15.5429 13.5429C15.9334 13.1524 16.5666 13.1524 16.9571 13.5429C17.3476 13.9334 17.3476 14.5666 16.9571 14.9571L13.4142 18.5C13.1731 18.7411 12.8858 18.9077 12.5808 19H19C19.5523 19 20 19.4477 20 20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20C4 19.4477 4.44772 19 5 19H11.4192C11.1142 18.9077 10.8268 18.7411 10.5858 18.5L7.04289 14.9571C6.65237 14.5666 6.65237 13.9334 7.04289 13.5429C7.43342 13.1524 8.06659 13.1524 8.45711 13.5429L11 16.0858L11 4C11 3.44772 11.4477 3 12 3Z"
      fill={color}
    />
  </svg>
);
