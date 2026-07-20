import type { IconProps } from "@/icons/types";

export const Cursor2Icon = ({
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
    <title>Cursor 2</title>
    <path
      d="M5.30434 2.75272C3.71956 2.19338 2.19338 3.71955 2.75272 5.30434L7.52872 18.8363C8.01846 20.2239 9.78843 20.6254 10.8289 19.5849L14.4998 15.914L20.2927 21.7069C20.6832 22.0974 21.3164 22.0974 21.7069 21.7069C22.0974 21.3164 22.0974 20.6832 21.7069 20.2927L15.914 14.4998L19.5849 10.8289C20.6254 9.78843 20.2239 8.01846 18.8363 7.52872L5.30434 2.75272Z"
      fill={color}
    />
  </svg>
);
