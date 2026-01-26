import type { IconProps } from "@/icons/types";

export const ArrowTriangleRightIcon = ({
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
    <title>Arrow Triangle Right</title>
    <path
      d="M8.33576 4.31803C6.34424 3.32264 4 4.76998 4 6.99716V17.0014C4 19.2286 6.34425 20.676 8.33576 19.6806L18.3437 14.6784C20.5521 13.5746 20.5521 10.4239 18.3437 9.32016L8.33576 4.31803Z"
      fill={color}
    />
  </svg>
);
