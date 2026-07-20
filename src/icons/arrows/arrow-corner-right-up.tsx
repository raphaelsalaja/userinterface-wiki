import type { IconProps } from "@/icons/types";

export const ArrowCornerRightUpIcon = ({
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
    <title>Arrow Corner Right Up</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.2929 3.29289C14.6834 2.90237 15.3166 2.90237 15.7071 3.29289L19.7071 7.29289C20.0976 7.68342 20.0976 8.31658 19.7071 8.70711C19.3166 9.09763 18.6834 9.09763 18.2929 8.70711L16 6.41421V18C16 19.6569 14.6569 21 13 21H5C4.44772 21 4 20.5523 4 20C4 19.4477 4.44772 19 5 19H13C13.5523 19 14 18.5523 14 18V6.41421L11.7071 8.70711C11.3166 9.09763 10.6834 9.09763 10.2929 8.70711C9.90237 8.31658 9.90237 7.68342 10.2929 7.29289L14.2929 3.29289Z"
      fill={color}
    />
  </svg>
);
