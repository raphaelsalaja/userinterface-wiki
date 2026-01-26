import type { IconProps } from "@/icons/types";

export const Paperclip2Icon = ({
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
    <title>Paperclip 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 5.5C11 3.567 12.567 2 14.5 2C16.433 2 18 3.567 18 5.5V16C18 19.3137 15.3137 22 12 22C8.68629 22 6 19.3137 6 16V9C6 8.44772 6.44772 8 7 8C7.55228 8 8 8.44772 8 9V16C8 18.2091 9.79086 20 12 20C14.2091 20 16 18.2091 16 16V5.5C16 4.67157 15.3284 4 14.5 4C13.6716 4 13 4.67157 13 5.5V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V5.5Z"
      fill={color}
    />
  </svg>
);
