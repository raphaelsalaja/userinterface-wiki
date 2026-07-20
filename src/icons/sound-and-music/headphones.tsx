import type { IconProps } from "@/icons/types";

export const HeadphonesIcon = ({
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
    <title>Headphones</title>
    <path
      d="M5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12V13H18C16.3431 13 15 14.3431 15 16V18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18V12C21 7.36745 17.5 3.55237 13 3.05493V3H12C7.02944 3 3 7.02944 3 12V18C3 19.6569 4.34315 21 6 21C7.65685 21 9 19.6569 9 18V16C9 14.3431 7.65685 13 6 13H5V12Z"
      fill={color}
    />
  </svg>
);
