import type { IconProps } from "@/icons/types";

export const ChevronLeftMediumIcon = ({
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
    <title>Chevron Left Medium</title>
    <path
      d="M13.7929 5.29289C14.1834 4.90237 14.8164 4.90237 15.207 5.29289C15.5975 5.68342 15.5975 6.31643 15.207 6.70696L9.91399 11.9999L15.207 17.2929C15.5975 17.6834 15.5975 18.3164 15.207 18.707C14.8164 19.0975 14.1834 19.0975 13.7929 18.707L7.79289 12.707C7.40237 12.3164 7.40237 11.6834 7.79289 11.2929L13.7929 5.29289Z"
      fill={color}
    />
  </svg>
);
