import type { IconProps } from "@/icons/types";

export const ChevronLargeRightIcon = ({
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
    <title>Chevron Large Right</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.51454 2.12602C9.99732 1.85781 10.6061 2.03176 10.8743 2.51454L15.3347 10.5433C15.8381 11.4493 15.8381 12.5511 15.3347 13.4571L10.8743 21.4858C10.6061 21.9686 9.99732 22.1426 9.51454 21.8743C9.03175 21.6061 8.85781 20.9973 9.12603 20.5145L13.5864 12.4858C13.7542 12.1838 13.7542 11.8166 13.5864 11.5146L9.12602 3.48582C8.85781 3.00304 9.03176 2.39424 9.51454 2.12602Z"
      fill={color}
    />
  </svg>
);
