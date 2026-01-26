export { Player } from "./player";
export { Provider, useNarration } from "./provider";
export type {
  AgentState,
  Alignment,
  AudioStatus,
  NarrationContextValue,
  PlaybackRate,
} from "./types";

import { Player } from "./player";
import { Provider } from "./provider";

export { Provider as NarrationProvider, Player as NarrationPlayer };
