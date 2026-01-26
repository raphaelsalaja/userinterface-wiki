import type { IconProps } from "@/icons/types";

export const ArrowCornerRightDownIcon = ({
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
    <title>Arrow Corner Right Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C4 3.44772 4.44772 3 5 3H13C14.6569 3 16 4.34315 16 6V17.5858L18.2929 15.2929C18.6834 14.9024 19.3166 14.9024 19.7071 15.2929C20.0976 15.6834 20.0976 16.3166 19.7071 16.7071L15.7071 20.7071C15.3166 21.0976 14.6834 21.0976 14.2929 20.7071L10.2929 16.7071C9.90237 16.3166 9.90237 15.6834 10.2929 15.2929C10.6834 14.9024 11.3166 14.9024 11.7071 15.2929L14 17.5858V6C14 5.44772 13.5523 5 13 5H5C4.44772 5 4 4.55228 4 4Z"
      fill={color}
    />
  </svg>
);
