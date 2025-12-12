import type * as React from "react";

export interface InputProps {
  placeholder?: string;
  className?: string | ((state: InputState) => string);
  style?: React.CSSProperties | ((state: InputState) => React.CSSProperties);
  render?: React.ReactElement;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export interface InputState {
  open: boolean;
  disabled: boolean;
  hasContent: boolean;
}
