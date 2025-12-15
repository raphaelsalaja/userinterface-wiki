"use client";

import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { DesignSelect } from "../select";
import styles from "./styles.module.css";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Carrot", value: "carrot" },
];

export function Select({ animation = "straight-ahead" }) {
  return (
    <DesignSelect.Root items={items} defaultValue={items[0].value}>
      <DesignSelect.Trigger style={{ width: 120 }}>
        <DesignSelect.Value />
        <DesignSelect.Icon>
          <ChevronDownIcon />
        </DesignSelect.Icon>
      </DesignSelect.Trigger>
      <DesignSelect.Portal>
        <DesignSelect.Positioner>
          <DesignSelect.ScrollUpArrow />
          <DesignSelect.Popup
            className={styles.popup}
            data-animation={animation}
          >
            {items.map((item) => (
              <DesignSelect.Item key={item.value} value={item.value}>
                <DesignSelect.ItemText>{item.label}</DesignSelect.ItemText>
                <DesignSelect.ItemIndicator>
                  <CheckIcon />
                </DesignSelect.ItemIndicator>
              </DesignSelect.Item>
            ))}
          </DesignSelect.Popup>
          <DesignSelect.ScrollDownArrow />
        </DesignSelect.Positioner>
      </DesignSelect.Portal>
    </DesignSelect.Root>
  );
}

export function StraightAheadActionAndPoseToPose() {
  return (
    <div className={styles.container}>
      <div className={styles.select} data-caption="Straight Ahead">
        <Select />
      </div>
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
          stroke="var(--border-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
        />
      </svg>
      <div
        className={styles.select}
        data-caption="Pose to Pose"
        data-animation="pose-to-pose"
      >
        <Select animation="pose-to-pose" />
      </div>
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
          stroke="var(--border-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
        />
      </svg>
      <div
        className={styles.select}
        data-caption="Blending Both"
        data-animation="blend"
      >
        <Select animation="blend" />
      </div>
    </div>
  );
}
