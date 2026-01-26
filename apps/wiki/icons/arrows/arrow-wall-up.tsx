import type { IconProps } from "@/icons/types";

export const ArrowWallUpIcon = ({
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
    <title>Arrow Wall Up</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3C20 3.55228 19.5523 4 19 4H5C4.44772 4 4 3.55228 4 3ZM10.5858 6.75C11.3669 5.96895 12.6332 5.96895 13.4142 6.75L16.9571 10.2929C17.3476 10.6834 17.3476 11.3166 16.9571 11.7071C16.5666 12.0976 15.9334 12.0976 15.5429 11.7071L13 9.1642L13 21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21L11 9.16422L8.45711 11.7071C8.06658 12.0976 7.43342 12.0976 7.04289 11.7071C6.65237 11.3166 6.65237 10.6834 7.04289 10.2929L10.5858 6.75Z"
      fill={color}
    />
  </svg>
);
