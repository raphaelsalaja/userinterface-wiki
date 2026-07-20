import type { IconProps } from "@/icons/types";

export const CrossSmallIcon = ({
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
    <title>Cross Small</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.18934 7.18934C7.77513 6.60355 8.72487 6.60355 9.31066 7.18934L12 9.87868L14.6893 7.18934C15.2751 6.60355 16.2249 6.60355 16.8107 7.18934C17.3964 7.77513 17.3964 8.72487 16.8107 9.31066L14.1213 12L16.8107 14.6893C17.3964 15.2751 17.3964 16.2249 16.8107 16.8107C16.2249 17.3964 15.2751 17.3964 14.6893 16.8107L12 14.1213L9.31066 16.8107C8.72487 17.3964 7.77513 17.3964 7.18934 16.8107C6.60355 16.2249 6.60355 15.2751 7.18934 14.6893L9.87868 12L7.18934 9.31066C6.60355 8.72487 6.60355 7.77513 7.18934 7.18934Z"
      fill={color}
    />
  </svg>
);
