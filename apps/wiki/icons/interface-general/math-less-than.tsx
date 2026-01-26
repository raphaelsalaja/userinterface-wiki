import type { IconProps } from "@/icons/types";

export const MathLessThanIcon = ({
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
    <title>Math Less Than</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.9228 6.61565C18.7104 6.10584 18.1249 5.86477 17.6151 6.07718L5.61514 11.0772C5.24249 11.2325 4.99976 11.5966 4.99976 12.0003C4.99976 12.404 5.24249 12.7681 5.61514 12.9233L17.6151 17.9233C18.1249 18.1358 18.7104 17.8947 18.9228 17.3849C19.1353 16.8751 18.8942 16.2896 18.3844 16.0772L8.59976 12.0003L18.3844 7.92334C18.8942 7.71092 19.1353 7.12545 18.9228 6.61565Z"
      fill={color}
    />
  </svg>
);
