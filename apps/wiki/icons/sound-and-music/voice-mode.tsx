import type { IconProps } from "@/icons/types";

export const VoiceModeIcon = ({
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
    <title>Voice Mode</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 11C12.7614 11 15 13.2386 15 16C15 18.7614 12.7614 21 10 21H6.5C3.73858 21 1.5 18.7614 1.5 16C1.5 13.2386 3.73858 11 6.5 11H10ZM10 14C8.89543 14 8 14.8954 8 16C8 17.1046 8.89543 18 10 18C11.1046 18 12 17.1046 12 16C12 14.8954 11.1046 14 10 14Z"
      fill={color}
    />
    <path
      d="M17.5 3C18.0523 3 18.5 3.44772 18.5 4V16C18.5 16.5523 18.0523 17 17.5 17C16.9477 17 16.5 16.5523 16.5 16V4C16.5 3.44772 16.9477 3 17.5 3Z"
      fill={color}
    />
    <path
      d="M21 8C21.5523 8 22 8.44772 22 9V11C22 11.5523 21.5523 12 21 12C20.4477 12 20 11.5523 20 11V9C20 8.44772 20.4477 8 21 8Z"
      fill={color}
    />
    <path
      d="M14 6C14.5523 6 15 6.44772 15 7V9.25C15 9.80228 14.5523 10.25 14 10.25C13.4477 10.25 13 9.80228 13 9.25V7C13 6.44772 13.4477 6 14 6Z"
      fill={color}
    />
    <path
      d="M10.5 4C11.0523 4 11.5 4.44772 11.5 5V8C11.5 8.55228 11.0523 9 10.5 9C9.94771 9 9.5 8.55228 9.5 8V5C9.5 4.44772 9.94771 4 10.5 4Z"
      fill={color}
    />
  </svg>
);
