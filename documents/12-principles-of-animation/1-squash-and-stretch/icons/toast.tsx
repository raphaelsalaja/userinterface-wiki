import type { IconProps } from "@/components/icons";

export const ToastIcon = ({
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
      <title>Toast</title>
      <path
        d="M12 3C9.37749 3 6.95383 3.5884 5.1504 4.59031C3.38084 5.5734 2 7.09122 2 9C2 10.4701 2.82568 11.7132 4 12.6468V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V12.6468C21.1743 11.7132 22 10.4701 22 9C22 7.09122 20.6192 5.5734 18.8496 4.59031C17.0462 3.5884 14.6225 3 12 3Z"
        fill={color}
      />
    </svg>
  );
};
