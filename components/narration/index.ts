export { Captions, type CaptionsProps } from "./captions";
export {
  HighlightedListItem,
  HighlightedParagraph,
  HighlightedText,
  type HighlightedTextProps,
} from "./highlighted-text";
export {
  type CaptionsState,
  useCaptions,
  type WordSegment,
} from "./hooks/use-captions";
export { Player } from "./player";
export { Provider, useNarration } from "./provider";
export type {
  AgentState,
  Alignment,
  AudioStatus,
  NarrationContextValue,
  PlaybackRate,
} from "./types";

import { Captions } from "./captions";
import { HighlightedListItem, HighlightedParagraph } from "./highlighted-text";
import { Player } from "./player";
import { Provider } from "./provider";

export {
  Provider as NarrationProvider,
  Player as NarrationPlayer,
  Captions as NarrationCaptions,
  HighlightedParagraph as NarrationParagraph,
  HighlightedListItem as NarrationListItem,
};
