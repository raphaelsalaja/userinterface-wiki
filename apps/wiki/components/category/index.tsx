import type React from "react";
import { useMemo } from "react";
import title from "title";
import { Popover } from "@/components/popover";
import { getColorHash } from "@/lib/colors";
import styles from "./styles.module.css";

type RootProps = React.ComponentPropsWithoutRef<"div">;

function Root({ children, ...props }: RootProps) {
  return (
    <div className={styles.root} {...props}>
      {children}
    </div>
  );
}

type ChipContext = "list";

interface ChipProps extends React.ComponentPropsWithoutRef<"span"> {
  label: string;
  context?: ChipContext;
}

function useCategoryColor(label: string) {
  const normalized = String(label);

  const color = useMemo(() => getColorHash(normalized), [normalized]);

  return { normalized, color };
}

function Chip({ label, context, ...props }: ChipProps) {
  const { normalized, color } = useCategoryColor(label);

  return (
    <span className={styles.category} data-context={context} {...props}>
      <span className={styles.dot} style={{ backgroundColor: color }} />
      <span className={styles.label}>{title(normalized)}</span>
    </span>
  );
}

interface OverflowProps {
  categories: string[];
}

function OverflowDot({ label }: { label: string }) {
  const { color } = useCategoryColor(label);

  return <span className={styles.dot} style={{ backgroundColor: color }} />;
}

function Overflow({ categories }: OverflowProps) {
  const visible = categories.slice(0, 3);
  const count = categories.length;

  return (
    <Popover.Root>
      <Popover.Trigger openOnHover className={styles.category}>
        <span className={styles.dots}>
          {visible.map((name) => (
            <OverflowDot key={name} label={name} />
          ))}
        </span>
        <span className={styles.label}>+{count}</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="start">
          <Popover.Popup>
            {categories.map((name) => (
              <Chip key={name} label={name} context="list" />
            ))}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export const Category = {
  Root,
  Chip,
  Overflow,
};
