"use client";

import { Button } from "@base-ui/react/button";
import { Menu } from "@base-ui/react/menu";
import { Slider } from "@base-ui/react/slider";
import { Tooltip } from "@base-ui/react/tooltip";
import clsx from "clsx";
import {
  Check,
  FastForward,
  Pause,
  Play,
  Rewind,
  Settings,
  Volume,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { getGradientColors } from "@/lib/utils/colors";
import { normalizeWord } from "@/lib/utils/strings";
import { Orb } from "../orb";
import styles from "./styles.module.css";

type AgentState = "thinking" | "listening" | "talking" | null;
type ReaderStatus = "loading" | "ready" | "error";
type PlaybackRate = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
  normalized: string;
}

export interface PlaybackProps {
  slugSegments: string[];
  title: string;
  authorName: string;
}

interface PlaybackState {
  audioUrl: string | null;
  timestamps: WordTimestamp[];
  status: ReaderStatus;
  errorMessage: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  agentState: AgentState;
  autoScroll: boolean;
  playbackRate: PlaybackRate;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
}

interface PlaybackActions {
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
  setAutoScroll: (enabled: boolean) => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  setVolume: (volume: number) => void;
  setIsMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setIsLooping: (looping: boolean) => void;
  reset: () => void;
}

type PlaybackStore = PlaybackState & PlaybackActions;

const createInitialState = (): PlaybackState => ({
  audioUrl: null,
  timestamps: [],
  status: "loading",
  errorMessage: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  agentState: null,
  autoScroll: true,
  playbackRate: 1,
  volume: 1,
  isMuted: false,
  isLooping: false,
});

const usePlaybackStore = create<PlaybackStore>((set) => ({
  ...createInitialState(),
  setAudioData: ({ audioUrl, timestamps }) =>
    set(() => ({ audioUrl, timestamps })),
  setStatus: (status) =>
    set((state) => ({
      status,
      errorMessage: status === "error" ? state.errorMessage : null,
    })),
  setError: (message) => set(() => ({ errorMessage: message })),
  setIsPlaying: (isPlaying) => set(() => ({ isPlaying })),
  setCurrentTime: (time) => set(() => ({ currentTime: time })),
  setDuration: (duration) => set(() => ({ duration })),
  setAgentState: (agentState) => set(() => ({ agentState })),
  setAutoScroll: (enabled) => set(() => ({ autoScroll: enabled })),
  setPlaybackRate: (rate) => set(() => ({ playbackRate: rate })),
  setVolume: (volume) =>
    set(() => ({ volume: Math.max(0, Math.min(1, volume)) })),
  setIsMuted: (muted) => set(() => ({ isMuted: muted })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setIsLooping: (looping) => set(() => ({ isLooping: looping })),
  reset: () => set(() => createInitialState()),
}));

const ICON_TRANSITION = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.18 },
};

const PLAYBACK_RATES: PlaybackRate[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface SpanMeta {
  element: HTMLElement;
  normalized: string;
}

const BASE_WINDOW = 0.02;
const MAX_WINDOW = 0.12;

function collectSpans(): SpanMeta[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-word-id]"),
  ).map((element) => ({
    element,
    normalized:
      element.dataset.wordNormalized ||
      normalizeWord(element.textContent ?? ""),
  }));
}

function alignTimeline(timestamps: WordTimestamp[], spans: SpanMeta[]) {
  const mapping: number[] = new Array(timestamps.length).fill(-1);
  let spanIndex = 0;

  timestamps.forEach((entry, entryIndex) => {
    const normalized = entry.normalized;
    if (!normalized) return;

    for (let i = spanIndex; i < spans.length; i += 1) {
      const candidate = spans[i];
      if (!candidate.normalized) continue;
      if (candidate.normalized === normalized) {
        mapping[entryIndex] = i;
        spanIndex = i + 1;
        return;
      }
    }
  });

  return mapping;
}

function locateWordIndex(
  currentTime: number,
  timestamps: WordTimestamp[],
  lastIndex: number,
) {
  if (!timestamps.length) return -1;

  const startOf = (entry: WordTimestamp) => entry.start ?? entry.end ?? 0;
  const endOf = (entry: WordTimestamp) => entry.end ?? entry.start ?? 0;

  const clampedLastIndex = Math.max(
    -1,
    Math.min(lastIndex, timestamps.length - 1),
  );

  if (clampedLastIndex >= 0) {
    const previous = timestamps[clampedLastIndex];
    const window = resolveWindow(previous);
    const prevStart = startOf(previous) - window;
    const prevEnd = endOf(previous) + window;

    if (currentTime >= prevStart && currentTime <= prevEnd) {
      return clampedLastIndex;
    }
  }

  let index = clampedLastIndex;

  if (index === -1) {
    if (currentTime < startOf(timestamps[0]) - BASE_WINDOW) {
      return -1;
    }
    index = 0;
  }

  while (
    index + 1 < timestamps.length &&
    currentTime >= startOf(timestamps[index + 1]) - BASE_WINDOW
  ) {
    index += 1;
  }

  while (index > 0 && currentTime < startOf(timestamps[index]) - BASE_WINDOW) {
    index -= 1;
  }

  const current = timestamps[index];
  const currentStart = startOf(current);
  const currentEnd = endOf(current);
  const window = resolveWindow(current);
  const withinCurrent =
    currentTime >= currentStart - window && currentTime <= currentEnd + window;

  if (withinCurrent) {
    return index;
  }

  if (currentTime > currentEnd + window) {
    if (index + 1 >= timestamps.length) {
      return timestamps.length - 1;
    }

    const nextStart = startOf(timestamps[index + 1]);
    if (currentTime < nextStart - BASE_WINDOW) {
      return index;
    }

    return index + 1;
  }

  if (currentTime < currentStart - window) {
    if (index === 0) {
      return -1;
    }
    return index - 1;
  }

  return index;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function resolveWindow(entry: WordTimestamp) {
  const span = Math.max(
    BASE_WINDOW,
    Math.abs((entry.end ?? 0) - (entry.start ?? 0)),
  );
  return Math.min(MAX_WINDOW, span * 0.5);
}

function usePlayback({ slugSegments, title, authorName }: PlaybackProps) {
  const slugKey = useMemo(() => slugSegments.join("/"), [slugSegments]);

  const colors = useMemo(
    () => getGradientColors(slugSegments.join("-")),
    [slugSegments],
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const spansRef = useRef<SpanMeta[]>([]);
  const mappingRef = useRef<number[]>([]);
  const activeSpanRef = useRef<HTMLElement | null>(null);
  const activeBlockRef = useRef<HTMLElement | null>(null);
  const lastWordIndexRef = useRef(-1);
  const isUserScrollingRef = useRef(false);
  const scrollTimerRef = useRef<number | null>(null);

  const {
    audioUrl,
    timestamps,
    status,
    errorMessage,
    isPlaying,
    currentTime,
    duration,
    agentState,
    autoScroll,
    playbackRate,
    volume,
    isMuted,
    isLooping,
    setAudioData,
    setStatus,
    setError,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setAgentState,
    setAutoScroll,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setIsLooping,
    reset,
  } = usePlaybackStore(
    useShallow((state) => ({
      audioUrl: state.audioUrl,
      timestamps: state.timestamps,
      status: state.status,
      errorMessage: state.errorMessage,
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      duration: state.duration,
      agentState: state.agentState,
      autoScroll: state.autoScroll,
      playbackRate: state.playbackRate,
      volume: state.volume,
      isMuted: state.isMuted,
      isLooping: state.isLooping,
      setAudioData: state.setAudioData,
      setStatus: state.setStatus,
      setError: state.setError,
      setIsPlaying: state.setIsPlaying,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
      setAgentState: state.setAgentState,
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

  const startTicker = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const frame = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [setCurrentTime]);

  const clearActiveHighlight = useCallback(() => {
    if (activeSpanRef.current) {
      delete activeSpanRef.current.dataset.wordState;
      activeSpanRef.current = null;
    }

    if (activeBlockRef.current) {
      delete activeBlockRef.current.dataset.wordBlockState;
      activeBlockRef.current = null;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNarration = async () => {
      setStatus("loading");
      setError(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioData({ audioUrl: null, timestamps: [] });
      lastWordIndexRef.current = -1;

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: slugKey }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const { error } = (await response.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(error ?? "Unable to load narration");
        }

        const data = (await response.json()) as {
          audioUrl: string;
          timestamps: WordTimestamp[];
        };

        setAudioData({
          audioUrl: data.audioUrl ?? null,
          timestamps: data.timestamps ?? [],
        });
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[playback]", error);
        setAudioData({ audioUrl: null, timestamps: [] });
        setIsPlaying(false);
        setError("Audio unavailable right now");
        setStatus("error");
      }
    };

    fetchNarration();

    return () => controller.abort();
  }, [
    slugKey,
    setAudioData,
    setError,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setStatus,
  ]);

  useEffect(() => {
    if (!slugKey) return;

    spansRef.current = collectSpans();
    mappingRef.current = [];
    activeSpanRef.current = null;
    activeBlockRef.current = null;
    lastWordIndexRef.current = -1;
  }, [slugKey]);

  useEffect(() => {
    if (!timestamps.length || !spansRef.current.length) {
      mappingRef.current = [];
      return;
    }

    const mapping = alignTimeline(timestamps, spansRef.current);
    mappingRef.current = mapping;

    spansRef.current.forEach((meta) => {
      delete meta.element.dataset.wordTimeIndex;
    });

    mapping.forEach((spanIndex, wordIndex) => {
      if (spanIndex < 0) return;
      const meta = spansRef.current[spanIndex];
      if (!meta) return;
      meta.element.dataset.wordTimeIndex = String(wordIndex);
    });
  }, [timestamps]);

  useEffect(() => {
    const markScrolling = () => {
      isUserScrollingRef.current = true;
      if (typeof scrollTimerRef.current === "number") {
        window.clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = window.setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1200);
    };

    window.addEventListener("wheel", markScrolling, { passive: true });
    window.addEventListener("touchmove", markScrolling, { passive: true });

    return () => {
      window.removeEventListener("wheel", markScrolling);
      window.removeEventListener("touchmove", markScrolling);
      if (typeof scrollTimerRef.current === "number") {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;

      const audio = audioRef.current;
      if (!audio) return;

      const actualTime = audio.currentTime;
      setCurrentTime(actualTime);
      lastWordIndexRef.current = -1;

      if (!audio.paused && isPlaying) {
        startTicker();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, setCurrentTime, startTicker]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const handleMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setAgentState(null);
      setCurrentTime(0);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastWordIndexRef.current = -1;
      clearActiveHighlight();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setAgentState(null);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastWordIndexRef.current = -1;
      clearActiveHighlight();
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setAgentState("talking");
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audioRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    clearActiveHighlight,
    setAgentState,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  ]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioUrl) {
      audio.src = "";
      audio.load();
      return;
    }

    audio.src = audioUrl;
    audio.currentTime = 0;
    audio.load();
  }, [audioUrl]);

  const handleToggle = useCallback(async () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsPlaying(false);
      setAgentState(null);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setAgentState("talking");
      startTicker();
    } catch (error) {
      console.error("[playback]", error);
      setError("Playback failed");
      setStatus("error");
    }
  }, [
    audioUrl,
    isPlaying,
    setAgentState,
    setError,
    setStatus,
    startTicker,
    setIsPlaying,
  ]);

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) return;
      const clampedTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
      lastWordIndexRef.current = -1;
    },
    [duration, setCurrentTime],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handleToggle();
          break;
        case "ArrowLeft":
          e.preventDefault();
          seek(audio.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          seek(audio.currentTime + 5);
          break;
        case "KeyJ":
          e.preventDefault();
          seek(audio.currentTime - 15);
          break;
        case "KeyL":
          e.preventDefault();
          seek(audio.currentTime + 15);
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggle, seek, toggleMute]);

  const artworkUrl = useMemo(() => {
    if (typeof document === "undefined") return null;

    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    return canvas.toDataURL("image/png");
  }, [colors]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const artwork: MediaImage[] = artworkUrl
      ? [{ src: artworkUrl, sizes: "512x512", type: "image/png" }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: authorName,
      album: "userinterface.wiki",
      artwork,
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });

    navigator.mediaSession.setActionHandler("seekbackward", () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - 10);
    });

    navigator.mediaSession.setActionHandler("seekforward", () => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + 10);
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined) {
        seek(details.seekTime);
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [artworkUrl, authorName, seek, title]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || duration === 0) return;
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: currentTime,
    });
  }, [currentTime, duration]);

  const applyHighlight = useCallback(
    (wordIndex: number) => {
      const spanIndex = mappingRef.current[wordIndex];
      if (typeof spanIndex !== "number" || spanIndex < 0) return;

      const meta = spansRef.current[spanIndex];
      if (!meta || activeSpanRef.current === meta.element) return;

      clearActiveHighlight();
      activeSpanRef.current = meta.element;
      activeSpanRef.current.dataset.wordState = "active";

      const block = meta.element.closest<HTMLElement>(
        "p, li, blockquote, h1, h2, h3, h4, h5, h6",
      );
      if (block) {
        activeBlockRef.current = block;
        block.dataset.wordBlockState = "active";
      }

      if (!autoScroll || isUserScrollingRef.current) return;

      const rect = meta.element.getBoundingClientRect();
      const offset = window.innerHeight * 0.2;
      const outOfView =
        rect.top < offset || rect.bottom > window.innerHeight - offset;

      if (outOfView) {
        meta.element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [autoScroll, clearActiveHighlight],
  );

  useEffect(() => {
    if (!timestamps.length || !isPlaying) return;

    const nextIndex = locateWordIndex(
      currentTime,
      timestamps,
      lastWordIndexRef.current,
    );

    if (nextIndex === lastWordIndexRef.current) return;

    lastWordIndexRef.current = nextIndex;

    if (nextIndex === -1) {
      clearActiveHighlight();
      return;
    }

    applyHighlight(nextIndex);
  }, [
    applyHighlight,
    clearActiveHighlight,
    currentTime,
    isPlaying,
    timestamps,
  ]);

  useEffect(() => {
    if (isPlaying) return;
    lastWordIndexRef.current = -1;
    clearActiveHighlight();
  }, [clearActiveHighlight, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLooping;
    }
  }, [isLooping]);

  const skipForward = useCallback(() => {
    const audio = audioRef.current;
    if (audio) seek(audio.currentTime + 15);
  }, [seek]);

  const skipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (audio) seek(audio.currentTime - 15);
  }, [seek]);

  const copyTimestampUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("t", Math.floor(currentTime).toString());
    navigator.clipboard.writeText(url.toString());
  }, [currentTime]);

  return {
    status,
    errorMessage,
    isPlaying,
    audioUrl,
    duration,
    currentTime,
    agentState,
    setAgentState,
    handleToggle,
    seek,
    skipForward,
    skipBackward,
    autoScroll,
    setAutoScroll,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isLooping,
    setIsLooping,
    copyTimestampUrl,
    colors,
  };
}

const MediaPlayerButton = (props: React.ComponentProps<typeof Button>) => (
  <Button className={styles.mediabutton} {...props} />
);

const Kbd = (props: React.ComponentProps<"kbd">) => (
  <kbd className={styles.kbd} {...props} />
);

const Time = (props: React.ComponentProps<"span">) => (
  <span className={styles.timetext} {...props} />
);

interface TooltipButtonProps extends React.ComponentProps<"button"> {
  label: string;
  shortcut?: string;
  children?: React.ReactNode;
}

const TooltipButton = ({
  label,
  shortcut,
  children,
  ...props
}: TooltipButtonProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger render={<MediaPlayerButton {...props} />}>
      {children}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner sideOffset={8} side="top">
        <Tooltip.Popup className={styles.tooltip}>
          <span>{label}</span>
          {shortcut && <Kbd>{shortcut}</Kbd>}
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
);

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

const VolumeControl = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) => {
  const VolumeIcon = isMuted ? VolumeOff : volume > 0.5 ? Volume2 : Volume;

  return (
    <Menu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Menu.Trigger render={<MediaPlayerButton aria-label="Volume" />}>
              <VolumeIcon />
            </Menu.Trigger>
          }
        />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8} side="top">
            <Tooltip.Popup className={styles.tooltip}>
              <span>Mute</span>
              <Kbd>M</Kbd>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Menu.Portal>
        <Menu.Positioner
          className={styles.menupositioner}
          sideOffset={8}
          align="center"
          side="top"
        >
          <Menu.Popup className={clsx(styles.menupopup, styles.volumepopup)}>
            <Slider.Root
              value={isMuted ? 0 : volume * 100}
              onValueChange={(value) => {
                const v = Array.isArray(value) ? value[0] : value;
                if (v !== undefined) onVolumeChange(v / 100);
              }}
              orientation="vertical"
              aria-label="Volume"
              className={styles.volumeslider}
            >
              <Slider.Control className={styles.volumecontrol}>
                <Slider.Track className={styles.volumetrack}>
                  <Slider.Indicator className={styles.volumefilled} />
                  <Slider.Thumb className={styles.volumethumb} />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
            <MediaPlayerButton
              onClick={onMuteToggle}
              aria-label={isMuted ? "Unmute" : "Mute"}
              style={{ marginTop: 4 }}
            >
              <Volume />
            </MediaPlayerButton>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

interface SettingsMenuProps {
  autoScroll: boolean;
  canDownload: boolean;
  isLooping: boolean;
  playbackRate: PlaybackRate;
  onAutoScrollChange: (value: boolean) => void;
  onDownload: () => void;
  onLoopChange: (looping: boolean) => void;
  onPlaybackRateChange: (rate: PlaybackRate) => void;
  onCopyTimestamp: () => void;
}

const SettingsMenu = ({ onCopyTimestamp, ...props }: SettingsMenuProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyTimestamp = useCallback(() => {
    onCopyTimestamp();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [onCopyTimestamp]);

  return (
    <Menu.Root>
      <Menu.Trigger render={<MediaPlayerButton aria-label="Settings" />}>
        <Settings />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          className={styles.menupositioner}
          sideOffset={16}
          align="end"
          side="top"
        >
          <Menu.Popup className={styles.menupopup}>
            <Menu.CheckboxItem
              checked={props.autoScroll}
              onCheckedChange={props.onAutoScrollChange}
              className={styles.menuitem}
            >
              Auto-scroll
              <Menu.CheckboxItemIndicator
                className={styles.menucheck}
                keepMounted
                render={
                  <AnimatePresence initial={false}>
                    {props.autoScroll && (
                      <motion.div
                        key="auto-scroll"
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                          filter: "blur(2px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
                        transition={{ duration: 0.18 }}
                      >
                        <Check />
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
              />
            </Menu.CheckboxItem>

            <Menu.CheckboxItem
              checked={props.isLooping}
              onCheckedChange={props.onLoopChange}
              className={styles.menuitem}
            >
              Loop
              <Menu.CheckboxItemIndicator
                className={styles.menucheck}
                keepMounted
                render={
                  <AnimatePresence initial={false}>
                    {props.isLooping && (
                      <motion.div
                        key="loop"
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                          filter: "blur(2px)",
                        }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
                        transition={{ duration: 0.18 }}
                      >
                        <Check />
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
              />
            </Menu.CheckboxItem>

            <Menu.Separator className={styles.menuseparator} />

            <Menu.Group className={styles.menugroup}>
              <Menu.GroupLabel className={styles.menulabel}>
                Speed
              </Menu.GroupLabel>
              <Menu.RadioGroup value={props.playbackRate.toString()}>
                {PLAYBACK_RATES.map((rate) => (
                  <Menu.RadioItem
                    key={rate}
                    value={rate.toString()}
                    closeOnClick={false}
                    onClick={() => props.onPlaybackRateChange(rate)}
                    className={clsx(styles.menuitem, styles.speedbutton)}
                  >
                    <span className={styles.speedvalue}>{rate}×</span>
                    <Menu.RadioItemIndicator
                      className={styles.menucheck}
                      keepMounted
                      render={
                        <AnimatePresence initial={false}>
                          {props.playbackRate === rate && (
                            <motion.div
                              key={`speed-${rate}`}
                              initial={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.8,
                                filter: "blur(2px)",
                              }}
                              transition={{ duration: 0.18 }}
                            >
                              <Check />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      }
                    />
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>

            <Menu.Separator className={styles.menuseparator} />

            <Menu.Item
              className={styles.menuitem}
              onClick={handleCopyTimestamp}
            >
              {copied ? "Copied!" : "Share at Timestamp"}
            </Menu.Item>

            <Menu.Item
              className={styles.menuitem}
              onClick={props.onDownload}
              disabled={!props.canDownload}
            >
              Download Audio
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

export const Playback = ({
  slugSegments,
  title,
  authorName,
}: PlaybackProps) => {
  const {
    isPlaying,
    duration,
    currentTime,
    agentState,
    handleToggle,
    seek,
    autoScroll,
    setAutoScroll,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isLooping,
    setIsLooping,
    copyTimestampUrl,
    audioUrl,
    colors,
  } = usePlayback({ slugSegments, title, authorName });

  const readerRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = useCallback(() => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${slugSegments.join("-")}.mp3`;
    link.click();
  }, [audioUrl, slugSegments]);

  const progress =
    duration > 0
      ? Math.min(Math.max((currentTime / duration) * 100, 0), 100)
      : 0;

  const handleSeek = useCallback(
    (value: number | number[]) => {
      const percent = Array.isArray(value) ? value[0] : value;
      if (percent === undefined || duration <= 0) return;
      seek((percent / 100) * duration);
    },
    [duration, seek],
  );

  const onToggle = handleToggle;
  const onSeek = handleSeek;
  const onAutoScrollChange = setAutoScroll;
  const onDownload = handleDownload;
  const onPlaybackRateChange = setPlaybackRate;
  const onVolumeChange = setVolume;
  const onMuteToggle = toggleMute;
  const onLoopChange = setIsLooping;
  const onCopyTimestamp = copyTimestampUrl;

  return (
    <div ref={readerRef} className={styles.reader}>
      <div className={styles.details}>
        <div className={styles.cover}>
          <div className={styles.glow}>
            <Orb
              colors={colors}
              agentState={agentState}
              className={styles.canvas}
            />
          </div>
          <div className={styles.orb}>
            <Orb
              colors={colors}
              agentState={agentState}
              className={styles.canvas}
            />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.title} title={title}>
            {title}
          </div>
          <div className={styles.author}>{authorName}</div>
        </div>
        <div className={styles.voice}>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
          />
        </div>
      </div>

      <Slider.Root
        value={progress}
        onValueChange={onSeek}
        aria-label="Playback progress"
        className={styles.slider}
      >
        <Time>{formatTime(currentTime)}</Time>
        <Slider.Control className={styles.slidercontrol}>
          <Slider.Track className={styles.slidertrack}>
            <Slider.Indicator className={styles.sliderindicator} />
            <Slider.Thumb className={styles.sliderthumb} />
          </Slider.Track>
        </Slider.Control>
        <Time>{formatTime(duration)}</Time>
      </Slider.Root>

      <div className={styles.actions}>
        <div className={styles.left}>
          <TooltipButton
            onClick={() => {
              const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
              const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
              onPlaybackRateChange(PLAYBACK_RATES[nextIndex] ?? 1);
            }}
            aria-label={`Playback speed: ${playbackRate}x`}
            label={`Speed: ${playbackRate}x`}
            className={styles.speedpill}
          >
            {playbackRate}
          </TooltipButton>
        </div>
        <div className={styles.center}>
          <TooltipButton
            onClick={() => seek(Math.max(0, currentTime - 15))}
            aria-label="Rewind 15 seconds"
            label="Rewind"
            shortcut="-15s"
          >
            <Rewind />
          </TooltipButton>
          <TooltipButton
            onClick={onToggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            label={isPlaying ? "Pause" : "Play"}
            shortcut="Space"
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div {...ICON_TRANSITION} key="pause">
                  <Pause scale={32} fill="currentColor" />
                </motion.div>
              ) : (
                <motion.div {...ICON_TRANSITION} key="play">
                  <Play scale={32} />
                </motion.div>
              )}
            </AnimatePresence>
          </TooltipButton>
          <TooltipButton
            onClick={() => seek(Math.min(duration, currentTime + 15))}
            aria-label="Fast forward 15 seconds"
            label="Fast Forward"
            shortcut="+15s"
          >
            <FastForward />
          </TooltipButton>
        </div>
        <div className={styles.right}>
          <SettingsMenu
            autoScroll={autoScroll}
            canDownload={!!audioUrl}
            isLooping={isLooping}
            playbackRate={playbackRate}
            onAutoScrollChange={onAutoScrollChange}
            onDownload={onDownload}
            onLoopChange={onLoopChange}
            onPlaybackRateChange={onPlaybackRateChange}
            onCopyTimestamp={onCopyTimestamp}
          />
        </div>
      </div>
    </div>
  );
};
