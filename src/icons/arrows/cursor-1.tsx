import type { IconProps } from "@/icons/types";

export const Cursor1Icon = ({
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
    <title>Cursor 1</title>
    <path
      d="M5.30471 2.71891C3.70011 2.15583 2.15681 3.69913 2.71989 5.30373L8.11084 20.6663C8.72299 22.4108 11.1593 22.4931 11.8879 20.794L14.561 14.56L20.795 11.8869C22.4941 11.1584 22.4118 8.72201 20.6673 8.10986L5.30471 2.71891Z"
      fill={color}
    />
  </svg>
);
