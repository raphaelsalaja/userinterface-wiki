import type { IconProps } from "@/icons/types";

export const ArrowTriangleBottomIcon = ({
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
    <title>Arrow Triangle Bottom</title>
    <path
      d="M4.31851 8.33576C3.32312 6.34424 4.77047 4 6.99765 4H17.0019C19.2291 4 20.6764 6.34425 19.6811 8.33576L14.6789 18.3437C13.5751 20.5521 10.4244 20.5521 9.32065 18.3437L4.31851 8.33576Z"
      fill={color}
    />
  </svg>
);
