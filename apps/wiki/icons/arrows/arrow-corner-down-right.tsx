import type { IconProps } from "@/icons/types";

export const ArrowCornerDownRightIcon = ({
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
    <title>Arrow Corner Down Right</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C4.55228 4 5 4.44772 5 5V13C5 13.5523 5.44772 14 6 14H17.5858L15.2929 11.7071C14.9024 11.3166 14.9024 10.6834 15.2929 10.2929C15.6834 9.90237 16.3166 9.90237 16.7071 10.2929L20.7071 14.2929C21.0976 14.6834 21.0976 15.3166 20.7071 15.7071L16.7071 19.7071C16.3166 20.0976 15.6834 20.0976 15.2929 19.7071C14.9024 19.3166 14.9024 18.6834 15.2929 18.2929L17.5858 16H6C4.34315 16 3 14.6569 3 13V5C3 4.44772 3.44772 4 4 4Z"
      fill={color}
    />
  </svg>
);
