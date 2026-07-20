import type { IconProps } from "@/icons/types";

export const ArrowCornerUpRightIcon = ({
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
    <title>Arrow Corner Up Right</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.2929 4.29289C15.6834 3.90237 16.3166 3.90237 16.7071 4.29289L20.7071 8.29289C21.0976 8.68342 21.0976 9.31658 20.7071 9.70711L16.7071 13.7071C16.3166 14.0976 15.6834 14.0976 15.2929 13.7071C14.9024 13.3166 14.9024 12.6834 15.2929 12.2929L17.5858 10H6C5.44772 10 5 10.4477 5 11V19C5 19.5523 4.55228 20 4 20C3.44772 20 3 19.5523 3 19V11C3 9.34315 4.34315 8 6 8H17.5858L15.2929 5.70711C14.9024 5.31658 14.9024 4.68342 15.2929 4.29289Z"
      fill={color}
    />
  </svg>
);
