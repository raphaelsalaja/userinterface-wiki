import type { IconProps } from "@/icons/types";

export const ArrowWall2UpIcon = ({
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
    <title>Arrow Wall 2 Up</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H12.5808C12.8858 5.09226 13.1731 5.25892 13.4142 5.5L16.9571 9.04289C17.3476 9.43341 17.3476 10.0666 16.9571 10.4571C16.5666 10.8476 15.9334 10.8476 15.5429 10.4571L13 7.91422L13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20L11 7.9142L8.45711 10.4571C8.06659 10.8476 7.43342 10.8476 7.04289 10.4571C6.65237 10.0666 6.65237 9.43342 7.04289 9.04289L10.5858 5.5L11.1166 6.03088L10.5858 5.5C10.8268 5.25892 11.1142 5.09226 11.4192 5H5C4.44772 5 4 4.55228 4 4Z"
      fill={color}
    />
  </svg>
);
