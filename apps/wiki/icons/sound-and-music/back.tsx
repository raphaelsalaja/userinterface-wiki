import type { IconProps } from "@/icons/types";

export const BackIcon = ({
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
    <title>Back</title>
    <path
      d="M16.9184 4.33419C18.2342 3.45793 20 4.39881 20 5.98303V18.0171C20 19.6013 18.2342 20.5422 16.9184 19.6659L7.88317 13.6489C6.70561 12.8647 6.70561 11.1354 7.88317 10.3512L16.9184 4.33419Z"
      fill={color}
    />
    <path
      d="M4 5.00005C4 4.44776 4.44771 4.00005 5 4.00005C5.55229 4.00005 6 4.44776 6 5.00005V19C6 19.5523 5.55229 20 5 20C4.44771 20 4 19.5523 4 19V5.00005Z"
      fill={color}
    />
  </svg>
);
