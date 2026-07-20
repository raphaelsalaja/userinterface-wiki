import type { IconProps } from "@/icons/types";

export const TrashCanSimpleIcon = ({
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
    <title>Trash Can Simple</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.22919 5H3.5C2.94772 5 2.5 5.44772 2.5 6C2.5 6.55228 2.94772 7 3.5 7H4.03211L4.87393 19.2064C4.98241 20.7794 6.29007 22 7.86682 22H16.1332C17.7099 22 19.0176 20.7794 19.1261 19.2064L19.9679 7H20.5C21.0523 7 21.5 6.55228 21.5 6C21.5 5.44772 21.0523 5 20.5 5H16.7708C16.1335 2.97145 14.2395 1.5 12 1.5C9.76053 1.5 7.86655 2.97145 7.22919 5ZM9.40105 5H14.599C14.0801 4.10329 13.1099 3.5 12 3.5C10.8901 3.5 9.9199 4.10329 9.40105 5Z"
      fill={color}
    />
  </svg>
);
