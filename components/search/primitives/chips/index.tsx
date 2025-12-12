"use client";

import { useSearchContext } from "../../internals/context";
import type {
  ChipProps,
  ChipRemoveProps,
  ChipState,
  ChipsProps,
  ClearProps,
  ClearState,
  ValueProps,
} from "./types";

export type {
  ChipProps,
  ChipRemoveProps,
  ChipsProps,
  ChipState,
  ClearProps,
  ClearState,
  ValueProps,
};

// ─────────────────────────────────────────────────────────────────────────────
// Clear Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A button that clears all chips and text when clicked.
 * Hidden when there's no content (unless keepMounted is true).
 *
 * @example
 * ```tsx
 * <Search.Clear>×</Search.Clear>
 * ```
 */
export function Clear({
  children = "×",
  className,
  style,
  disabled = false,
  keepMounted = false,
}: ClearProps) {
  const { state, actions } = useSearchContext();

  const hasContent =
    state.textContent.trim().length > 0 || state.chips.length > 0;

  const clearState: ClearState = {
    hasContent,
    disabled,
  };

  const shouldRender = keepMounted || hasContent;

  if (!shouldRender) {
    return null;
  }

  const resolvedClassName =
    typeof className === "function" ? className(clearState) : className;

  const resolvedStyle = typeof style === "function" ? style(clearState) : style;

  const dataAttributes: Record<string, string | undefined> = {
    "data-has-content": hasContent ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
  };

  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <button
      type="button"
      className={resolvedClassName}
      style={{
        ...resolvedStyle,
        display: hasContent ? undefined : "none",
      }}
      onClick={() => actions.clearAll()}
      disabled={disabled}
      aria-label="Clear search"
      {...filteredDataAttributes}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Value Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Displays the current search value as text.
 */
export function Value({ children, className, style }: ValueProps) {
  const { state } = useSearchContext();

  const value = state.textContent;

  const content =
    typeof children === "function" ? children(value) : (children ?? value);

  return (
    <span className={className} style={style}>
      {content}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chips Container Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A container for chips.
 */
export function Chips({ children, className, style }: ChipsProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Chip Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An individual chip representing a filter.
 */
export function Chip({ children, className, style, index }: ChipProps) {
  const { state } = useSearchContext();

  const chip = state.chips[index];
  if (!chip) return null;

  const chipState: ChipState = {
    type: chip.type,
    value: chip.value,
    negated: chip.negated,
  };

  const resolvedClassName =
    typeof className === "function" ? className(chipState) : className;

  const resolvedStyle = typeof style === "function" ? style(chipState) : style;

  const dataAttributes: Record<string, string | undefined> = {
    "data-chip-type": chip.type,
    "data-negated": chip.negated ? "" : undefined,
  };

  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <div
      className={resolvedClassName}
      style={resolvedStyle}
      {...filteredDataAttributes}
    >
      {children ?? (
        <>
          {chip.negated && <span data-chip-negated-icon="">-</span>}
          <span data-chip-type-label="">{chip.type}:</span>
          <span data-chip-value-label="">{chip.value}</span>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ChipRemove Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A button to remove a chip.
 */
export function ChipRemove({
  children = "×",
  className,
  style,
  index,
}: ChipRemoveProps) {
  const { actions } = useSearchContext();

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => actions.removeChip(index)}
      aria-label="Remove filter"
    >
      {children}
    </button>
  );
}
