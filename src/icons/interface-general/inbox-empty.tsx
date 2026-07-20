import type { IconProps } from "@/icons/types";

export const InboxEmptyIcon = ({
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
    <title>Inbox Empty</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.55592 5.51158C5.09004 4.57686 6.08407 4 7.16065 4H16.8394C17.9159 4 18.91 4.57686 19.4441 5.51158L22.6047 11.0427C22.8638 11.496 23 12.009 23 12.5311V17C23 18.6569 21.6569 20 20 20H4C2.34315 20 1 18.6569 1 17V12.5311C1 12.009 1.13625 11.496 1.39527 11.0427L4.55592 5.51158ZM21 13H16.5C16.1852 13 15.8889 13.1482 15.7 13.4L15.4 13.8C14.8334 14.5554 13.9443 15 13 15H11C10.0557 15 9.16656 14.5554 8.6 13.8L8.3 13.4C8.11115 13.1482 7.81476 13 7.5 13H3V17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V13Z"
      fill={color}
    />
  </svg>
);
