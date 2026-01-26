import type { IconProps } from "@/icons/types";

export const CircleArrowDownIcon = ({
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
    <title>Circle Arrow Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9 17C8.44771 17 8 16.5523 8 16C8 15.4477 8.44771 15 9 15H15C15.5523 15 16 15.4477 16 16C16 16.5523 15.5523 17 15 17H9ZM14.7071 11.7071L12.7071 13.7071C12.3166 14.0976 11.6834 14.0976 11.2929 13.7071L9.29289 11.7071C8.90237 11.3166 8.90237 10.6834 9.29289 10.2929C9.68342 9.90237 10.3166 9.90237 10.7071 10.2929L11 10.5858V8C11 7.44771 11.4477 7 12 7C12.5523 7 13 7.44771 13 8V10.5858L13.2929 10.2929C13.6834 9.90237 14.3166 9.90237 14.7071 10.2929C15.0976 10.6834 15.0976 11.3166 14.7071 11.7071Z"
      fill={color}
    />
  </svg>
);
