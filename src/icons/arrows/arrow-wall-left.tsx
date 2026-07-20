import type { IconProps } from "@/icons/types";

export const ArrowWallLeftIcon = ({
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
    <title>Arrow Wall Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4C3.55228 4 4 4.44772 4 5V19C4 19.5523 3.55228 20 3 20C2.44772 20 2 19.5523 2 19V5C2 4.44772 2.44772 4 3 4ZM11.7071 7.04289C12.0976 7.43342 12.0976 8.06659 11.7071 8.45711L9.1642 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13L9.16422 13L11.7071 15.5429C12.0976 15.9334 12.0976 16.5666 11.7071 16.9571C11.3166 17.3476 10.6834 17.3476 10.2929 16.9571L6.75 13.4142C5.96895 12.6331 5.96895 11.3668 6.75 10.5858L10.2929 7.04289C10.6834 6.65237 11.3166 6.65237 11.7071 7.04289Z"
      fill={color}
    />
  </svg>
);
