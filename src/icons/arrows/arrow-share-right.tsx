import type { IconProps } from "@/icons/types";

export const ArrowShareRightIcon = ({
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
    <title>Arrow Share Right</title>
    <path
      d="M11.8377 4.74371C11.8377 3.20733 13.6759 2.41665 14.7912 3.4733L22.4507 10.7296C23.1793 11.4199 23.1793 12.5802 22.4507 13.2705L14.7912 20.5268C13.6759 21.5835 11.8377 20.7928 11.8377 19.2564V16.5077C8.41973 16.5617 6.51219 16.9005 5.32546 17.4405C4.12896 17.985 3.59195 18.7648 2.91905 20.0773C2.36107 21.1658 0.828569 20.6606 0.839906 19.5622C0.882522 15.431 1.53936 12.3156 3.51921 10.275C5.34936 8.38862 8.10786 7.62495 11.8377 7.51439V4.74371Z"
      fill={color}
    />
  </svg>
);
