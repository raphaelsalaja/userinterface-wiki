import type { IconProps } from "@/icons/types";

export const MathGreaterThanIcon = ({
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
    <title>Math Greater Than</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.07694 6.61565C5.28936 6.10584 5.87483 5.86477 6.38463 6.07718L18.3846 11.0772C18.7573 11.2325 19 11.5966 19 12.0003C19 12.404 18.7573 12.7681 18.3846 12.9233L6.38463 17.9233C5.87483 18.1358 5.28936 17.8947 5.07694 17.3849C4.86452 16.8751 5.1056 16.2896 5.6154 16.0772L15.4 12.0003L5.6154 7.92334C5.1056 7.71092 4.86452 7.12545 5.07694 6.61565Z"
      fill={color}
    />
  </svg>
);
