import type { IconProps } from "@/icons/types";

export const ArrowPathDownIcon = ({
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
    <title>Arrow Path Down</title>
    <path
      d="M4.41499 15.4606C3.60083 14.4836 4.29556 13.0003 5.56732 13.0003H7.9998V5.0003C7.9998 3.34345 9.34294 2.0003 10.9998 2.0003H12.9998C14.6567 2.0003 15.9998 3.34345 15.9998 5.0003V13.0003H18.4323C19.704 13.0003 20.3988 14.4836 19.5846 15.4606L13.9204 22.2577C12.9209 23.4571 11.0787 23.4571 10.0792 22.2577L4.41499 15.4606Z"
      fill={color}
    />
  </svg>
);
