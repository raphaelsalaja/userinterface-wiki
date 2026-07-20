import type { IconProps } from "@/icons/types";

export const Checkmark2Icon = ({
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
    <title>Checkmark 2</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.6323 3.03705C22.3023 3.52435 22.4504 4.46248 21.9631 5.13243L10.5072 20.8824C10.2675 21.212 9.904 21.4298 9.50037 21.4859C9.09673 21.5419 8.68767 21.4313 8.36726 21.1795L2.32314 16.4295C1.67179 15.9176 1.55873 14.9746 2.07062 14.3232C2.58251 13.6719 3.52551 13.5588 4.17686 14.0707L8.99686 17.8587L19.5369 3.36778C20.0242 2.69783 20.9624 2.54976 21.6323 3.03705Z"
      fill={color}
    />
  </svg>
);
