import type { IconProps } from "@/icons/types";

export const VocalMicrophoneIcon = ({
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
    <title>Vocal Microphone</title>
    <path
      d="M14.4998 13.5L6.40897 20.6543C5.61725 21.3543 4.4171 21.3175 3.66972 20.5703L3.42948 20.3301C2.68213 19.5827 2.64539 18.3826 3.3455 17.5908L10.4998 9.5L14.4998 13.5Z"
      fill={color}
    />
    <path
      d="M16.4998 2.5C19.2611 2.50015 21.4998 4.73867 21.4998 7.5C21.4998 10.2613 19.2611 12.4999 16.4998 12.5C16.3003 12.5 16.1033 12.4885 15.91 12.4658L11.534 8.08984C11.5112 7.89639 11.4998 7.69956 11.4998 7.5C11.4998 4.73858 13.7384 2.5 16.4998 2.5Z"
      fill={color}
    />
  </svg>
);
