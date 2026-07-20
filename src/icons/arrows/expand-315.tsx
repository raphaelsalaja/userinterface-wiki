import type { IconProps } from "@/icons/types";

export const Expand315Icon = ({
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
    <title>Expand 315</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 4C11 3.44772 10.5523 3 10 3H4C3.44772 3 3 3.44772 3 4V10C3 10.5523 3.44772 11 4 11C4.55229 11 5 10.5523 5 10V6.41421L9.29289 10.7071C9.68342 11.0976 10.3166 11.0976 10.7071 10.7071C11.0976 10.3166 11.0976 9.68342 10.7071 9.29289L6.41421 5H10C10.5523 5 11 4.55228 11 4ZM20 13C19.4477 13 19 13.4477 19 14V17.5858L14.7071 13.2929C14.3166 12.9024 13.6834 12.9024 13.2929 13.2929C12.9024 13.6834 12.9024 14.3166 13.2929 14.7071L17.5858 19H14C13.4477 19 13 19.4477 13 20C13 20.5523 13.4477 21 14 21H20C20.5523 21 21 20.5523 21 20V14C21 13.4477 20.5523 13 20 13Z"
      fill={color}
    />
  </svg>
);
