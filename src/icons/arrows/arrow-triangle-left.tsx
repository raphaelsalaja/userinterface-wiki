import type { IconProps } from "@/icons/types";

export const ArrowTriangleLeftIcon = ({
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
    <title>Arrow Triangle Left</title>
    <path
      d="M15.6642 4.31803C17.6558 3.32264 20 4.76998 20 6.99716V17.0014C20 19.2286 17.6558 20.676 15.6642 19.6806L5.65629 14.6784C3.4479 13.5746 3.4479 10.4239 5.65629 9.32016L15.6642 4.31803Z"
      fill={color}
    />
  </svg>
);
