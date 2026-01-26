import type { IconProps } from "@/icons/types";

export const CentralIconSystemIcon = ({
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
    <title>Central Icon System</title>
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.0751 22 21.2672 18.2193 21.9136 13.3208H15.5849L12 16.9057L7.09434 12L12 7.09434L15.5849 10.6792H21.9136C21.2672 5.78066 17.0751 2 12 2Z"
      fill={color}
    />
  </svg>
);
