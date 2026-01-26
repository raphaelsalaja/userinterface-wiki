import type { IconProps } from "@/icons/types";

export const VolumeDownIcon = ({
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
    <title>Volume Down</title>
    <path
      d="M10.6 3.30004C11.5889 2.5584 13 3.26397 13 4.50004V19.5C13 20.7361 11.5889 21.4417 10.6 20.7L5.93333 17.2C5.76024 17.0702 5.5497 17 5.33333 17H4C2.34315 17 1 15.6569 1 14V10C1 8.34318 2.34315 7.00004 4 7.00004H5.33333C5.5497 7.00004 5.76024 6.92986 5.93333 6.80004L10.6 3.30004Z"
      fill={color}
    />
    <path
      d="M15 12C15 11.4477 15.4477 11 16 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H16C15.4477 13 15 12.5523 15 12Z"
      fill={color}
    />
  </svg>
);
