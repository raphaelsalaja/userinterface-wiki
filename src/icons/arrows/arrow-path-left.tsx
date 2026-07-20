import type { IconProps } from "@/icons/types";

export const ArrowPathLeftIcon = ({
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
    <title>Arrow Path Left</title>
    <path
      d="M8.53991 4.41499C9.51689 3.60083 11.0002 4.29556 11.0002 5.56732V7.9998H19.0002C20.657 7.9998 22.0002 9.34294 22.0002 10.9998V12.9998C22.0002 14.6567 20.657 15.9998 19.0002 15.9998H11.0002V18.4323C11.0002 19.704 9.5169 20.3988 8.53991 19.5846L1.7428 13.9204C0.543418 12.9209 0.543412 11.0787 1.7428 10.0792L8.53991 4.41499Z"
      fill={color}
    />
  </svg>
);
