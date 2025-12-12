import type * as React from "react";

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

export interface ValueProps {
  children?: React.ReactNode | ((value: string) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

export interface ChipsProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

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

export interface ChipRemoveProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  index: number;
}
