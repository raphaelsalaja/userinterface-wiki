import type { IconProps } from "@/icons/types";

export const Window2Icon = ({
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
    <title>Window 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 4C3.34315 4 2 5.34315 2 7V10H22V7C22 5.34315 20.6569 4 19 4H5ZM6 6C5.44772 6 5 6.44772 5 7C5 7.55228 5.44772 8 6 8C6.55228 8 7 7.55228 7 7C7 6.44772 6.55228 6 6 6ZM8 7C8 6.44772 8.44772 6 9 6C9.55228 6 10 6.44772 10 7C10 7.55228 9.55228 8 9 8C8.44772 8 8 7.55228 8 7ZM12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6Z"
      fill={color}
    />
    <path
      d="M2 17V12H22V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17Z"
      fill={color}
    />
  </svg>
);
