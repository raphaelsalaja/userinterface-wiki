import type { IconProps } from "./types";

export const CopyIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      {...props}
    >
      <title>Copy</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5.25C2 3.45507 3.45507 2 5.25 2H12.75C14.5449 2 16 3.45507 16 5.25V8H18.75C20.5449 8 22 9.45507 22 11.25V18.75C22 20.5449 20.5449 22 18.75 22H11.25C9.45507 22 8 20.5449 8 18.75V16H5.25C3.45507 16 2 14.5449 2 12.75V5.25ZM14 8H11.25C9.45507 8 8 9.45507 8 11.25V14H5.25C4.55964 14 4 13.4404 4 12.75V5.25C4 4.55964 4.55964 4 5.25 4H12.75C13.4404 4 14 4.55964 14 5.25V8Z"
        fill={color}
      />
    </svg>
  );
};
