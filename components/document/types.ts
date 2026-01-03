import type { Author } from "@/lib/authors";
import type { Page } from "@/lib/source";

export type AgentState = "thinking" | "listening" | "talking" | null;

export type AudioStatus =
  | "idle"
  | "loading"
  | "ready"
  | "unavailable"
  | "error";

export type PlaybackRate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  normalized: string;
}

/**
 * Serializable page data that can be passed to client components.
 * This excludes functions like `body`, `getText`, `getMDAST` etc.
 */
export interface SerializablePageData {
  slugs: string[];
  url: string;
  audioUrl?: string;
  timestamps?: WordTimestamp[];
  data: {
    title: string;
    description?: string;
    author: string;
    coauthors?: string[];
    date: {
      published: string;
    };
  };
}

export interface DocumentContextValue {
  page: SerializablePageData;
  author: Author;
  coauthors: Author[];
  colors: [string, string];
  // Audio controls
  audioRef: React.RefObject<HTMLAudioElement | null>;
  status: AudioStatus;
  isPlaying: boolean;
  isPlayerVisible: boolean;
  currentTime: number;
  duration: number;
  agentState: AgentState;
  autoScroll: boolean;
  playbackRate: PlaybackRate;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  audioUrl: string | null;
  // Actions
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  showPlayer: () => void;
  hidePlayer: () => void;
  togglePlayer: () => void;
  setAutoScroll: (enabled: boolean) => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setIsLooping: (looping: boolean) => void;
  download: () => void;
}

/**
 * Helper to extract serializable data from a Page object.
 */
export function toSerializablePageData(page: Page): SerializablePageData {
  return {
    slugs: page.slugs ?? [],
    url: page.url,
    audioUrl: (page as { audioUrl?: string }).audioUrl,
    timestamps: (page as { timestamps?: WordTimestamp[] }).timestamps,
    data: {
      title: page.data.title,
      description: page.data.description,
      author: page.data.author,
      coauthors: page.data.coauthors,
      date: {
        published: page.data.date.published,
      },
    },
  };
}
