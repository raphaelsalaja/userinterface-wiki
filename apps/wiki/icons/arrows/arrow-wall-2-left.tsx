import type { IconProps } from "@/icons/types";

export const ArrowWall2LeftIcon = ({
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
    <title>Arrow Wall 2 Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C4.55228 4 5 4.44772 5 5V11.4192C5.09226 11.1142 5.25892 10.8268 5.5 10.5858L9.04289 7.04289C9.43342 6.65237 10.0666 6.65237 10.4571 7.04289C10.8476 7.43342 10.8476 8.06659 10.4571 8.45711L7.9142 11L20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L7.91422 13L10.4571 15.5429C10.8476 15.9334 10.8476 16.5666 10.4571 16.9571C10.0666 17.3476 9.43341 17.3476 9.04289 16.9571L5.5 13.4142C5.25892 13.1731 5.09226 12.8858 5 12.5808V19C5 19.5523 4.55228 20 4 20C3.44772 20 3 19.5523 3 19V5C3 4.44772 3.44772 4 4 4Z"
      fill={color}
    />
  </svg>
);
