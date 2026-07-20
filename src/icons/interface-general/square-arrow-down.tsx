import type { IconProps } from "@/icons/types";

export const SquareArrowDownIcon = ({
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
    <title>Square Arrow Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM9 17C8.44772 17 8 16.5523 8 16C8 15.4477 8.44772 15 9 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H9ZM14.7071 11.7071L12.7071 13.7071C12.3166 14.0976 11.6834 14.0976 11.2929 13.7071L9.29289 11.7071C8.90237 11.3166 8.90237 10.6834 9.29289 10.2929C9.68342 9.90237 10.3166 9.90237 10.7071 10.2929L11 10.5858V8C11 7.44771 11.4477 7 12 7C12.5523 7 13 7.44771 13 8V10.5858L13.2929 10.2929C13.6834 9.90237 14.3166 9.90237 14.7071 10.2929C15.0976 10.6834 15.0976 11.3166 14.7071 11.7071Z"
      fill={color}
    />
  </svg>
);
