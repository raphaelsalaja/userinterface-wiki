import type { IconProps } from "./types";

export const DownloadIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      {...props}
    >
      <title>Download</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 14C4.55228 14 5 14.4477 5 15V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V15C3 14.4477 3.44772 14 4 14Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 15.5C12.2652 15.5 12.5196 15.3946 12.7071 15.2071L16.2071 11.7071C16.5976 11.3166 16.5976 10.6834 16.2071 10.2929C15.8166 9.90237 15.1834 9.90237 14.7929 10.2929L13 12.0858V4C13 3.44771 12.5523 3 12 3C11.4477 3 11 3.44771 11 4V12.0858L9.20711 10.2929C8.81658 9.90237 8.18342 9.90237 7.79289 10.2929C7.40237 10.6834 7.40237 11.3166 7.79289 11.7071L11.2929 15.2071C11.4804 15.3946 11.7348 15.5 12 15.5Z"
        fill={color}
      />
    </svg>
  );
};
