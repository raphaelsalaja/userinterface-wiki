import type { IconProps } from "@/icons/types";

export const ChevronLargeDownIcon = ({
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
    <title>Chevron Large Down</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.12602 9.51454C2.39424 9.03176 3.00304 8.85781 3.48583 9.12602L11.5145 13.5864C11.8166 13.7542 12.1838 13.7542 12.4858 13.5864L20.5145 9.12602C20.9973 8.85781 21.6061 9.03176 21.8743 9.51454C22.1426 9.99732 21.9686 10.6061 21.4858 10.8743L13.4571 15.3347C12.551 15.8381 11.4493 15.8381 10.5433 15.3347L2.51454 10.8743C2.03176 10.6061 1.85781 9.99732 2.12602 9.51454Z"
      fill={color}
    />
  </svg>
);
