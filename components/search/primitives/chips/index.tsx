"use client";

import type * as React from "react";

import { useSearchContext } from "../../internals/context";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ClearProps {
  children?: React.ReactNode;
  className?: string | ((state: ClearState) => string);
  style?: React.CSSProperties | ((state: ClearState) => React.CSSProperties);
  disabled?: boolean;
  keepMounted?: boolean;
}

export interface ClearState {
  hasContent: boolean;
  disabled: boolean;
}

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

export interface ValueProps {
  children?: React.ReactNode | ((value: string) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

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

export interface ChipsProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

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

export interface ChipProps {
  children?: React.ReactNode;
  className?: string | ((state: ChipState) => string);
  style?: React.CSSProperties | ((state: ChipState) => React.CSSProperties);
  index: number;
}

export interface ChipState {
  type: string;
  value: string;
  negated: boolean;
}

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

export interface ChipRemoveProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  index: number;
}

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
