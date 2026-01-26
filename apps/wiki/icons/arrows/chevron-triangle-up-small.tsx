import type { IconProps } from "@/icons/types";

export const ChevronTriangleUpSmallIcon = ({
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
    <title>Chevron Triangle Up Small</title>
    <path
      d="M9.52231 14.25C8.27409 14.25 7.57194 12.8144 8.33828 11.8291L10.816 8.64354C11.4165 7.87143 12.5835 7.87142 13.184 8.64354L15.6617 11.8291C16.428 12.8144 15.7259 14.25 14.4777 14.25H9.52231Z"
      fill={color}
    />
  </svg>
);
