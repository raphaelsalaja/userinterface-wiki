import type { IconProps } from "@/icons/types";

export const SquareCursorIcon = ({
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
    <title>Square Cursor</title>
    <path
      d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V10C21 10.5523 20.5523 11 20 11C19.4477 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H6C5.44772 5 5 5.44772 5 6V18C5 18.5523 5.44772 19 6 19H10C10.5523 19 11 19.4477 11 20C11 20.5523 10.5523 21 10 21H6C4.34315 21 3 19.6569 3 18V6Z"
      fill={color}
    />
    <path
      d="M12.8454 11.0089C11.7297 10.7096 10.7086 11.7307 11.0079 12.8463L13.2212 21.0959C13.5672 22.3856 15.2991 22.6143 15.9681 21.4588L17.981 17.982L21.4578 15.9691C22.6134 15.3001 22.3846 13.5682 21.0949 13.2222L12.8454 11.0089Z"
      fill={color}
    />
  </svg>
);
