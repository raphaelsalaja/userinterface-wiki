import { Popover as BasePopover } from "@base-ui/react/popover";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

interface PopoverRootProps
  extends React.ComponentPropsWithoutRef<typeof BasePopover.Root> {}
function PopoverRoot({ onOpenChange, ...props }: PopoverRootProps) {
  function handleOpenChange(
    open: boolean,
    eventDetails: BasePopover.Root.ChangeEventDetails,
  ) {
    if (open) {
      sounds.pop();
    }
    onOpenChange?.(open, eventDetails);
  }

  return <BasePopover.Root onOpenChange={handleOpenChange} {...props} />;
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
