import type { IconProps } from "@/icons/types";

export const CompassSquareIcon = ({
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
    <title>Compass Square</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM14.5243 8.24786C15.2708 8.04427 15.9558 8.72924 15.7522 9.47574L14.6327 13.5803C14.493 14.0927 14.0927 14.493 13.5803 14.6327L9.47574 15.7522C8.72924 15.9558 8.04427 15.2708 8.24786 14.5243L9.36728 10.4197C9.50703 9.90733 9.90733 9.50703 10.4197 9.36728L14.5243 8.24786Z"
      fill={color}
    />
  </svg>
);
