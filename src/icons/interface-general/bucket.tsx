import type { IconProps } from "@/icons/types";

export const BucketIcon = ({
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
    <title>Bucket</title>
    <path
      d="M3.61439 9L4.78838 18.3728C4.97639 19.8738 6.25244 21 7.76513 21H16.2349C17.7476 21 19.0236 19.8738 19.2116 18.3729L20.3857 9H3.61439Z"
      fill={color}
    />
    <path
      d="M3 3C2.44772 3 2 3.44772 2 4V6C2 6.55228 2.44772 7 3 7H21C21.5523 7 22 6.55228 22 6V4C22 3.44772 21.5523 3 21 3H3Z"
      fill={color}
    />
  </svg>
);
