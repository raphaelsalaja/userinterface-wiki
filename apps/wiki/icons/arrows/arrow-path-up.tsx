import type { IconProps } from "@/icons/types";

export const ArrowPathUpIcon = ({
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
    <title>Arrow Path Up</title>
    <path
      d="M4.41499 8.53991C3.60083 9.51689 4.29556 11.0002 5.56732 11.0002H7.9998V19.0002C7.9998 20.657 9.34294 22.0002 10.9998 22.0002H12.9998C14.6567 22.0002 15.9998 20.657 15.9998 19.0002V11.0002H18.4323C19.704 11.0002 20.3988 9.5169 19.5846 8.53991L13.9204 1.7428C12.9209 0.543418 11.0787 0.543412 10.0792 1.7428L4.41499 8.53991Z"
      fill={color}
    />
  </svg>
);
