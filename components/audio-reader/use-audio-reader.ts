import { useCallback, useEffect, useMemo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { getGradientColors } from "@/lib/utils/colors";
import {
  type AgentState,
  type PlaybackRate,
  useAudioReaderStore,
  type WordTimestamp,
} from "./store";
import {
  alignTimeline,
  collectSpans,
  locateWordIndex,
  type SpanMeta,
} from "./utils";

interface ReaderResponse {
  audioUrl: string;
  timestamps: WordTimestamp[];
}

interface AudioReaderHookState {
  status: string;
  errorMessage: string | null;
  isPlaying: boolean;
  audioUrl: string | null;
  duration: number;
  currentTime: number;
  agentState: AgentState;
  playbackRate: PlaybackRate;
  colors: [string, string];
  setAgentState: (state: AgentState) => void;
  handleToggle: () => Promise<void> | void;
  seek: (time: number) => void;
  cyclePlaybackRate: () => void;
}

interface AudioReaderOptions {
  slugSegments: string[];
  title: string;
  authorName: string;
}

export function useAudioReader({
  slugSegments,
  title,
  authorName,
}: AudioReaderOptions): AudioReaderHookState {
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
    playbackRate,
    setAudioData,
    setStatus,
    setError,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setAgentState,
    cyclePlaybackRate,
    reset,
  } = useAudioReaderStore(
    useShallow((state) => ({
      audioUrl: state.audioUrl,
      timestamps: state.timestamps,
      status: state.status,
      errorMessage: state.errorMessage,
      isPlaying: state.isPlaying,
      currentTime: state.currentTime,
      duration: state.duration,
      agentState: state.agentState,
      playbackRate: state.playbackRate,
      setAudioData: state.setAudioData,
      setStatus: state.setStatus,
      setError: state.setError,
      setIsPlaying: state.setIsPlaying,
      setCurrentTime: state.setCurrentTime,
      setDuration: state.setDuration,
      setAgentState: state.setAgentState,
      cyclePlaybackRate: state.cyclePlaybackRate,
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

        const data = (await response.json()) as ReaderResponse;

        setAudioData({
          audioUrl: data.audioUrl ?? null,
          timestamps: data.timestamps ?? [],
        });
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("[audio-reader]", error);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

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
      console.error("[audio-reader]", error);
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
          seek(audio.currentTime - 10);
          break;
        case "KeyL":
          e.preventDefault();
          seek(audio.currentTime + 10);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggle, seek]);

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
      playbackRate,
      position: currentTime,
    });
  }, [currentTime, duration, playbackRate]);

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

      if (isUserScrollingRef.current) return;

      const rect = meta.element.getBoundingClientRect();
      const offset = window.innerHeight * 0.2;
      const outOfView =
        rect.top < offset || rect.bottom > window.innerHeight - offset;

      if (outOfView) {
        meta.element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [clearActiveHighlight],
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
    playbackRate,
    cyclePlaybackRate,
    colors,
  };
}
