import type * as React from "react";

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

export interface EmptyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
