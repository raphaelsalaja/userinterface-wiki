import type { IconProps } from "@/icons/types";

export const FramerIcon = ({
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
    <title>Framer</title>
    <path d="M18.6693 2V8.66667H12.0026L5.33598 2H18.6693Z" fill={color} />
    <path
      d="M5.33594 8.66667H12.0026L18.6693 15.3333H12.0026V22L5.33594 15.3333V8.66667Z"
      fill={color}
    />
  </svg>
);
