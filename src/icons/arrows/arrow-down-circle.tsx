import type { IconProps } from "@/icons/types";

export const ArrowDownCircleIcon = ({
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
    <title>Arrow Down Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM15.7071 13.7071C16.0976 13.3166 16.0976 12.6834 15.7071 12.2929C15.3166 11.9024 14.6834 11.9024 14.2929 12.2929L13 13.5858V8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V13.5858L9.70711 12.2929C9.31658 11.9024 8.68342 11.9024 8.29289 12.2929C7.90237 12.6834 7.90237 13.3166 8.29289 13.7071L11.2929 16.7071C11.6834 17.0976 12.3166 17.0976 12.7071 16.7071L15.7071 13.7071Z"
      fill={color}
    />
  </svg>
);
