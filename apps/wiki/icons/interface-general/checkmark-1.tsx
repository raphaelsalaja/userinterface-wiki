import type { IconProps } from "@/icons/types";

export const Checkmark1Icon = ({
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
    <title>Checkmark 1</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.3209 4.24472C20.0142 4.69807 20.2088 5.62768 19.7555 6.32105L11.2555 19.321C10.9972 19.7161 10.5681 19.9665 10.0971 19.997C9.62613 20.0276 9.16825 19.8347 8.86111 19.4764L4.36111 14.2264C3.82198 13.5974 3.89482 12.6504 4.52381 12.1113C5.1528 11.5722 6.09975 11.645 6.63888 12.274L9.83825 16.0066L17.2445 4.6793C17.6979 3.98593 18.6275 3.79136 19.3209 4.24472Z"
      fill={color}
    />
  </svg>
);
