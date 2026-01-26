import type { IconProps } from "@/icons/types";

export const ArrowCornerDownLeftIcon = ({
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
    <title>Arrow Corner Down Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 4C20.5523 4 21 4.44772 21 5V13C21 14.6569 19.6569 16 18 16H6.41421L8.70711 18.2929C9.09763 18.6834 9.09763 19.3166 8.70711 19.7071C8.31658 20.0976 7.68342 20.0976 7.29289 19.7071L3.29289 15.7071C2.90237 15.3166 2.90237 14.6834 3.29289 14.2929L7.29289 10.2929C7.68342 9.90237 8.31658 9.90237 8.70711 10.2929C9.09763 10.6834 9.09763 11.3166 8.70711 11.7071L6.41421 14H18C18.5523 14 19 13.5523 19 13V5C19 4.44772 19.4477 4 20 4Z"
      fill={color}
    />
  </svg>
);
