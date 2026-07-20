import type { IconProps } from "@/icons/types";

export const UnarchivIcon = ({
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
    <title>Unarchiv</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.78087 2.37534C10.1259 2.8066 10.056 3.4359 9.62469 3.78091L6.85078 6.00004H17.1492L14.3753 3.78091C13.944 3.4359 13.8741 2.8066 14.2191 2.37534C14.5641 1.94408 15.1934 1.87416 15.6247 2.21917L20.6247 6.21917C20.8619 6.40894 21 6.69625 21 7.00004V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V7.00004C3 6.69625 3.13809 6.40894 3.3753 6.21917L8.37531 2.21917C8.80657 1.87416 9.43586 1.94408 9.78087 2.37534ZM9 11C9 10.4478 9.44772 10 10 10H14C14.5523 10 15 10.4478 15 11C15 11.5523 14.5523 12 14 12H10C9.44772 12 9 11.5523 9 11Z"
      fill={color}
    />
  </svg>
);
