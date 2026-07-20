import type { IconProps } from "@/icons/types";

export const AirpodLeftIcon = ({
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
    <title>Airpod Left</title>
    <path
      d="M9 3C10.2756 3 11.4399 3.47746 12.3232 4.26367C12.8087 4.69581 13 5.35103 13 6.00098V9.99902C13 10.649 12.8087 11.3042 12.3232 11.7363C11.4399 12.5225 10.2756 13 9 13C8.65756 13 8.32308 12.966 8 12.9004V19C8 20.1046 7.10457 21 6 21C4.89543 21 4 20.1046 4 19V8C4 5.23858 6.23858 3 9 3Z"
      fill={color}
    />
    <path
      d="M16 13C16.5523 13 17 13.4477 17 14V19H19C19.5523 19 20 19.4477 20 20C20 20.5523 19.5523 21 19 21H16C15.4477 21 15 20.5523 15 20V14C15 13.4477 15.4477 13 16 13Z"
      fill={color}
    />
  </svg>
);
