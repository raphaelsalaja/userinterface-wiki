import type { IconProps } from "@/icons/types";

export const ArrowOutOfBoxIcon = ({
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
    <title>Arrow Out Of Box</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 13.75C4.55228 13.75 5 14.1977 5 14.75V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14.75C19 14.1977 19.4477 13.75 20 13.75C20.5523 13.75 21 14.1977 21 14.75V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V14.75C3 14.1977 3.44772 13.75 4 13.75Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L17.2071 7.79289C17.5976 8.18342 17.5976 8.81658 17.2071 9.20711C16.8166 9.59763 16.1834 9.59763 15.7929 9.20711L13 6.41421V15.25C13 15.8023 12.5523 16.25 12 16.25C11.4477 16.25 11 15.8023 11 15.25V6.41422L8.20711 9.20711C7.81658 9.59763 7.18342 9.59763 6.79289 9.20711C6.40237 8.81658 6.40237 8.18342 6.79289 7.79289L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z"
      fill={color}
    />
  </svg>
);
