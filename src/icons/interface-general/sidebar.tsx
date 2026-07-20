import type { IconProps } from "@/icons/types";

export const SidebarIcon = ({
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
    <title>Sidebar</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5 4C3.34315 4 2 5.34315 2 7V17C2 18.6569 3.34315 20 5 20H19C20.6569 20 22 18.6569 22 17V7C22 5.34315 20.6569 4 19 4H5ZM4 7C4 6.44772 4.44772 6 5 6H10V18H5C4.44772 18 4 17.5523 4 17V7Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 10C6.30964 10 5.75 9.44036 5.75 8.75C5.75 8.05964 6.30964 7.5 7 7.5C7.69036 7.5 8.25 8.05964 8.25 8.75C8.25 9.44036 7.69036 10 7 10ZM7 13.25C6.30964 13.25 5.75 12.6904 5.75 12C5.75 11.3096 6.30964 10.75 7 10.75C7.69036 10.75 8.25 11.3096 8.25 12C8.25 12.6904 7.69036 13.25 7 13.25ZM7 16.5C6.30964 16.5 5.75 15.9404 5.75 15.25C5.75 14.5596 6.30964 14 7 14C7.69036 14 8.25 14.5596 8.25 15.25C8.25 15.9404 7.69036 16.5 7 16.5Z"
      fill={color}
    />
  </svg>
);
