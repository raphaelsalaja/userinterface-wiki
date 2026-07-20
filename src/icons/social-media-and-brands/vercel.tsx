import type { IconProps } from "@/icons/types";

export const VercelIcon = ({
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
    <title>Vercel</title>
    <path
      d="M11.8632 2.17999L22.7264 20.9958H1L11.8632 2.17999Z"
      fill={color}
    />
  </svg>
);
