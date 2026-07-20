import type { IconProps } from "@/icons/types";

export const ArrowRedoDownIcon = ({
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
    <title>Arrow Redo Down</title>
    <path
      d="M16.793 18.2929C16.4025 18.6834 16.4025 19.3166 16.793 19.7071C17.1836 20.0976 17.8167 20.0976 18.2073 19.7071L21.5002 16.4142C22.2812 15.6332 22.2812 14.3668 21.5002 13.5858L18.2073 10.2929C17.8167 9.90237 17.1836 9.90237 16.793 10.2929C16.4025 10.6834 16.4025 11.3166 16.793 11.7071L19.0859 14H7C5.34315 14 4 12.6569 4 11V10C4 8.34315 5.34315 7 7 7H12C12.5523 7 13 6.55229 13 6C13 5.44771 12.5523 5 12 5H7C4.23858 5 2 7.23858 2 10V11C2 13.7614 4.23857 16 7 16H19.0859L16.793 18.2929Z"
      fill={color}
    />
  </svg>
);
