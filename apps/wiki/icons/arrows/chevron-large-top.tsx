import type { IconProps } from "@/icons/types";

export const ChevronLargeTopIcon = ({
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
    <title>Chevron Large Top</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4858 10.413C12.1838 10.2452 11.8166 10.2452 11.5145 10.413L3.48583 14.8733C3.00304 15.1416 2.39424 14.9676 2.12602 14.4848C1.85781 14.0021 2.03176 13.3932 2.51454 13.125L10.5433 8.66464C11.4493 8.16127 12.551 8.16127 13.4571 8.66464L21.4858 13.125C21.9686 13.3932 22.1426 14.0021 21.8743 14.4848C21.6061 14.9676 20.9973 15.1416 20.5145 14.8733L12.4858 10.413Z"
      fill={color}
    />
  </svg>
);
