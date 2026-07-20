import type { IconProps } from "@/icons/types";

export const ArrowUndoDownIcon = ({
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
    <title>Arrow Undo Down</title>
    <path
      d="M7.20696 18.2929C7.59748 18.6834 7.59748 19.3166 7.20696 19.7071C6.81643 20.0976 6.18327 20.0976 5.79274 19.7071L2.49985 16.4142C1.7188 15.6332 1.7188 14.3668 2.49985 13.5858L5.79274 10.2929C6.18327 9.90237 6.81643 9.90237 7.20696 10.2929C7.59748 10.6834 7.59748 11.3166 7.20696 11.7071L4.91406 14H17C18.6569 14 20 12.6569 20 11V10C20 8.34315 18.6569 7 17 7H12C11.4477 7 11 6.55229 11 6C11 5.44771 11.4477 5 12 5H17C19.7614 5 22 7.23858 22 10V11C22 13.7614 19.7614 16 17 16H4.91406L7.20696 18.2929Z"
      fill={color}
    />
  </svg>
);
