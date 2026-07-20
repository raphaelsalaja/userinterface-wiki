import type { IconProps } from "@/icons/types";

export const ShredderIcon = ({
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
    <title>Shredder</title>
    <path
      d="M7 2C5.34315 2 4 3.34226 4 4.99912C4 6.96714 4 9.30136 4 10H20C20 9.30136 20 6.96714 20 4.99912C20 3.34226 18.6569 2 17 2H7Z"
      fill={color}
    />
    <path
      d="M3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H21C21.5523 14 22 13.5523 22 13C22 12.4477 21.5523 12 21 12H3Z"
      fill={color}
    />
    <path
      d="M7 17C7 16.4477 6.55228 16 6 16C5.44772 16 5 16.4477 5 17V19C5 19.5523 5.44772 20 6 20C6.55228 20 7 19.5523 7 19V17Z"
      fill={color}
    />
    <path
      d="M11 17C11 16.4477 10.5523 16 10 16C9.44772 16 9 16.4477 9 17V21C9 21.5523 9.44772 22 10 22C10.5523 22 11 21.5523 11 21V17Z"
      fill={color}
    />
    <path
      d="M15 17C15 16.4477 14.5523 16 14 16C13.4477 16 13 16.4477 13 17V19C13 19.5523 13.4477 20 14 20C14.5523 20 15 19.5523 15 19V17Z"
      fill={color}
    />
    <path
      d="M19 17C19 16.4477 18.5523 16 18 16C17.4477 16 17 16.4477 17 17V21C17 21.5523 17.4477 22 18 22C18.5523 22 19 21.5523 19 21V17Z"
      fill={color}
    />
  </svg>
);
