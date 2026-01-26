import type { IconProps } from "@/icons/types";

export const PlayIcon = ({
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
    <title>Play</title>
    <path
      d="M9.57648 2.53365C7.57781 1.29918 5 2.73688 5 5.08605V18.914C5 21.2632 7.57781 22.7009 9.57648 21.4664L20.7705 14.5524C22.6686 13.3801 22.6686 10.6199 20.7705 9.44763L9.57648 2.53365Z"
      fill={color}
    />
  </svg>
);
