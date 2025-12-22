import { Popover as BasePopover } from "@base-ui/react/popover";
import styles from "./styles.module.css";

interface PopoverRootProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Root> {}
function PopoverRoot({ ...props }: PopoverRootProps) {
  return <BasePopover.Root {...props} />;
}

interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> {}
function PopoverTrigger({ ...props }: PopoverTriggerProps) {
  return <BasePopover.Trigger className={styles.trigger} {...props} />;
}

interface PopoverPortalProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Portal> {}
function PopoverPortal({ ...props }: PopoverPortalProps) {
  return <BasePopover.Portal {...props} />;
}

interface PopoverPositionerProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Positioner> {}
function PopoverPositioner({ ...props }: PopoverPositionerProps) {
  return <BasePopover.Positioner {...props} />;
}

interface PopoverPopupProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Popup> {}
function PopoverPopup({ ...props }: PopoverPopupProps) {
  return <BasePopover.Popup className={styles.popup} {...props} />;
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
};
