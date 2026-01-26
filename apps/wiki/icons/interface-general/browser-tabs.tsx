import type { IconProps } from "@/icons/types";

export const BrowserTabsIcon = ({
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
    <title>Browser Tabs</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 4C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V7C2 5.34315 3.34315 4 5 4H19ZM6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H6ZM14 7C13.4477 7 13 7.44772 13 8C13 8.55228 13.4477 9 14 9H14.5C15.0523 9 15.5 8.55228 15.5 8C15.5 7.44772 15.0523 7 14.5 7H14ZM17.5 7C16.9477 7 16.5 7.44772 16.5 8C16.5 8.55228 16.9477 9 17.5 9H18C18.5523 9 19 8.55228 19 8C19 7.44772 18.5523 7 18 7H17.5Z"
      fill={color}
    />
  </svg>
);
