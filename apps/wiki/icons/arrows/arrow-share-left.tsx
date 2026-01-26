import type { IconProps } from "@/icons/types";

export const ArrowShareLeftIcon = ({
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
    <title>Arrow Share Left</title>
    <path
      d="M11.9993 4.74371C11.9993 3.20733 10.1611 2.41665 9.04577 3.4733L1.38629 10.7296C0.657697 11.4199 0.657693 12.5802 1.38629 13.2705L9.04577 20.5268C10.1611 21.5835 11.9993 20.7928 11.9993 19.2564V16.5077C15.4173 16.5617 17.3248 16.9005 18.5115 17.4405C19.708 17.985 20.2451 18.7648 20.918 20.0773C21.4759 21.1658 23.0084 20.6606 22.9971 19.5622C22.9545 15.431 22.2976 12.3156 20.3178 10.275C18.4876 8.38862 15.7291 7.62495 11.9993 7.51439V4.74371Z"
      fill={color}
    />
  </svg>
);
