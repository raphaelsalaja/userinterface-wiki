"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import styles from "./styles.module.css";

interface ShortcutProps {
  shortcut: {
    label: string;
    /** Literal text to display, e.g. "-15s". */
    command?: string;
    /** Hotkey string rendered platform-aware (Cmd vs Ctrl), e.g. "Mod+K". */
    hotkey?: string;
  };
  children: React.ReactElement;
}

export function Shortcut({ shortcut, children }: ShortcutProps) {
  const command = shortcut.hotkey
    ? formatForDisplay(shortcut.hotkey)
    : shortcut.command;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={8} side="top">
          <Tooltip.Popup className={styles.tooltip}>
            <span>{shortcut.label}</span>
            {command && <kbd className={styles.kbd}>{command}</kbd>}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
