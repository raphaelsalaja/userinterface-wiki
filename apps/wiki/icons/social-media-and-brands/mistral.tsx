import type { IconProps } from "@/icons/types";

export const MistralIcon = ({
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
    <title>Mistral</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.4236 16.6857V13.5436H7.2797V16.6857H10.4236ZM13.571 16.6857H10.4236L10.429 19.8287H1V16.6857H4.13672V4.11377H7.2797V7.25675H10.4227V10.3997H13.5657V7.25675H16.7078V4.11377H19.8516V16.6857H23V19.8287H13.571V16.6857ZM13.571 16.6857H16.7078V13.5436H13.5666L13.571 16.6857Z"
      fill={color}
    />
  </svg>
);
