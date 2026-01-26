import type { IconProps } from "@/icons/types";

export const LightBulbIcon = ({
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
    <title>Light Bulb</title>
    <path
      d="M4 9C4 4.58172 7.58172 1 12 1C16.4183 1 20 4.58172 20 9C20 10.8924 19.3427 12.6309 18.2452 14H5.75483C4.65734 12.6309 4 10.8924 4 9Z"
      fill={color}
    />
    <path
      d="M8 16V17C8 18.1046 8.89543 19 10 19H14C15.1046 19 16 18.1046 16 17V16H8Z"
      fill={color}
    />
    <path
      d="M9 21C9 20.4477 9.44772 20 10 20H14C14.5523 20 15 20.4477 15 21C15 21.5523 14.5523 22 14 22H10C9.44772 22 9 21.5523 9 21Z"
      fill={color}
    />
  </svg>
);
