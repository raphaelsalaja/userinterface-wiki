import type { IconProps } from "@/icons/types";

export const BellIcon = ({
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
    <title>Bell</title>
    <path
      d="M12 2C7.7922 2 4.14828 5.17264 3.70001 9.35647L3.00652 14.0627C2.7396 15.8741 4.1435 17.5 5.97447 17.5H18.0255C19.8565 17.5 21.2604 15.8741 20.9935 14.0627L20.3 9.35648C19.8517 5.17264 16.2078 2 12 2Z"
      fill={color}
    />
    <path
      d="M16.5839 19H7.41602C8.18758 20.7659 9.94966 22 12 22C14.0503 22 15.8124 20.7659 16.5839 19Z"
      fill={color}
    />
  </svg>
);
