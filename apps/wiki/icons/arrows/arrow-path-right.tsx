import type { IconProps } from "@/icons/types";

export const ArrowPathRightIcon = ({
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
    <title>Arrow Path Right</title>
    <path
      d="M15.4603 4.41499C14.4833 3.60083 13 4.29556 13 5.56732V7.9998H5C3.34315 7.9998 2 9.34294 2 10.9998V12.9998C2 14.6567 3.34315 15.9998 5 15.9998H13V18.4323C13 19.704 14.4833 20.3988 15.4603 19.5846L22.2574 13.9204C23.4568 12.9209 23.4568 11.0787 22.2574 10.0792L15.4603 4.41499Z"
      fill={color}
    />
  </svg>
);
