import type { IconProps } from "@/components/icons";

export const CrownIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <title>Crown</title>
      <path
        d="M12.8321 3.4453C12.6466 3.1671 12.3344 3 12 3C11.6657 3 11.3534 3.1671 11.168 3.4453L7.65766 8.71078L2.44725 6.10557C2.10435 5.93412 1.69361 5.9738 1.38987 6.20773C1.08613 6.44165 0.942863 6.82864 1.02105 7.20395L3.02353 16.8158C3.40996 18.6707 5.04474 20 6.93945 20H17.0606C18.9553 20 20.5901 18.6707 20.9765 16.8158L22.979 7.20395C23.0572 6.82864 22.9139 6.44165 22.6102 6.20773C22.3065 5.9738 21.8957 5.93412 21.5528 6.10557L16.3424 8.71078L12.8321 3.4453Z"
        fill={color}
      />
    </svg>
  );
};
