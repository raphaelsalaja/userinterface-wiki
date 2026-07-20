import type { IconProps } from "@/icons/types";

export const ArrowCornerLeftDownIcon = ({
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
    <title>Arrow Corner Left Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 6C8 4.34315 9.34315 3 11 3H19C19.5523 3 20 3.44772 20 4C20 4.55228 19.5523 5 19 5H11C10.4477 5 10 5.44772 10 6V17.5858L12.2929 15.2929C12.6834 14.9024 13.3166 14.9024 13.7071 15.2929C14.0976 15.6834 14.0976 16.3166 13.7071 16.7071L9.70711 20.7071C9.31658 21.0976 8.68342 21.0976 8.29289 20.7071L4.29289 16.7071C3.90237 16.3166 3.90237 15.6834 4.29289 15.2929C4.68342 14.9024 5.31658 14.9024 5.70711 15.2929L8 17.5858V6Z"
      fill={color}
    />
  </svg>
);
