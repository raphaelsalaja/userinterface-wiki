"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useDebounceCallback,
  useEventListener,
  useIsClient,
  useLocalStorage,
} from "usehooks-ts";
import { useShallow } from "zustand/react/shallow";
import type { Author } from "@/lib/authors";
import { getGradientColors } from "@/lib/colors";
import { DocumentContext } from "./context";
import {
  alignTimestamps,
  clearHighlight,
  collectWordPositions,
  highlightWord,
  scrollToWord,
  type WordPosition,
} from "./highlight";
import { useAudioStore } from "./store";
import type {
  DocumentContextValue,
  SerializablePageData,
  WordTimestamp,
} from "./types";
import { locateWordIndex } from "./utils";

interface RootProps {
  data: SerializablePageData;
  author: Author;
  coauthors?: Author[];
  children: React.ReactNode;
  className?: string;
}

export function Root({
  data: page,
  author,
  coauthors = [],
  children,
  className,
}: RootProps) {
  const slugKey = useMemo(() => page.slugs?.join("/") ?? "", [page.slugs]);

  const colors = useMemo(
    () => getGradientColors(page.slugs?.join("-") ?? ""),
    [page.slugs],
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordPositionsRef = useRef<WordPosition[]>([]);
  const mappingRef = useRef<number[]>([]);
  const lastWordIndexRef = useRef(-1);
  const isUserScrollingRef = useRef(false);

  const {
    audioUrl,
    timestamps,
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
    setAudioData,
    setStatus,
    setError,
    setIsPlaying,
    setIsPlayerVisible,
    setCurrentTime,
    setDuration,
    setAgentState,
    setAutoScroll,
    setPlaybackRate,
    setVolume,
    toggleMute,
    setIsLooping,
    reset,
  } = useAudioStore(
    useShallow((state) => ({
      audioUrl: state.audioUrl,
      timestamps: state.timestamps,
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
      setAudioData: state.setAudioData,
      setStatus: state.setStatus,
      setError: state.setError,
      setIsPlaying: state.setIsPlaying,
      setIsPlayerVisible: state.setIsPlayerVisible,
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

  // Persisted audio preferences
  const isClient = useIsClient();
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [storedVolume, setStoredVolume] = useLocalStorage("audio-volume", 1);
  const [storedMuted, setStoredMuted] = useLocalStorage("audio-muted", false);
  const [storedAutoScroll, setStoredAutoScroll] = useLocalStorage(
    "audio-autoscroll",
    true,
  );
  const [storedPlaybackRate, setStoredPlaybackRate] = useLocalStorage<
    typeof playbackRate
  >("audio-playback-rate", 1);
  const [storedLooping, setStoredLooping] = useLocalStorage(
    "audio-looping",
    false,
  );

  // Sync store from localStorage on mount (client-side only)
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run once on mount to avoid infinite loops with stored values
  useEffect(() => {
    if (!isClient) return;
    setVolume(storedVolume);
    if (storedMuted) toggleMute();
    setAutoScroll(storedAutoScroll);
    setPlaybackRate(storedPlaybackRate);
    setIsLooping(storedLooping);
    setPreferencesLoaded(true);
  }, [isClient]);

  // Persist preferences to localStorage when they change
  useEffect(() => {
    if (!isClient) return;
    setStoredVolume(volume);
  }, [isClient, volume, setStoredVolume]);

  useEffect(() => {
    if (!isClient) return;
    setStoredMuted(isMuted);
  }, [isClient, isMuted, setStoredMuted]);

  useEffect(() => {
    if (!isClient) return;
    setStoredAutoScroll(autoScroll);
  }, [isClient, autoScroll, setStoredAutoScroll]);

  useEffect(() => {
    if (!isClient) return;
    setStoredPlaybackRate(playbackRate);
  }, [isClient, playbackRate, setStoredPlaybackRate]);

  useEffect(() => {
    if (!isClient) return;
    setStoredLooping(isLooping);
  }, [isClient, isLooping, setStoredLooping]);

  // Reset state on mount
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

  // Collect word positions for highlighting (only once per article)
  useEffect(() => {
    if (!slugKey || !containerRef.current) return;

    // Defer collection to after MDX content has rendered
    const timer = setTimeout(() => {
      if (containerRef.current) {
        wordPositionsRef.current = collectWordPositions(containerRef.current);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slugKey]);

  // Fetch narration (wait for preferences to be loaded)
  useEffect(() => {
    if (!slugKey || !preferencesLoaded) return;

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
        // Simplified: no voice parameter, using single voice from server config
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: slugKey }),
          signal: controller.signal,
        });

        if (!response.ok) {
          // Narration not available - degrade gracefully
          setAudioData({ audioUrl: null, timestamps: [] });
          setStatus("unavailable");
          return;
        }

        const pageData = (await response.json()) as {
          audioUrl: string;
          timestamps: WordTimestamp[];
        };

        setAudioData({
          audioUrl: pageData.audioUrl ?? null,
          timestamps: pageData.timestamps ?? [],
        });
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[document]", error);
        setAudioData({ audioUrl: null, timestamps: [] });
        setIsPlaying(false);
        setError("Audio unavailable");
        setStatus("error");
      }
    };

    fetchNarration();

    return () => controller.abort();
  }, [
    slugKey,
    preferencesLoaded,
    setAudioData,
    setError,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setStatus,
  ]);

  // Align timestamps to word positions when both are ready
  useEffect(() => {
    if (!timestamps.length || !wordPositionsRef.current.length) {
      mappingRef.current = [];
      return;
    }

    mappingRef.current = alignTimestamps(timestamps, wordPositionsRef.current);
  }, [timestamps]);

  // User scroll detection
  const isProgrammaticScrollRef = useRef(false);

  const resetUserScrolling = useDebounceCallback(() => {
    isUserScrollingRef.current = false;
  }, 800);

  const markScrolling = useCallback(() => {
    // Ignore scroll events triggered by programmatic scrolling
    if (isProgrammaticScrollRef.current) return;
    isUserScrollingRef.current = true;
    resetUserScrolling();
  }, [resetUserScrolling]);

  useEventListener("wheel", markScrolling, undefined, { passive: true });
  useEventListener("touchmove", markScrolling, undefined, { passive: true });

  // Visibility change sync
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible") return;

    const audio = audioRef.current;
    if (!audio) return;

    const actualTime = audio.currentTime;
    setCurrentTime(actualTime);
    lastWordIndexRef.current = -1;

    if (!audio.paused && isPlaying) {
      startTicker();
    }
  }, [isPlaying, setCurrentTime, startTicker]);

  const documentRef = useRef<Document | null>(
    isClient ? document : null,
  ) as React.RefObject<Document>;

  useEventListener("visibilitychange", handleVisibilityChange, documentRef);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Initialize audio element
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
      clearHighlight();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setAgentState(null);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastWordIndexRef.current = -1;
      clearHighlight();
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
  }, [setAgentState, setCurrentTime, setDuration, setIsPlaying]);

  // Load audio source
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

  const play = useCallback(async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setAgentState("talking");
      startTicker();
    } catch (error) {
      console.error("[document]", error);
      setError("Playback failed");
      setStatus("error");
    }
  }, [audioUrl, setAgentState, setError, setStatus, startTicker, setIsPlaying]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
    setAgentState(null);
  }, [setAgentState, setIsPlaying]);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

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

  const skipForward = useCallback(
    (seconds = 15) => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime + seconds);
    },
    [seek],
  );

  const skipBackward = useCallback(
    (seconds = 15) => {
      const audio = audioRef.current;
      if (audio) seek(audio.currentTime - seconds);
    },
    [seek],
  );

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
    if (!audioUrl || !page.slugs?.length) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `${page.slugs.join("-")}.mp3`;
    link.click();
  }, [audioUrl, page.slugs]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
          toggle();
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
    },
    [toggle, seek, toggleMute],
  );

  useEventListener("keydown", handleKeyDown);

  // Media Session API artwork
  const artworkUrl = useMemo(() => {
    if (!isClient) return null;

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
  }, [colors, isClient]);

  // Media Session API
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const artwork: MediaImage[] = artworkUrl
      ? [{ src: artworkUrl, sizes: "512x512", type: "image/png" }]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: page.data.title,
      artist: page.data.author,
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
      skipBackward();
    });

    navigator.mediaSession.setActionHandler("seekforward", () => {
      skipForward();
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
  }, [
    artworkUrl,
    page.data.author,
    page.data.title,
    seek,
    skipBackward,
    skipForward,
  ]);

  // Media Session playback state
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  // Media Session position state
  useEffect(() => {
    if (!("mediaSession" in navigator) || duration === 0) return;
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1,
      position: currentTime,
    });
  }, [currentTime, duration]);

  // Apply word highlight using a single <mark> element
  const applyHighlight = useCallback(
    (wordIndex: number) => {
      highlightWord(wordPositionsRef.current, mappingRef.current, wordIndex);

      if (!autoScroll || isUserScrollingRef.current) return;

      // Mark as programmatic scroll to prevent triggering user scroll detection
      isProgrammaticScrollRef.current = true;
      scrollToWord(wordPositionsRef.current, mappingRef.current, wordIndex);
      // Reset after scroll animation completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    },
    [autoScroll],
  );

  // Word highlighting
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
      clearHighlight();
      return;
    }

    applyHighlight(nextIndex);
  }, [applyHighlight, currentTime, isPlaying, timestamps]);

  // Clear highlight when paused
  useEffect(() => {
    if (isPlaying) return;
    lastWordIndexRef.current = -1;
    clearHighlight();
  }, [isPlaying]);

  // Sync playback rate
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Sync volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync looping
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = isLooping;
    }
  }, [isLooping]);

  // Scroll direction detection for auto-hiding player
  const lastScrollYRef = useRef(0);
  const hasBeenShownRef = useRef(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    if (isPlayerVisible) {
      hasBeenShownRef.current = true;
    }
  }, [isPlayerVisible]);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (!hasBeenShownRef.current) return;

    const delta = current - lastScrollYRef.current;

    if (Math.abs(delta) < 10) {
      lastScrollYRef.current = current;
      return;
    }

    if (delta > 0 && current > 100 && isPlayerVisible) {
      setIsPlayerVisible(false);
    } else if (delta < 0 && !isPlayerVisible) {
      setIsPlayerVisible(true);
    }

    lastScrollYRef.current = current;
  });

  const contextValue: DocumentContextValue = useMemo(
    () => ({
      page,
      colors,
      author,
      coauthors,
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
      page,
      colors,
      author,
      coauthors,
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
    <DocumentContext.Provider value={contextValue}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </DocumentContext.Provider>
  );
}
