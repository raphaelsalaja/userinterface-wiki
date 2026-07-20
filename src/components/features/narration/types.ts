export type AgentState = "thinking" | "listening" | "talking" | null;

export type AudioStatus =
  | "idle"
  | "loading"
  | "ready"
  | "unavailable"
  | "error";

export type PlaybackRate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

/**
 * Character-level alignment data from ElevenLabs with-timestamps API
 */
export interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

export interface NarrationContextValue {
  slug: string;
  title: string;
  authorName: string;
  colors: [string, string];

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
  alignment: Alignment | null;

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
