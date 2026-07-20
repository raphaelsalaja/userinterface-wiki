import type { IconProps } from "@/icons/types";

export const NpmIcon = ({
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
    <title>Npm</title>
    <path d="M3 21H12V7.5H16.5V21H21V3H3V21Z" fill={color} />
  </svg>
);
