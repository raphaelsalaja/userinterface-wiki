import type { IconProps } from "@/icons/types";

export const Box2Icon = ({
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
    <title>Box 2</title>
    <path
      d="M6.00004 3.00001L18 3C19.6569 3 21 4.34315 21 6V12H15.874C15.4177 12 15.0193 12.3089 14.9056 12.7507C14.5725 14.0449 13.3965 15 12 15C10.6035 15 9.42755 14.0449 9.09446 12.7507C8.98073 12.3089 8.58231 12 8.12603 12H3.00003L3.00004 6C3.00004 4.34315 4.34319 3.00001 6.00004 3.00001Z"
      fill={color}
    />
    <path
      d="M21 14V18C21 19.6569 19.6569 21 18 21H6C4.34314 21 2.99999 19.6569 3 18L3.00003 12V14H7.41638C8.18784 15.7655 9.94878 17 12 17C14.0512 17 15.8122 15.7655 16.5836 14H21Z"
      fill={color}
    />
  </svg>
);
