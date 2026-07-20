import type { IconProps } from "@/icons/types";

export const CircleBanSignIcon = ({
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
    <title>Circle Ban Sign</title>
    <path
      d="M2 12C2 6.47715 6.47715 2 12 2C14.4013 2 16.6049 2.84637 18.3287 4.25705L4.25705 18.3287C2.84637 16.6049 2 14.4013 2 12Z"
      fill={color}
    />
    <path
      d="M5.67127 19.7429C7.39514 21.1536 9.59873 22 12 22C17.5228 22 22 17.5228 22 12C22 9.59873 21.1536 7.39514 19.7429 5.67127L5.67127 19.7429Z"
      fill={color}
    />
  </svg>
);
