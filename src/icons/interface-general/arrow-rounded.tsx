import type { IconProps } from "@/icons/types";

export const ArrowRoundedIcon = ({
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
    <title>Arrow Rounded</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.7929 3.79289C16.1834 3.40237 16.8166 3.40237 17.2071 3.79289L20.7071 7.29289C21.0976 7.68342 21.0976 8.31658 20.7071 8.70711L17.2071 12.2071C16.8166 12.5976 16.1834 12.5976 15.7929 12.2071C15.4024 11.8166 15.4024 11.1834 15.7929 10.7929L17.5858 9H13C10.7909 9 9 10.7909 9 13V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V13C7 9.68629 9.68629 7 13 7H17.5858L15.7929 5.20711C15.4024 4.81658 15.4024 4.18342 15.7929 3.79289ZM3 7C3.55228 7 4 7.44772 4 8V17C4 17.5523 4.44772 18 5 18H19C19.5523 18 20 18.4477 20 19C20 19.5523 19.5523 20 19 20H5C3.34315 20 2 18.6569 2 17V8C2 7.44772 2.44772 7 3 7Z"
      fill={color}
    />
  </svg>
);
