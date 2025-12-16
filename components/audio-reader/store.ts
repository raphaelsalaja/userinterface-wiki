import { create } from "zustand";

export type AgentState = "thinking" | "listening" | "talking" | null;

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  normalized: string;
}

export type ReaderStatus = "loading" | "ready" | "error";

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

interface AudioReaderState {
  audioUrl: string | null;
  timestamps: WordTimestamp[];
  status: ReaderStatus;
  errorMessage: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  agentState: AgentState;
  playbackRate: PlaybackRate;
}

interface AudioReaderActions {
  setAudioData: (payload: {
    audioUrl: string | null;
    timestamps: WordTimestamp[];
  }) => void;
  setStatus: (status: ReaderStatus) => void;
  setError: (message: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setAgentState: (agentState: AgentState) => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  cyclePlaybackRate: () => void;
  reset: () => void;
}

type AudioReaderStore = AudioReaderState & AudioReaderActions;

const createInitialState = (): AudioReaderState => ({
  audioUrl: null,
  timestamps: [],
  status: "loading",
  errorMessage: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  agentState: null,
  playbackRate: 1,
});

export const useAudioReaderStore = create<AudioReaderStore>((set) => ({
  ...createInitialState(),
  setAudioData: ({ audioUrl, timestamps }) =>
    set(() => ({ audioUrl, timestamps })),
  setStatus: (status) =>
    set((state) => ({
      status,
      errorMessage: status === "error" ? state.errorMessage : null,
    })),
  setError: (message) =>
    set(() => ({
      errorMessage: message,
    })),
  setIsPlaying: (isPlaying) => set(() => ({ isPlaying })),
  setCurrentTime: (time) => set(() => ({ currentTime: time })),
  setDuration: (duration) => set(() => ({ duration })),
  setAgentState: (agentState) => set(() => ({ agentState })),
  setPlaybackRate: (rate) => set(() => ({ playbackRate: rate })),
  cyclePlaybackRate: () =>
    set((state) => {
      const currentIndex = PLAYBACK_RATES.indexOf(state.playbackRate);
      const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
      return { playbackRate: PLAYBACK_RATES[nextIndex] };
    }),
  reset: () => set(() => createInitialState()),
}));
