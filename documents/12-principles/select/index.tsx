import "./styles.css";

import { Select } from "@base-ui-components/react/select";

interface RootProps extends React.ComponentProps<typeof Select.Root> {}

const Root: React.FC<RootProps> = ({ ...props }) => {
  return <Select.Root data-rs-select-root {...props} />;
};

interface TriggerProps extends React.ComponentProps<typeof Select.Trigger> {}

const Trigger: React.FC<TriggerProps> = ({ ...props }) => {
  return <Select.Trigger data-rs-select-trigger {...props} />;
};

interface ValueProps extends React.ComponentProps<typeof Select.Value> {}

const Value: React.FC<ValueProps> = ({ ...props }) => {
  return <Select.Value data-rs-select-value {...props} />;
};

interface IconProps extends React.ComponentProps<typeof Select.Icon> {}

const Icon: React.FC<IconProps> = ({ ...props }) => {
  return <Select.Icon data-rs-select-icon {...props} />;
};

interface PortalProps extends React.ComponentProps<typeof Select.Portal> {}

const Portal: React.FC<PortalProps> = ({ ...props }) => {
  return <Select.Portal {...props} />;
};

interface PositionerProps
  extends React.ComponentProps<typeof Select.Positioner> {}

const Positioner: React.FC<PositionerProps> = ({
  alignItemWithTrigger = false,
  sideOffset = 8,
  ...props
}) => {
  return (
    <Select.Positioner
      alignItemWithTrigger={alignItemWithTrigger}
      sideOffset={sideOffset}
      data-rs-select-positioner
      {...props}
    />
  );
};

interface PopupProps extends React.ComponentProps<typeof Select.Popup> {}

const Popup: React.FC<PopupProps> = ({ ...props }) => {
  return <Select.Popup data-rs-select-popup {...props} />;
};

interface ArrowProps extends React.ComponentProps<typeof Select.Arrow> {}

const Arrow: React.FC<ArrowProps> = ({ ...props }) => {
  return <Select.Arrow {...props} />;
};

interface ItemProps extends React.ComponentProps<typeof Select.Item> {}

const Item: React.FC<ItemProps> = ({ ...props }) => {
  return <Select.Item data-rs-select-item {...props} />;
};

interface ItemIndicatorProps
  extends React.ComponentProps<typeof Select.ItemIndicator> {}

const ItemIndicator: React.FC<ItemIndicatorProps> = ({ ...props }) => {
  return <Select.ItemIndicator {...props} />;
};

interface ItemTextProps extends React.ComponentProps<typeof Select.ItemText> {}

const ItemText: React.FC<ItemTextProps> = ({ ...props }) => {
  return <Select.ItemText data-rs-select-item-text {...props} />;
};

const Group: React.FC<React.ComponentProps<typeof Select.Group>> = ({
  ...props
}) => {
  return <Select.Group data-rs-select-group {...props} />;
};

const GroupLabel: React.FC<React.ComponentProps<typeof Select.GroupLabel>> = ({
  ...props
}) => {
  return <Select.GroupLabel data-rs-select-group-label {...props} />;
};

const Separator: React.FC<React.ComponentProps<typeof Select.Separator>> = (
  props,
) => {
  return <Select.Separator data-rs-select-separator {...props} />;
};

const ScrollUpArrow: React.FC<
  React.ComponentProps<typeof Select.ScrollUpArrow>
> = (props) => {
  return <Select.ScrollUpArrow data-rs-select-scroll-arrow {...props} />;
};

const ScrollDownArrow: React.FC<
  React.ComponentProps<typeof Select.ScrollDownArrow>
> = (props) => {
  return <Select.ScrollDownArrow data-rs-select-scroll-arrow {...props} />;
};

export const DesignSelect = {
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Positioner,
  Popup,
  Arrow,
  Item,
  ItemIndicator,
  ItemText,
  Group,
  GroupLabel,
  Separator,
  ScrollUpArrow,
  ScrollDownArrow,
};
