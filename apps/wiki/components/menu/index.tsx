import { Menu as BaseMenu } from "@base-ui/react/menu";
import { sounds } from "@/lib/sounds";
import styles from "./styles.module.css";

function MenuRoot({ onOpenChange, ...props }: BaseMenu.Root.Props) {
  function handleOpenChange(
    open: boolean,
    eventDetails: BaseMenu.Root.ChangeEventDetails,
  ) {
    if (open) {
      sounds.pop();
    }
    onOpenChange?.(open, eventDetails);
  }

  return <BaseMenu.Root onOpenChange={handleOpenChange} {...props} />;
}

interface MenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Trigger> {}
function MenuTrigger({ ...props }: MenuTriggerProps) {
  return <BaseMenu.Trigger className={styles.trigger} {...props} />;
}

interface MenuPortalProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Portal> {}
function MenuPortal({ ...props }: MenuPortalProps) {
  return <BaseMenu.Portal {...props} />;
}

interface MenuBackdropProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Backdrop> {}
function MenuBackdrop({ ...props }: MenuBackdropProps) {
  return <BaseMenu.Backdrop className={styles.backdrop} {...props} />;
}

interface MenuPositionerProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Positioner> {}
function MenuPositioner({ ...props }: MenuPositionerProps) {
  return <BaseMenu.Positioner className={styles.positioner} {...props} />;
}

interface MenuPopupProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Popup> {}
function MenuPopup({ ...props }: MenuPopupProps) {
  return <BaseMenu.Popup className={styles.popup} {...props} />;
}

interface MenuArrowProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Arrow> {}
function MenuArrow({ ...props }: MenuArrowProps) {
  return <BaseMenu.Arrow className={styles.arrow} {...props} />;
}

interface MenuItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Item> {}
function MenuItem({ ...props }: MenuItemProps) {
  return <BaseMenu.Item className={styles.item} {...props} />;
}

interface MenuRichItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Item> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  external?: boolean;
}
function MenuRichItem({
  icon,
  title,
  description,
  external,
  ...props
}: MenuRichItemProps) {
  return (
    <BaseMenu.Item className={styles.itemRich} {...props}>
      {icon && <span className={styles.itemIcon}>{icon}</span>}
      <span className={styles.itemContent}>
        <span className={styles.itemTitle}>
          {title}
          {external && (
            <svg
              className={styles.itemExternal}
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>External link</title>
              <path
                d="M3.5 2.5H9.5V8.5M9 3L3 9"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {description && (
          <span className={styles.itemDescription}>{description}</span>
        )}
      </span>
    </BaseMenu.Item>
  );
}

interface MenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Separator> {}
function MenuSeparator({ ...props }: MenuSeparatorProps) {
  return <BaseMenu.Separator className={styles.separator} {...props} />;
}

interface MenuGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.Group> {}
function MenuGroup({ ...props }: MenuGroupProps) {
  return <BaseMenu.Group {...props} />;
}

interface MenuGroupLabelProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel> {}
function MenuGroupLabel({ ...props }: MenuGroupLabelProps) {
  return <BaseMenu.GroupLabel className={styles.label} {...props} />;
}

interface MenuRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioGroup> {}
function MenuRadioGroup({ ...props }: MenuRadioGroupProps) {
  return <BaseMenu.RadioGroup {...props} />;
}

interface MenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItem> {}
function MenuRadioItem({ ...props }: MenuRadioItemProps) {
  return <BaseMenu.RadioItem className={styles.item} {...props} />;
}

interface MenuRadioItemIndicatorProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.RadioItemIndicator> {}
function MenuRadioItemIndicator({ ...props }: MenuRadioItemIndicatorProps) {
  return (
    <BaseMenu.RadioItemIndicator className={styles.indicator} {...props} />
  );
}

interface MenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem> {}
function MenuCheckboxItem({ ...props }: MenuCheckboxItemProps) {
  return <BaseMenu.CheckboxItem className={styles.item} {...props} />;
}

interface MenuCheckboxItemIndicatorProps
  extends React.ComponentPropsWithoutRef<
    typeof BaseMenu.CheckboxItemIndicator
  > {}
function MenuCheckboxItemIndicator({
  ...props
}: MenuCheckboxItemIndicatorProps) {
  return (
    <BaseMenu.CheckboxItemIndicator className={styles.indicator} {...props} />
  );
}

interface MenuSubmenuRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuRoot> {}
function MenuSubmenuRoot({ ...props }: MenuSubmenuRootProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

interface MenuSubmenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof BaseMenu.SubmenuTrigger> {}
function MenuSubmenuTrigger({ ...props }: MenuSubmenuTriggerProps) {
  return <BaseMenu.SubmenuTrigger className={styles.trigger} {...props} />;
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Backdrop: MenuBackdrop,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Item: MenuItem,
  RichItem: MenuRichItem,
  Separator: MenuSeparator,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  SubmenuRoot: MenuSubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
  createHandle: BaseMenu.createHandle,
};
