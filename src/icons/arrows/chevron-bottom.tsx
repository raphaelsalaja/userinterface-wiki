import type { IconProps } from "@/icons/types";

export const ChevronBottomIcon = ({
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
    <title>Chevron Bottom</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.29289 8.29289C3.68342 7.90237 4.31658 7.90237 4.70711 8.29289L11.2929 14.8787C11.6834 15.2692 12.3166 15.2692 12.7071 14.8787L19.2929 8.29289C19.6834 7.90237 20.3166 7.90237 20.7071 8.29289C21.0976 8.68342 21.0976 9.31658 20.7071 9.70711L14.1213 16.2929C12.9498 17.4645 11.0503 17.4645 9.8787 16.2929L3.29289 9.70711C2.90237 9.31658 2.90237 8.68342 3.29289 8.29289Z"
      fill={color}
    />
  </svg>
);
