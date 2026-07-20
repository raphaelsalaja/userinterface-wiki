import type { IconProps } from "@/icons/types";

export const ArrowLeftUpCircleIcon = ({
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
    <title>Arrow Left Up Circle</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM8 9C8 8.44772 8.44772 8 9 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H11.4142L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142V14C10 14.5523 9.55228 15 9 15C8.44772 15 8 14.5523 8 14L8 9Z"
      fill={color}
    />
  </svg>
);
