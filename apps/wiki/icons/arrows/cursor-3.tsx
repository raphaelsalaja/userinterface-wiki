import type { IconProps } from "@/icons/types";

export const Cursor3Icon = ({
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
    <title>Cursor 3</title>
    <path
      d="M5.30434 2.75272C3.71956 2.19338 2.19338 3.71955 2.75272 5.30434L7.52872 18.8363C8.01845 20.2239 9.78842 20.6254 10.8289 19.5849L12.4998 17.914L16.0856 21.4998C16.8666 22.2809 18.133 22.2809 18.914 21.4998L21.4998 18.914C22.2809 18.133 22.2809 16.8666 21.4998 16.0856L17.914 12.4998L19.5849 10.8289C20.6254 9.78843 20.2239 8.01846 18.8363 7.52872L5.30434 2.75272Z"
      fill={color}
    />
  </svg>
);
