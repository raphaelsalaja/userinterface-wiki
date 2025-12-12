// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type {
  ChipPayload,
  SerializedPage,
  SortOrder,
  SuggestionResult,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

export {
  Chip,
  type ChipProps,
  ChipRemove,
  type ChipRemoveProps,
  type ChipState,
  Chips,
  type ChipsProps,
  Clear,
  type ClearProps,
  type ClearState,
  Value,
  type ValueProps,
} from "./primitives/chips";
export { Input, type InputProps, type InputState } from "./primitives/input";
export {
  Empty,
  type EmptyProps,
  Group,
  GroupLabel,
  type GroupLabelProps,
  type GroupProps,
  Item,
  type ItemProps,
  type ItemState,
  List,
  type ListProps,
  Separator,
  type SeparatorProps,
} from "./primitives/list";
export {
  Backdrop,
  type BackdropProps,
  Popup,
  type PopupProps,
  type PopupState,
  Positioner,
  type PositionerProps,
  type PositionerState,
} from "./primitives/popup";
export { Root, type RootProps } from "./primitives/root";

// ─────────────────────────────────────────────────────────────────────────────
// Internals (for advanced use cases)
// ─────────────────────────────────────────────────────────────────────────────

export {
  $createChipNode,
  $isChipNode,
  ChipNode,
} from "./internals/chip-node";
export {
  SearchProvider,
  type SearchProviderProps,
  useSearchContext,
} from "./internals/context";
export {
  FILTER_OPTIONS,
  type FilterOption,
  SORT_OPTIONS,
} from "./internals/filter-options";
export {
  matchesQuery,
  parseSearchQuery,
  serializeSearchQuery,
  sortPages,
} from "./internals/parser";
export { SingleLinePlugin } from "./internals/plugins";
export { useSuggestions } from "./internals/use-suggestions";

// ─────────────────────────────────────────────────────────────────────────────
// Homepage Implementation
// ─────────────────────────────────────────────────────────────────────────────

export { HomeSearch } from "./home-search";

// ─────────────────────────────────────────────────────────────────────────────
// Compound Component Namespace
// ─────────────────────────────────────────────────────────────────────────────

import { Chip, ChipRemove, Chips, Clear, Value } from "./primitives/chips";
import { Input } from "./primitives/input";
import {
  Empty,
  Group,
  GroupLabel,
  Item,
  List,
  Separator,
} from "./primitives/list";
import { Backdrop, Popup, Positioner } from "./primitives/popup";
import { Root } from "./primitives/root";

export const Search = {
  Root,
  Input,
  Popup,
  Positioner,
  Backdrop,
  List,
  Item,
  Group,
  GroupLabel,
  Separator,
  Empty,
  Clear,
  Value,
  Chips,
  Chip,
  ChipRemove,
} as const;
