import type { IconProps } from "@/icons/types";

export const FastForwardIcon = ({
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
    <title>Fast Forward</title>
    <path
      d="M4 7.20409C4 5.48577 6.02384 4.56741 7.31701 5.69893L12 9.79655V7.20409C12 5.48577 14.0238 4.56741 15.317 5.69893L20.7984 10.4952C21.7091 11.292 21.7091 12.7087 20.7984 13.5055L15.317 18.3017C14.0238 19.4332 12 18.5149 12 16.7965V14.2041L7.31701 18.3017C6.02384 19.4332 4 18.5149 4 16.7965V7.20409Z"
      fill={color}
    />
  </svg>
);
