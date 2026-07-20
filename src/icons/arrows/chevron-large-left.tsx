import type { IconProps } from "@/icons/types";

export const ChevronLargeLeftIcon = ({
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
    <title>Chevron Large Left</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.4858 2.12602C14.9686 2.39424 15.1425 3.00304 14.8743 3.48582L10.4139 11.5146C10.2461 11.8166 10.2461 12.1838 10.4139 12.4858L14.8743 20.5145C15.1425 20.9973 14.9686 21.6061 14.4858 21.8743C14.003 22.1426 13.3942 21.9686 13.126 21.4858L8.66562 13.4571C8.16224 12.5511 8.16224 11.4493 8.66561 10.5433L13.126 2.51454C13.3942 2.03176 14.003 1.85781 14.4858 2.12602Z"
      fill={color}
    />
  </svg>
);
