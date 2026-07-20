import type { IconProps } from "@/icons/types";

export const Minimize45Icon = ({
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
    <title>Minimize 45</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.9571 3.04289C21.3476 3.43342 21.3476 4.06658 20.9571 4.45711L16.4142 9H20C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H14C13.4477 11 13 10.5523 13 10V4C13 3.44772 13.4477 3 14 3C14.5523 3 15 3.44772 15 4V7.58579L19.5429 3.04289C19.9334 2.65237 20.5666 2.65237 20.9571 3.04289ZM3 14C3 13.4477 3.44772 13 4 13H10C10.5523 13 11 13.4477 11 14V20C11 20.5523 10.5523 21 10 21C9.44772 21 9 20.5523 9 20V16.4142L4.45711 20.9571C4.06658 21.3476 3.43342 21.3476 3.04289 20.9571C2.65237 20.5666 2.65237 19.9334 3.04289 19.5429L7.58579 15H4C3.44772 15 3 14.5523 3 14Z"
      fill={color}
    />
  </svg>
);
