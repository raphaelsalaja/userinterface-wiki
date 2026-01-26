"use client";

import { Select } from "@base-ui/react/select";

import styles from "./styles.module.css";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Carrot", value: "carrot" },
];

function ChevronDownIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Chevron Down</title>
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Checkmark</title>
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Divider() {
  return (
    <svg
      viewBox="0 0 4 200"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.divider}
    >
      <title>Divider</title>
      <line
        x1="2"
        y1="2"
        x2="2"
        y2="200"
        stroke="var(--gray-4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function SelectDemo({
  caption,
  animation,
}: {
  caption: string;
  animation?: string;
}) {
  return (
    <div className={styles.select} data-caption={caption}>
      <Select.Root items={items} defaultValue={items[0].value}>
        <Select.Trigger className={styles.trigger} style={{ width: 120 }}>
          <Select.Value className={styles.value} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            className={styles.positioner}
            alignItemWithTrigger={false}
            sideOffset={8}
          >
            <Select.ScrollUpArrow />
            <Select.Popup className={styles.popup} data-animation={animation}>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  className={styles.item}
                >
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckmarkIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
            <Select.ScrollDownArrow />
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export function StraightAheadActionAndPoseToPose() {
  return (
    <div className={styles.container}>
      <SelectDemo caption="Straight Ahead" />
      <Divider />
      <SelectDemo caption="Pose to Pose" animation="pose-to-pose" />
      <Divider />
      <SelectDemo caption="Blending Both" animation="blend" />
    </div>
  );
}
