import type { IconProps } from "@/icons/types";

export const ChevronRightMediumIcon = ({
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
    <title>Chevron Right Medium</title>
    <path
      d="M8.79289 5.29289C9.18342 4.90237 9.81643 4.90237 10.207 5.29289L16.207 11.2929C16.5975 11.6834 16.5975 12.3164 16.207 12.707L10.207 18.707C9.81643 19.0975 9.18342 19.0975 8.79289 18.707C8.40237 18.3164 8.40237 17.6834 8.79289 17.2929L14.0859 11.9999L8.79289 6.70696C8.40237 6.31643 8.40237 5.68342 8.79289 5.29289Z"
      fill={color}
    />
  </svg>
);
