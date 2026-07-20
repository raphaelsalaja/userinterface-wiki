import type { IconProps } from "@/icons/types";

export const CheckCircle2Icon = ({
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
    <title>Check Circle 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.5586 8.1709C15.1005 7.8626 14.4794 7.98355 14.1709 8.44141L10.4727 13.9336L8.70703 12.168C8.31651 11.7774 7.68349 11.7774 7.29297 12.168C6.90244 12.5585 6.90244 13.1915 7.29297 13.582L9.91797 16.207C10.1293 16.4183 10.4243 16.5239 10.7217 16.4951C11.0188 16.4662 11.2873 16.3062 11.4541 16.0586L15.8291 9.55859C16.1374 9.10055 16.0165 8.47937 15.5586 8.1709Z"
      fill={color}
    />
  </svg>
);
