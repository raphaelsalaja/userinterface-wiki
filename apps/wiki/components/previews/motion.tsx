import type { IconProps } from "@/icons/types";

export const MotionPreview = ({ size = 40, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Number(size) * 1.25}
      fill="none"
      {...props}
    >
      <title>Motion Preview</title>
      <g clipPath="url(#a)">
        <rect width="38" height="48" x="1" y="1" fill="var(--gray-2)" rx="2" />
        <path fill="var(--gray-4)" d="M1 1h38v8H1z" />
        <rect width="4" height="4" x="3" y="3" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="9" y="3" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="15" y="3" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="21" y="3" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="27" y="3" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="33" y="3" fill="var(--gray-2)" rx="2" />
        <path fill="var(--gray-4)" d="M1 41h38v8H1z" />
        <rect width="4" height="4" x="3" y="43" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="9" y="43" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="15" y="43" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="21" y="43" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="27" y="43" fill="var(--gray-2)" rx="2" />
        <rect width="4" height="4" x="33" y="43" fill="var(--gray-2)" rx="2" />
      </g>
      <rect
        width="39"
        height="49"
        x=".5"
        y=".5"
        stroke="var(--gray-a4)"
        rx="2.5"
      />
      <defs>
        <clipPath id="a">
          <rect
            width="38"
            height="48"
            x="1"
            y="1"
            fill="var(--gray-1)"
            rx="2"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
