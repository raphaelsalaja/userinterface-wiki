import type { IconProps } from "@/icons/types";

export const StepForwardsIcon = ({
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
    <title>Step Forwards</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2929 2.29289C16.6834 1.90237 17.3166 1.90237 17.7071 2.29289L20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L17.7071 9.70711C17.3166 10.0976 16.6834 10.0976 16.2929 9.70711C15.9024 9.31658 15.9024 8.68342 16.2929 8.29289L17.5858 7H10.5C7.46243 7 5 9.46243 5 12.5C5 15.5376 7.46243 18 10.5 18H18C18.5523 18 19 18.4477 19 19C19 19.5523 18.5523 20 18 20H10.5C6.35786 20 3 16.6421 3 12.5C3 8.35786 6.35786 5 10.5 5H17.5858L16.2929 3.70711C15.9024 3.31658 15.9024 2.68342 16.2929 2.29289Z"
      fill={color}
    />
  </svg>
);
