"use client";

import { Button } from "@base-ui/react/button";
import { Tooltip } from "@base-ui/react/tooltip";
import type { ComponentProps } from "react";
import interactiveStyles from "../styles/interactive.module.css";
import popoverStyles from "../styles/popover.module.css";

export const MediaPlayerButton = (props: ComponentProps<typeof Button>) => (
  <Button className={interactiveStyles.button} {...props} />
);

interface TooltipButtonProps extends ComponentProps<"button"> {
  label: string;
  shortcut?: string;
  children?: React.ReactNode;
}

export const TooltipButton = ({
  label,
  shortcut,
  children,
  ...props
}: TooltipButtonProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger render={<MediaPlayerButton {...props} />}>
      {children}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={8} side="top">
        <Tooltip.Popup className={popoverStyles.tooltip}>
          <span>{label}</span>
          {shortcut && <Kbd>{shortcut}</Kbd>}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);

export const Kbd = (props: ComponentProps<"kbd">) => (
  <kbd className={popoverStyles.kbd} {...props} />
);

export const Time = (props: ComponentProps<"span">) => (
  <span className={interactiveStyles.time} {...props} />
);
