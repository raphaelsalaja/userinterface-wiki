import type * as React from "react";

import type { SearchProviderProps } from "../../internals/context";

export interface RootProps extends SearchProviderProps {
  className?: string | ((state: { open: boolean }) => string);
  style?:
    | React.CSSProperties
    | ((state: { open: boolean }) => React.CSSProperties);
  render?: React.ReactElement;
}
