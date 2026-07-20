import type { IconProps } from "@/icons/types";

export const ChevronTopMediumIcon = ({
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
    <title>Chevron Top Medium</title>
    <path
      d="M11.3691 7.72437C11.7618 7.40402 12.3408 7.42662 12.707 7.79273L18.707 13.7927C19.0975 14.1833 19.0975 14.8163 18.707 15.2068C18.3164 15.5973 17.6834 15.5973 17.2929 15.2068L11.9999 9.91383L6.70696 15.2068C6.31643 15.5973 5.68342 15.5973 5.29289 15.2068C4.90237 14.8163 4.90237 14.1833 5.29289 13.7927L11.2929 7.79273L11.3691 7.72437Z"
      fill={color}
    />
  </svg>
);
