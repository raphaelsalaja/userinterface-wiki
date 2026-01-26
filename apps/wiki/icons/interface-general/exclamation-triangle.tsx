import type { IconProps } from "@/icons/types";

export const ExclamationTriangleIcon = ({
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
    <title>Exclamation Triangle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.40767 3.45763C10.5653 1.47311 13.4327 1.47311 14.5903 3.45762L21.6083 15.4884C22.7749 17.4883 21.3323 20 19.0169 20H4.98108C2.66571 20 1.22309 17.4883 2.38974 15.4884L9.40767 3.45763ZM12 8C12.5523 8 13 8.44772 13 9V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V9C11 8.44772 11.4477 8 12 8ZM10.75 15C10.75 14.3096 11.3096 13.75 12 13.75C12.6904 13.75 13.25 14.3096 13.25 15C13.25 15.6904 12.6904 16.25 12 16.25C11.3096 16.25 10.75 15.6904 10.75 15Z"
      fill={color}
    />
  </svg>
);
