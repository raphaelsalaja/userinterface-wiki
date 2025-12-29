"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import styles from "./styles.module.css";

interface ShortcutProps {
  shortcut: {
    label: string;
    command?: string;
  };
  children: React.ReactElement;
}

export function Shortcut({ shortcut, children }: ShortcutProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={8} side="top">
          <Tooltip.Popup className={styles.tooltip}>
            <span>{shortcut.label}</span>
            {shortcut.command && (
              <kbd className={styles.kbd}>{shortcut.command}</kbd>
            )}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
