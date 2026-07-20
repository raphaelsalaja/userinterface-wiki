import type { IconProps } from "@/icons/types";

export const SkipIcon = ({
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
    <title>Skip</title>
    <path
      d="M7.0816 4.33419C5.7658 3.45793 4 4.39881 4 5.98303V18.0171C4 19.6013 5.7658 20.5422 7.0816 19.6659L16.1168 13.6489C17.2944 12.8647 17.2944 11.1354 16.1168 10.3512L7.0816 4.33419Z"
      fill={color}
    />
    <path
      d="M20 5.00005C20 4.44776 19.5523 4.00005 19 4.00005C18.4477 4.00005 18 4.44776 18 5.00005V19C18 19.5523 18.4477 20 19 20C19.5523 20 20 19.5523 20 19V5.00005Z"
      fill={color}
    />
  </svg>
);
