import type { IconProps } from "@/icons/types";

export const ThumbtackIcon = ({
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
    <title>Thumbtack</title>
    <path
      d="M9.5 2C7.84315 2 6.5 3.34315 6.5 5V7.2289C6.5 8.73799 5.90052 10.1853 4.83343 11.2524C4.29979 11.786 4 12.5098 4 13.2644V15C4 15.5523 4.44772 16 5 16H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V16H19C19.5523 16 20 15.5523 20 15V13.2644C20 12.5098 19.7002 11.786 19.1666 11.2524C18.0995 10.1853 17.5 8.73799 17.5 7.2289V5C17.5 3.34315 16.1569 2 14.5 2H9.5Z"
      fill={color}
    />
  </svg>
);
