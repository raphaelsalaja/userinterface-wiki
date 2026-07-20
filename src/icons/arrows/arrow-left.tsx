import type { IconProps } from "@/icons/types";

export const ArrowLeftIcon = ({
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
    <title>Arrow Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.0607 18.5607C10.4749 19.1464 9.52513 19.1464 8.93934 18.5607L3.43934 13.0607C3.15804 12.7794 3 12.3978 3 12C3 11.6022 3.15803 11.2207 3.43934 10.9394L8.93934 5.43934C9.52512 4.85355 10.4749 4.85355 11.0607 5.43934C11.6464 6.02512 11.6464 6.97487 11.0607 7.56066L8.12131 10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H8.12133L11.0607 16.4393C11.6464 17.0251 11.6464 17.9749 11.0607 18.5607Z"
      fill={color}
    />
  </svg>
);
