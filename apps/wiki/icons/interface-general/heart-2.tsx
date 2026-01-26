import type { IconProps } from "@/icons/types";

export const Heart2Icon = ({
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
    <title>Heart 2</title>
    <path
      d="M12.4894 21.3725C21.0173 16.5927 23.1154 10.9028 21.5112 6.90294C20.7324 4.96087 19.0977 3.56916 17.1696 3.13926C15.4721 2.76077 13.617 3.14222 12.0004 4.42553C10.3838 3.14222 8.52876 2.76077 6.83124 3.13927C4.90318 3.56917 3.26845 4.96089 2.48959 6.90295C0.885443 10.9029 2.98361 16.5927 11.5115 21.3725C11.8153 21.5428 12.1857 21.5428 12.4894 21.3725Z"
      fill={color}
    />
  </svg>
);
