import type * as React from "react";

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

export interface BackdropProps {
  className?: string;
  style?: React.CSSProperties;
}
