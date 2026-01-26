import type { IconProps } from "@/icons/types";

export const ChevronRightIcon = ({
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
    <title>Chevron Right</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.29289 3.29289C8.68342 2.90237 9.31658 2.90237 9.70711 3.29289L16.2929 9.87866C17.4645 11.0502 17.4645 12.9497 16.2929 14.1213L9.70711 20.7071C9.31658 21.0976 8.68342 21.0976 8.29289 20.7071C7.90237 20.3166 7.90237 19.6834 8.29289 19.2929L14.8787 12.7071C15.2692 12.3166 15.2692 11.6834 14.8787 11.2929L8.29289 4.70711C7.90237 4.31658 7.90237 3.68342 8.29289 3.29289Z"
      fill={color}
    />
  </svg>
);
