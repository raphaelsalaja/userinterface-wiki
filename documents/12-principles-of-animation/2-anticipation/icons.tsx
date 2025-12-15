import type { IconProps } from "@/components/icons";

export const HighPriority = (props: IconProps) => {
  return (
    <svg
      fill="lch(36.659% 3.643 282.498 / 1)"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>High Priority</title>
      <rect width="3" height="6" x="1.5" y="8" rx="1" />
      <rect width="3" height="9" x="6.5" y="5" rx="1" />
      <rect width="3" height="12" x="11.5" y="2" rx="1" />
    </svg>
  );
};

export const InProgress = (props: IconProps) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <title>In Progress</title>
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="lch(80% 90 85)"
        strokeWidth="1.5"
        strokeDasharray="3.14 0"
        strokeDashoffset="-0.7"
      />
      <circle
        cx="7"
        cy="7"
        r="2"
        fill="none"
        stroke="lch(80% 90 85)"
        strokeWidth="4"
        strokeDasharray="12.189379495928398 24.378758991856795"
        strokeDashoffset="6.094689747964199"
        transform="rotate(-90 7 7)"
      />
    </svg>
  );
};

export const Done = (props: IconProps) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <title>Done</title>
      <circle cx="7" cy="7" r="6" fill="lch(70% 40 120)" />
      <path
        d="M4.5 7L6.5 9L10 5.5"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Todo = (props: IconProps) => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <title>To Do</title>
      <circle
        cx="7"
        cy="7"
        r="6"
        fill="none"
        stroke="lch(50% 0 0)"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export function Check(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Check</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.53 7.15214C16.9983 7.44485 17.1407 8.0618 16.848 8.53013L11.848 16.5301C11.6865 16.7886 11.4159 16.9592 11.1132 16.9937C10.8104 17.0282 10.5084 16.9227 10.2929 16.7072L7.29289 13.7072C6.90237 13.3167 6.90237 12.6836 7.29289 12.293C7.68342 11.9025 8.31658 11.9025 8.70711 12.293L10.8182 14.4042L15.152 7.47013C15.4447 7.0018 16.0617 6.85943 16.53 7.15214Z"
        fill={props.color}
      />
    </svg>
  );
}

export function Bolt(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <title>Bolt</title>
      <path
        d="M14.0019 2.40144C14.0019 0.917322 12.077 0.334547 11.2538 1.5694L3.18804 13.668C2.52349 14.6648 3.23807 16.0001 4.43612 16.0001H10.0019V21.5987C10.0019 23.0828 11.9267 23.6656 12.7499 22.4307L20.8157 10.3321C21.4802 9.33528 20.7656 8.00006 19.5676 8.00006H14.0019V2.40144Z"
        fill="inherit"
      />
    </svg>
  );
}

export function Avatar(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <title>Avatar</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM14 11.75C15.2426 11.75 16.25 10.7426 16.25 9.5C16.25 8.25736 15.2426 7.25 14 7.25C12.7574 7.25 11.75 8.25736 11.75 9.5C11.75 10.7426 12.7574 11.75 14 11.75ZM12 20C13.1739 20 14.2887 19.7472 15.293 19.293L10.1213 14.1213C8.94977 12.9497 7.05027 12.9497 5.8787 14.1213L4.70703 15.293C5.9623 18.0687 8.75562 20 12 20Z"
        fill="inherit"
      />
    </svg>
  );
}
