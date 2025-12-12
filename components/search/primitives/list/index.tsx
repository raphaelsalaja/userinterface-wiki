"use client";

import type * as React from "react";

import { useSearchContext } from "../../internals/context";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ListProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ItemProps<T = unknown> {
  value: T;
  children?: React.ReactNode;
  className?: string | ((state: ItemState) => string);
  style?: React.CSSProperties | ((state: ItemState) => React.CSSProperties);
  disabled?: boolean;
  onClick?: (value: T) => void;
  index?: number;
}

export interface ItemState {
  highlighted: boolean;
  disabled: boolean;
}

export interface GroupProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface GroupLabelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface SeparatorProps {
  className?: string;
  style?: React.CSSProperties;
  orientation?: "horizontal" | "vertical";
}

// ─────────────────────────────────────────────────────────────────────────────
// List Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A list container for the suggestion items.
 *
 * @example
 * ```tsx
 * <Search.List>
 *   <Search.Item value="tag:animation">animation</Search.Item>
 *   <Search.Item value="tag:design">design</Search.Item>
 * </Search.List>
 * ```
 */
export function List({ children, className, style }: ListProps) {
  return (
    <div className={className} style={style} role="listbox">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Item Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An individual item in the suggestion list.
 *
 * @example
 * ```tsx
 * <Search.Item
 *   value="tag:animation"
 *   onClick={(value) => console.log(value)}
 * >
 *   animation
 * </Search.Item>
 * ```
 */
export function Item<T = unknown>({
  value,
  children,
  className,
  style,
  disabled = false,
  onClick,
  index,
}: ItemProps<T>) {
  const { state } = useSearchContext();

  const isHighlighted = index !== undefined && index === state.highlightedIndex;

  const itemState: ItemState = {
    highlighted: isHighlighted,
    disabled,
  };

  const resolvedClassName =
    typeof className === "function" ? className(itemState) : className;

  const resolvedStyle = typeof style === "function" ? style(itemState) : style;

  const handleClick = () => {
    if (!disabled) {
      onClick?.(value);
    }
  };

  const dataAttributes: Record<string, string | undefined> = {
    "data-highlighted": isHighlighted ? "" : undefined,
    "data-disabled": disabled ? "" : undefined,
  };

  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <button
      type="button"
      role="option"
      className={resolvedClassName}
      style={resolvedStyle}
      onClick={handleClick}
      disabled={disabled}
      aria-selected={isHighlighted}
      {...filteredDataAttributes}
    >
      {children ?? String(value)}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Group Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groups related items with a label.
 *
 * @example
 * ```tsx
 * <Search.Group>
 *   <Search.GroupLabel>Tags</Search.GroupLabel>
 *   <Search.Item value="animation">animation</Search.Item>
 * </Search.Group>
 * ```
 */
export function Group({ children, className, style }: GroupProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GroupLabel Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A label for a group of items.
 */
export function GroupLabel({ children, className, style }: GroupLabelProps) {
  return (
    <div className={className} style={style} role="presentation">
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Separator Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A separator between groups or items.
 */
export function Separator({
  className,
  style,
  orientation = "horizontal",
}: SeparatorProps) {
  return (
    <hr
      className={className}
      style={style}
      aria-orientation={orientation}
      data-orientation={orientation}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty Component
// ─────────────────────────────────────────────────────────────────────────────

export interface EmptyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders its children only when the list is empty.
 */
export function Empty({ children, className, style }: EmptyProps) {
  const { state } = useSearchContext();

  if (state.filteredPages.length > 0) {
    return null;
  }

  return (
    <div className={className} style={style} data-empty="">
      {children}
    </div>
  );
}
