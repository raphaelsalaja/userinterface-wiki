import type { IconProps } from "@/icons/types";

export const LightBulbSimpleIcon = ({
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
    <title>Light Bulb Simple</title>
    <path
      d="M4 10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10C20 12.9113 18.4443 15.4582 16.1237 16.8565C16.0827 16.8812 16.0415 16.9056 16 16.9296V17H8V16.9296C7.95853 16.9056 7.9173 16.8812 7.87631 16.8565C5.55568 15.4582 4 12.9113 4 10Z"
      fill={color}
    />
    <path
      d="M8 19C8 21.2091 9.79086 23 12 23C14.2091 23 16 21.2091 16 19H8Z"
      fill={color}
    />
  </svg>
);
