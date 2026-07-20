import type { IconProps } from "@/icons/types";

export const ShareArrowDownIcon = ({
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
    <title>Share Arrow Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V4H6C4.34315 4 3 5.34315 3 7V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V7C21 5.34315 19.6569 4 18 4H13V2ZM13 4H11V12.0858L9.20711 10.2929C8.81658 9.90237 8.18342 9.90237 7.79289 10.2929C7.40237 10.6834 7.40237 11.3166 7.79289 11.7071L11.2929 15.2071C11.6834 15.5976 12.3166 15.5976 12.7071 15.2071L16.2071 11.7071C16.5976 11.3166 16.5976 10.6834 16.2071 10.2929C15.8166 9.90237 15.1834 9.90237 14.7929 10.2929L13 12.0858V4Z"
      fill={color}
    />
  </svg>
);
