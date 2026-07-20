import type { IconProps } from "@/icons/types";

export const ChevronTopIcon = ({
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
    <title>Chevron Top</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.7071 9.12126C12.3166 8.73074 11.6834 8.73074 11.2929 9.12126L4.70711 15.707C4.31658 16.0976 3.68342 16.0976 3.29289 15.707C2.90237 15.3165 2.90237 14.6834 3.29289 14.2928L9.87866 7.70705C11.0502 6.53548 12.9497 6.53547 14.1213 7.70705L20.7071 14.2928C21.0976 14.6834 21.0976 15.3165 20.7071 15.707C20.3166 16.0976 19.6834 16.0976 19.2929 15.707L12.7071 9.12126Z"
      fill={color}
    />
  </svg>
);
