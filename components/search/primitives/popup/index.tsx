"use client";

import type * as React from "react";

import { useSearchContext } from "../../internals/context";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PopupProps {
  children: React.ReactNode;
  className?: string | ((state: PopupState) => string);
  style?: React.CSSProperties | ((state: PopupState) => React.CSSProperties);
  keepMounted?: boolean;
  render?: React.ReactElement;
}

export interface PopupState {
  open: boolean;
  empty: boolean;
}

export interface PositionerProps {
  children: React.ReactNode;
  className?: string | ((state: PositionerState) => string);
  style?:
    | React.CSSProperties
    | ((state: PositionerState) => React.CSSProperties);
  side?: "top" | "bottom";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export interface PositionerState {
  open: boolean;
  side: "top" | "bottom";
  align: "start" | "center" | "end";
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A container for the suggestion list.
 * Renders only when the popup is open (unless keepMounted is true).
 *
 * @example
 * ```tsx
 * <Search.Popup>
 *   <Search.List>{...}</Search.List>
 * </Search.Popup>
 * ```
 */
export function Popup({
  children,
  className,
  style,
  keepMounted = false,
}: PopupProps) {
  const { state, popupRef } = useSearchContext();

  const popupState: PopupState = {
    open: state.open,
    empty: state.filteredPages.length === 0,
  };

  const shouldRender = keepMounted || state.open;

  if (!shouldRender) {
    return null;
  }

  const resolvedClassName =
    typeof className === "function" ? className(popupState) : className;

  const resolvedStyle = typeof style === "function" ? style(popupState) : style;

  const dataAttributes: Record<string, string | undefined> = {
    "data-open": state.open ? "" : undefined,
    "data-closed": !state.open ? "" : undefined,
    "data-empty": popupState.empty ? "" : undefined,
  };

  // Filter out undefined
  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <div
      ref={popupRef as React.RefObject<HTMLDivElement>}
      className={resolvedClassName}
      style={{
        ...resolvedStyle,
        display: state.open ? undefined : "none",
      }}
      {...filteredDataAttributes}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Positioner Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Positions the popup relative to the input.
 * Provides CSS variables for positioning.
 *
 * @example
 * ```tsx
 * <Search.Positioner side="bottom" sideOffset={8}>
 *   <Search.Popup>...</Search.Popup>
 * </Search.Positioner>
 * ```
 */
export function Positioner({
  children,
  className,
  style,
  side = "bottom",
  sideOffset = 8,
  align = "start",
}: PositionerProps) {
  const { state } = useSearchContext();

  const positionerState: PositionerState = {
    open: state.open,
    side,
    align,
  };

  const resolvedClassName =
    typeof className === "function" ? className(positionerState) : className;

  const resolvedStyle =
    typeof style === "function" ? style(positionerState) : style;

  const cssVars = {
    "--side-offset": `${sideOffset}px`,
  } as React.CSSProperties;

  const dataAttributes: Record<string, string | undefined> = {
    "data-open": state.open ? "" : undefined,
    "data-closed": !state.open ? "" : undefined,
    "data-side": side,
    "data-align": align,
  };

  const filteredDataAttributes = Object.fromEntries(
    Object.entries(dataAttributes).filter(([, v]) => v !== undefined),
  );

  return (
    <div
      className={resolvedClassName}
      style={{
        ...cssVars,
        ...resolvedStyle,
        position: "absolute",
        top: side === "bottom" ? "100%" : undefined,
        bottom: side === "top" ? "100%" : undefined,
        left: align === "start" ? 0 : undefined,
        right: align === "end" ? 0 : undefined,
        marginTop: side === "bottom" ? sideOffset : undefined,
        marginBottom: side === "top" ? sideOffset : undefined,
      }}
      {...filteredDataAttributes}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Backdrop Component
// ─────────────────────────────────────────────────────────────────────────────

export interface BackdropProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * An overlay displayed beneath the popup.
 * Useful for closing the popup when clicking outside.
 */
export function Backdrop({ className, style }: BackdropProps) {
  const { state, actions } = useSearchContext();

  if (!state.open) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop handles click to close
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        ...style,
      }}
      data-open=""
      onClick={() => actions.setOpen(false)}
      role="presentation"
    />
  );
}
