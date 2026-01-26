import type { IconProps } from "@/icons/types";

export const SubstackIcon = ({
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
    <title>Substack</title>
    <path d="M19.9993 7.11905H4V9.28019H19.9993V7.11905Z" fill={color} />
    <path
      d="M4 11.2381V21.286L11.9993 16.7986L20 21.286V11.2381H4Z"
      fill={color}
    />
    <path d="M19.9993 3H4V5.16078H19.9993V3Z" fill={color} />
  </svg>
);
