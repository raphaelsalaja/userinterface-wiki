"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { getGradientColors } from "@/lib/colors";
import {
  useAudio,
  useKeyboardShortcuts,
  useMediaSession,
  useNarrationFetch,
  usePersistedPreferences,
  useScrollDirection,
} from "./hooks";
import { useNarrationStore } from "./store";
import type { NarrationContextValue } from "./types";

const NarrationContext = createContext<NarrationContextValue | null>(null);

function useNarrationContext(componentName: string): NarrationContextValue {
  const context = useContext(NarrationContext);
  if (!context) {
    throw new Error(
      `<Narration.${componentName}> must be used within <Narration.Provider>`,
    );
  }
  return context;
}

export { useNarrationContext };

interface ProviderProps {
  slug: string;
  title: string;
  authorName: string;
  children: React.ReactNode;
  className?: string;
}

export function Provider({
  slug,
  title,
  authorName,
  children,
  className,
}: ProviderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const colors = useMemo(() => getGradientColors(slug ?? ""), [slug]);

  const {
    audioUrl,
    alignment,
    status,
    isPlaying,
    isPlayerVisible,
    currentTime,
    duration,
    agentState,
    autoScroll,
    playbackRate,
    volume,
    isMuted,
    isLooping,
    setIsPlayerVisible,
    setAutoScroll,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setIsLooping,
    reset,
  } = useNarrationStore(
    useShallow((state) => ({
      audioUrl: state.audioUrl,
      alignment: state.alignment,
      status: state.status,
      isPlaying: state.isPlaying,
      isPlayerVisible: state.isPlayerVisible,
      currentTime: state.currentTime,
      duration: state.duration,
      agentState: state.agentState,
      autoScroll: state.autoScroll,
      playbackRate: state.playbackRate,
      volume: state.volume,
      isMuted: state.isMuted,
      isLooping: state.isLooping,
      setIsPlayerVisible: state.setIsPlayerVisible,
      setAutoScroll: state.setAutoScroll,
      setPlaybackRate: state.setPlaybackRate,
      setVolume: state.setVolume,
      toggleMute: state.toggleMute,
      setIsLooping: state.setIsLooping,
      reset: state.reset,
    })),
  );

  useEffect(() => {
    reset();
  }, [reset]);

  usePersistedPreferences();

  useNarrationFetch({ slug });

  const { audioRef, play, pause, toggle, seek, skipForward, skipBackward } =
    useAudio({});

  useKeyboardShortcuts({ toggle, seek, audioRef });

  useMediaSession({
    title,
    artist: authorName,
    colors,
    audioRef,
    seek,
    skipForward,
    skipBackward,
  });

  useScrollDirection();

  const showPlayer = useCallback(() => {
    setIsPlayerVisible(true);
  }, [setIsPlayerVisible]);

  const hidePlayer = useCallback(() => {
    setIsPlayerVisible(false);
  }, [setIsPlayerVisible]);

  const togglePlayer = useCallback(() => {
    setIsPlayerVisible(!isPlayerVisible);
  }, [isPlayerVisible, setIsPlayerVisible]);

  const download = useCallback(() => {
    if (!audioUrl || !slug) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${slug.replace(/\//g, "-")}.mp3`;
    link.click();
  }, [audioUrl, slug]);

  const contextValue: NarrationContextValue = useMemo(
    () => ({
      slug,
      title,
      authorName,
      colors,
      audioRef,
      status,
      isPlaying,
      isPlayerVisible,
      currentTime,
      duration,
      agentState,
      autoScroll,
      playbackRate,
      volume,
      isMuted,
      isLooping,
      audioUrl,
      alignment,
      play,
      pause,
      toggle,
      seek,
      skipForward,
      skipBackward,
      showPlayer,
      hidePlayer,
      togglePlayer,
      setAutoScroll,
      setPlaybackRate,
      setVolume,
      toggleMute,
      setIsLooping,
      download,
    }),
    [
      slug,
      title,
      authorName,
      colors,
      audioRef,
      status,
      isPlaying,
      isPlayerVisible,
      currentTime,
      duration,
      agentState,
      autoScroll,
      playbackRate,
      volume,
      isMuted,
      isLooping,
      audioUrl,
      alignment,
      play,
      pause,
      toggle,
      seek,
      skipForward,
      skipBackward,
      showPlayer,
      hidePlayer,
      togglePlayer,
      setAutoScroll,
      setPlaybackRate,
      setVolume,
      toggleMute,
      setIsLooping,
      download,
    ],
  );

  return (
    <NarrationContext.Provider value={contextValue}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </NarrationContext.Provider>
  );
}

export function useNarration(): NarrationContextValue {
  return useNarrationContext("useNarration");
}
