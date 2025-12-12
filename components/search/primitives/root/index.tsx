"use client";

import { SearchProvider } from "../../internals/context";
import type { RootProps } from "./types";

export type { RootProps };

// ─────────────────────────────────────────────────────────────────────────────
// Search.Root
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groups all parts of the search component.
 * Provides state management and context to child components.
 *
 * @example
 * ```tsx
 * <Search.Root pages={pages} allTags={allTags}>
 *   <Search.Input />
 *   <Search.Popup>
 *     <Search.List>
 *       {(item) => <Search.Item value={item}>{item}</Search.Item>}
 *     </Search.List>
 *   </Search.Popup>
 * </Search.Root>
 * ```
 */
export function Root({
  children,
  pages,
  allTags,
  defaultOpen,
  open,
  onOpenChange,
  onQueryChange,
}: RootProps) {
  return (
    <SearchProvider
      pages={pages}
      allTags={allTags}
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      onQueryChange={onQueryChange}
    >
      {children}
    </SearchProvider>
  );
}
