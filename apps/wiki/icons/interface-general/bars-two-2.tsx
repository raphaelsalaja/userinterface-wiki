import type { IconProps } from "@/icons/types";

export const BarsTwo2Icon = ({
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
    <title>Bars Two 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 7C2 6.44772 2.44772 6 3 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H3C2.44772 8 2 7.55228 2 7ZM2 17C2 16.4477 2.44772 16 3 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H3C2.44772 18 2 17.5523 2 17Z"
      fill={color}
    />
  </svg>
);
