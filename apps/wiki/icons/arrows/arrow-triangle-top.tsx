import type { IconProps } from "@/icons/types";

export const ArrowTriangleTopIcon = ({
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
    <title>Arrow Triangle Top</title>
    <path
      d="M4.31851 15.6642C3.32312 17.6558 4.77047 20 6.99765 20H17.0019C19.2291 20 20.6764 17.6558 19.6811 15.6642L14.6789 5.65629C13.5751 3.4479 10.4244 3.4479 9.32065 5.65629L4.31851 15.6642Z"
      fill={color}
    />
  </svg>
);
