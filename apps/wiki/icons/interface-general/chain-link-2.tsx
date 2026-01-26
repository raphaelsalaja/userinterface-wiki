import type { IconProps } from "@/icons/types";

export const ChainLink2Icon = ({
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
    <title>Chain Link 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 8C3.44771 8 3 8.44772 3 9V15C3 15.5523 3.44772 16 4 16H8C8.55228 16 9 16.4477 9 17C9 17.5523 8.55228 18 8 18H4C2.34315 18 1 16.6569 1 15V9C1 7.34315 2.34314 6 4 6H8C8.55228 6 9 6.44772 9 7C9 7.55228 8.55228 8 8 8H4ZM15 7C15 6.44772 15.4477 6 16 6H20C21.6569 6 23 7.34315 23 9V15C23 16.6569 21.6569 18 20 18H16C15.4477 18 15 17.5523 15 17C15 16.4477 15.4477 16 16 16H20C20.5523 16 21 15.5523 21 15V9C21 8.44772 20.5523 8 20 8H16C15.4477 8 15 7.55228 15 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12Z"
      fill={color}
    />
  </svg>
);
