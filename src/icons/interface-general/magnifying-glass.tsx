import type { IconProps } from "@/icons/types";

export const MagnifyingGlassIcon = ({
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
    <title>Magnifying Glass</title>
    <path
      d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 20L16.05 16.05"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
