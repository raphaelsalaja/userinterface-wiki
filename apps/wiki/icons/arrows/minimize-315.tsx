import type { IconProps } from "@/icons/types";

export const Minimize315Icon = ({
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
    <title>Minimize 315</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.04289 3.04289C2.65237 3.43342 2.65237 4.06658 3.04289 4.45711L7.58579 9H4C3.44772 9 3 9.44772 3 10C3 10.5523 3.44772 11 4 11H10C10.5523 11 11 10.5523 11 10V4C11 3.44772 10.5523 3 10 3C9.44772 3 9 3.44772 9 4V7.58579L4.45711 3.04289C4.06658 2.65237 3.43342 2.65237 3.04289 3.04289ZM21 14C21 13.4477 20.5523 13 20 13H14C13.4477 13 13 13.4477 13 14V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16.4142L19.5429 20.9571C19.9334 21.3476 20.5666 21.3476 20.9571 20.9571C21.3476 20.5666 21.3476 19.9334 20.9571 19.5429L16.4142 15H20C20.5523 15 21 14.5523 21 14Z"
      fill={color}
    />
  </svg>
);
